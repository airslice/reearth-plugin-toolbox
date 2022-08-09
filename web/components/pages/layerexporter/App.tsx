import Button from "@web/components/atoms/Button";
import EmptyInfo from "@web/components/atoms/EmptyInfo";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useState, useMemo } from "react";

import "@web/components/molecules/Common/common.css";
import "./app.css";

const App = () => {
  const [mouseLocation, setMouseLocation] = useState({ lat: 0, lng: 0 });

  const exportCSV = () => {
    (globalThis as any).parent.postMessage(
      {
        act: "export",
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
    <Panel title="Layer Exporter" onResize={onResize} icon="export">
      <EmptyInfo text="Please make settings in right panel.">
        <div>Please make settings in right panel.</div>
        <div>We now only support file export in csv format.</div>
      </EmptyInfo>

      <Button text="Export" onClick={exportCSV} />
    </Panel>
  );
};

export default App;
