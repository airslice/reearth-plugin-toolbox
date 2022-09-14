import Button from "@web/components/atoms/Button";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";

import "@web/components/molecules/Common/common.css";
import "./app.css";

const App = () => {
  const isActive = useRef(false);
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

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

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      setTheme: ({
        theme,
        overriddenTheme,
      }: {
        theme: string;
        overriddenTheme: Theme;
      }) => {
        console.log(theme, overriddenTheme);
        setTheme(theme);
        setOverriddenTheme(overriddenTheme);
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
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel
        title="Starter"
        icon="sun"
        onResize={onResize}
        onFoldChange={handleActiveChange}
      >
        <Button text="Button" />
        <Button text="Button" icon="sun" />
      </Panel>
    </ThemeProvider>
  );
};

export default App;
