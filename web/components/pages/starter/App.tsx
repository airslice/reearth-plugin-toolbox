import Button from "@web/components/atoms/Button";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";

import "@web/components/molecules/Common/common.css";
import "./app.css";

const App = () => {
  const isActive = useRef(false);
  const [mouseLocation, setMouseLocation] = useState({ lat: 0, lng: 0 });

  const onClose = useCallback(() => {}, []);

  const handleActiveChange = useCallback(
    (active: boolean) => {
      isActive.current = active;
      if (!isActive.current) {
        onClose();
      }
    },
    [onClose]
  );

  const flyTo = () => {
    postMsg("flyTo", {
      lng: 139.74670369973546,
      lat: 35.659869744800325,
      height: 2015.9398450375584,
      heading: 0.09500238074897371,
      pitch: -0.6734953976277236,
      roll: 0.00011756776520588375,
      fov: 0.75,
    });
  };

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      mousemove: (mousedata: any) => {
        setMouseLocation({
          lat: mousedata.lat ?? "n/a",
          lng: mousedata.lng ?? "n/a",
        });
      },
    };
  }, []);

  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Panel
      title="Starter"
      icon="sun"
      onResize={onResize}
      onFoldChange={handleActiveChange}
    >
      <Button text="flyTo" onClick={flyTo} />
      <div>{`lat:${mouseLocation.lat}`}</div>
      <div>{`lng:${mouseLocation.lng}`}</div>
    </Panel>
  );
};

export default App;
