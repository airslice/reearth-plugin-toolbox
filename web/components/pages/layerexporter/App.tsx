import Button from "@web/components/atoms/Button";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useState, useMemo } from "react";

import "@web/components/molecules/Common/common.css";
import "./app.css";

const App = () => {
  const [mouseLocation, setMouseLocation] = useState({ lat: 0, lng: 0 });

  const flyTo = () => {
    (globalThis as any).parent.postMessage(
      {
        act: "flyTo",
        payload: {
          lng: 139.74670369973546,
          lat: 35.659869744800325,
          height: 2015.9398450375584,
          heading: 0.09500238074897371,
          pitch: -0.6734953976277236,
          roll: 0.00011756776520588375,
          fov: 0.75,
        },
      },
      "*"
    );
  };

  const onResize = (width: number, height: number) => {
    (globalThis as any).parent.postMessage(
      {
        act: "resize",
        payload: [width, height],
      },
      "*"
    );
  };

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

  const init = useCallback(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
  }, [actHandles]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Panel title="layerexporter" onResize={onResize} icon="sun">
      <Button text="flyTo" onClick={flyTo} />
      <div>{`lat:${mouseLocation.lat}`}</div>
      <div>{`lng:${mouseLocation.lng}`}</div>
    </Panel>
  );
};

export default App;
