import Button from "@web/components/atoms/Button";
import EmptyInfo from "@web/components/atoms/EmptyInfo";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useMemo } from "react";

import "@web/components/molecules/Common/common.css";
import "./app.css";

type LayerData = { [index: string]: any };

const App = () => {
  const downlaodCSV = useCallback(
    (layersdata: LayerData[], propertyNames: string[]) => {
      let csvData = "";

      let row = "";
      for (const propertyName of propertyNames) {
        row += `${propertyName},`;
      }
      row += "\r\n";
      csvData += row;

      try {
        layersdata.forEach((layerdata) => {
          let row = "";
          for (const propertyName of propertyNames) {
            row += `"${
              layerdata[propertyName] !== undefined
                ? layerdata[propertyName]
                : ""
            }",`;
          }
          row += "\r\n";
          csvData += row;
        });
      } catch (error) {
        console.log(error);
      }

      if (csvData) {
        const filename = `reearth-layers-${new Date().getTime()}.csv`;
        //
        const alink = document.createElement("a");
        const _utf = "\uFEFF";
        if (window.Blob) {
          const csvDataBlob = new Blob([_utf + csvData], {
            type: "text/csv",
          });
          alink.href = URL.createObjectURL(csvDataBlob);
        }
        document.body.appendChild(alink);
        alink.setAttribute("download", filename);
        alink.click();
        document.body.removeChild(alink);
      }
    },
    []
  );

  const exportCSV = () => {
    (globalThis as any).parent.postMessage(
      {
        act: "layersdata",
        payload: {
          type: "csv",
        },
      },
      "*"
    );
  };

  const onResize = useCallback((width: number, height: number) => {
    (globalThis as any).parent.postMessage(
      {
        act: "resize",
        payload: [width, height],
      },
      "*"
    );
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      layersdata: ({
        type,
        layersdata,
        propertyNames,
      }: {
        type: string;
        layersdata: LayerData[];
        propertyNames: string[];
      }) => {
        if (type === "csv") {
          downlaodCSV(layersdata, propertyNames);
        }
      },
    };
  }, [downlaodCSV]);

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
      <EmptyInfo>
        <div>We now only support file export in csv format.</div>
      </EmptyInfo>
      <Button text="Export" buttonStyle="secondary" onClick={exportCSV} />
    </Panel>
  );
};

export default App;
