/// <reference types="vite-plugin-svgr/client" />

import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import EmptyInfo from "@web/components/atoms/EmptyInfo";
import Line from "@web/components/atoms/Line";
import Panel from "@web/components/molecules/Panel";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import type { MouseEvent } from "src/apiType";

import { ReactComponent as MouseTip } from "./mousetip.svg";

const App = () => {
  const isActive = useRef(false);
  const isPicking = useRef(false);
  const isPedestrianMode = useRef(false);

  const [buttonText, setButtonText] = useState("Start");

  const onExit = useCallback(() => {
    postMsg(
      "exitPedestrianMode",
      isPedestrianMode.current && !isPicking.current
    );
    isPedestrianMode.current = false;
    isPicking.current = false;
    setButtonText("Start");
  }, []);

  const handleActiveChange = useCallback(
    (active: boolean) => {
      isActive.current = active;
      if (!isActive.current) {
        onExit();
      }
    },
    [onExit]
  );

  const handleButtonClick = useCallback(() => {
    if (isPedestrianMode.current || isPicking.current) {
      onExit();
    } else {
      isPicking.current = true;
      setButtonText("Exit");
    }
  }, [onExit]);

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

  const onClick = useCallback((mousedata: MouseEvent) => {
    if (!isActive.current || !isPicking.current) return;
    if (mousedata.lat !== undefined && mousedata.lng !== undefined) {
      isPicking.current = false;
      isPedestrianMode.current = true;

      postMsg("enterPedestrianMode", {
        lng: mousedata.lng,
        lat: mousedata.lat,
      });
    }
  }, []);

  const onMouseDown = useCallback((mousedata: MouseEvent) => {
    if (!isPedestrianMode.current) return;
    if (mousedata.x !== undefined && mousedata.y !== undefined) {
      postMsg("setLooking", true);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    postMsg("setLooking", false);
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPedestrianMode.current || isPicking.current) return;
    const moveType = getMoveTypeFromCode(e.code);
    if (typeof moveType !== "undefined") {
      postMsg("doMove", moveType);
    }
  }, []);

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    const moveType = getMoveTypeFromCode(e.code);
    if (typeof moveType !== "undefined") {
      postMsg("endMove", moveType);
    }
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      click: onClick,
      mousedown: onMouseDown,
      mouseup: onMouseUp,
    };
  }, [onClick, onMouseDown, onMouseUp]);

  const execEventHandels = useCallback(
    (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    },
    [actHandles]
  );

  useEffect(() => {
    (globalThis as any).addEventListener("message", execEventHandels);

    (globalThis as any).parent.document.addEventListener(
      "keydown",
      onKeyDown,
      false
    );

    (globalThis as any).parent.document.addEventListener(
      "keyup",
      onKeyUp,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme="dark" overriddenTheme={{ colors: {} }}>
      <Panel
        title="Pedestrian"
        onResize={onResize}
        icon="pedestrian"
        fullWidth={208}
        onFoldChange={handleActiveChange}
      >
        <Button
          text={buttonText}
          icon="crosshair"
          buttonStyle="secondary"
          onClick={handleButtonClick}
        />
        <Line centered>
          <MouseTip />
        </Line>
        <EmptyInfo>
          Pick up a start point on map. Use mouse turn right and left.
        </EmptyInfo>

        <ArrowWrapper>
          <Line centered>
            <Button
              text={"W"}
              icon="arrowUp"
              buttonStyle="secondary"
              onClick={handleButtonClick}
            />
          </Line>
          <Line centered>
            <Button
              text={"A"}
              icon="arrowLeft"
              buttonStyle="secondary"
              extendWidth={true}
              onClick={handleButtonClick}
            />
            <Button
              text={"S"}
              icon="arrowDown"
              buttonStyle="secondary"
              extendWidth={true}
              onClick={handleButtonClick}
            />
            <Button
              text={"D"}
              icon="arrowRight"
              buttonStyle="secondary"
              extendWidth={true}
              onClick={handleButtonClick}
            />
          </Line>
        </ArrowWrapper>
        <Line centered>
          <Button
            text={"Space"}
            icon="arrowLineUp"
            buttonStyle="secondary"
            extendWidth={true}
            onClick={handleButtonClick}
          />
          <Button
            text={"Shift"}
            icon="arrowLineDown"
            buttonStyle="secondary"
            extendWidth={true}
            onClick={handleButtonClick}
          />
        </Line>
      </Panel>
    </ThemeProvider>
  );
};

export default App;

const ArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

function postMsg(act: string, payload?: any) {
  (globalThis as any).parent.postMessage(
    {
      act,
      payload,
    },
    "*"
  );
}

function getMoveTypeFromCode(keyCode: string) {
  switch (keyCode) {
    case "KeyW":
      return "moveForward";
    case "KeyS":
      return "moveBackward";
    case "Space":
      return "moveUp";
    case "ShiftLeft":
    case "ShiftRight":
      return "moveDown";
    case "KeyD":
      return "moveRight";
    case "KeyA":
      return "moveLeft";
    case "KeyQ":
      return "lookLeft";
    case "KeyE":
      return "lookRight";
    default:
      return undefined;
  }
}
