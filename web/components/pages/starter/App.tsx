import Button from "@web/components/atoms/Button";
import Divider from "@web/components/atoms/Divider";
import Group from "@web/components/atoms/Group";
import Line from "@web/components/atoms/Line";
import Tag from "@web/components/atoms/Tag";
import TextArea from "@web/components/atoms/TextArea";
import DropdownBox from "@web/components/molecules/DropdownBox";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  useReducer,
} from "react";

const App = () => {
  const isActive = useRef(false);
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const updateReducer = useCallback(
    (num: number): number => (num + 1) % 1_000_000,
    []
  );
  const [, forceUpdate] = useReducer(updateReducer, 0);

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

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel
        title="Starter"
        icon="sun"
        onResize={onResize}
        onFoldChange={handleActiveChange}
      >
        <Button
          text="Toggle Theme"
          icon="sun"
          extendWidth
          onClick={toggleTheme}
        />

        <Divider />

        <Line>
          <Button text="Primary" extendWidth />
          <Button text="Secondary" buttonStyle="secondary" />
        </Line>

        <Group>
          <Line>
            <Button text="ON" buttonStyle="secondary" extendWidth status="on" />
            <Button text="Disabled" extendWidth disabled />
            <Button
              text="Disabled"
              buttonStyle="secondary"
              extendWidth
              disabled
            />
          </Line>
        </Group>

        <TextArea minHeight={60}>NO TAG GROUP SELECTED.</TextArea>

        <Group title="Named Group">
          <Tag text="tag" buttonType="tag" />
          <Tag text="off tag" buttonType="tag" status="off" />
          <Tag text="disabled tag" buttonType="tag" disabled />
        </Group>

        <TextArea>Some sample text</TextArea>

        <DropdownBox
          title="Dropdown Box Swither"
          switcher
          onResize={forceUpdate}
          fixedContent={
            <>
              <Tag text="fixed1" />
              <Tag text="fixed2" />
              <Tag text="fixed3" />
            </>
          }
          mainContent={
            <>
              <Tag text="main1" status="off" />
              <Tag text="main2" status="off" />
              <Tag text="main3" status="off" />
            </>
          }
        ></DropdownBox>

        <DropdownBox
          title="Dropdown Box Folder"
          folder
          onResize={forceUpdate}
          fixedContent={
            <>
              <Tag text="fixed1" />
              <Tag text="fixed2" />
              <Tag text="fixed3" />
            </>
          }
          mainContent={
            <>
              <Tag text="main1" status="off" />
              <Tag text="main2" status="off" />
              <Tag text="main3" status="off" />
            </>
          }
        ></DropdownBox>
      </Panel>
    </ThemeProvider>
  );
};

export default App;
