import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import TextArea from "@web/components/atoms/TextArea";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";

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
        setTheme(theme);
        setOverriddenTheme(overriddenTheme);
      },
      getCaptureScreen: (dataurl: string) => {
        const fileName = "capture.png";
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataurl;
        link.click();
        link.remove();
      },
    };
  }, []);

  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
    postMsg("getTheme");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadScreenshot = useCallback(() => {
    postMsg("captureScreen");
  }, []);

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel
        title="Screen Save"
        icon="camera"
        onResize={onResize}
        onFoldChange={handleActiveChange}
      >
        <TextArea minHeight={60}>
          <span>
            This plugin only support saving image of viewer canvas. <br />
            More details please check{" "}
            <StyledLink
              target="_blank"
              href="https://marketplace.reearth.io/plugins/reearth-plugin-toolbox-screensave"
            >
              here
            </StyledLink>
            .
          </span>
        </TextArea>
        <Button text="Save" extendWidth onClick={downloadScreenshot} />
      </Panel>
    </ThemeProvider>
  );
};

const StyledLink = styled.a`
  display: inline;
  color: ${(props) => props.theme.colors.primary};
`;

export default App;
