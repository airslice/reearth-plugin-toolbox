import Button from "@web/components/atoms/Button";
import TextArea from "@web/components/atoms/TextArea";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useMemo, useState } from "react";

type LayerData = { [index: string]: any };

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

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
    postMsg("resize", [width, height]);
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
      setTheme: ({
        theme,
        overriddenTheme,
      }: {
        theme: string;
        overriddenTheme: Theme;
      }) => {
        setTheme(theme);
        setOverriddenTheme(overriddenTheme);
      },
    };
  }, [downlaodCSV]);

  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
    postMsg("getTheme");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel title="Layer Exporter" onResize={onResize} icon="export">
        <TextArea>
          <div>
            Please make settings in right pannel.
            <br />
            We now only support file export in csv format.
          </div>
        </TextArea>
        <Button text="Export" buttonStyle="secondary" onClick={exportCSV} />
      </Panel>
    </ThemeProvider>
  );
};

export default App;
