import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import { Paper } from "@web/components/atoms/Paper";
import TextArea from "@web/components/atoms/TextArea";
import { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import { actHandles } from "src/type";

const App: React.FC = () => {
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

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

  const handleDemoModalBtnClick = useCallback(() => {
    postMsg("closeDemoModal");
  }, []);

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Paper>
        <ModalWrapper>
          <TextArea minHeight={60}>DEMO MODAL</TextArea>
          <Button text="Close" extendWidth onClick={handleDemoModalBtnClick} />
        </ModalWrapper>
      </Paper>
    </ThemeProvider>
  );
};

export default App;

const ModalWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;
