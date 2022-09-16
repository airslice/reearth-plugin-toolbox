/// <reference types="vite-plugin-svgr/client" />

import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import Line from "@web/components/atoms/Line";
import TextArea from "@web/components/atoms/TextArea";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import type { MouseEvent } from "src/apiType";

import { ReactComponent as MouseTip } from "./mousetip.svg";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

  const isActive = useRef(false);
  const isPicking = useRef(false);
  const isPedestrianMode = useRef(false);

  const [buttonText, setButtonText] = useState("Start");
  const [moveForwardOn, setMoveForwardOn] = useState(false);
  const [moveBackwardOn, setMoveBackwardOn] = useState(false);
  const [moveLeftOn, setMoveLeftOn] = useState(false);
  const [moveRightOn, setMoveRightOn] = useState(false);
  const [moveUpOn, setMoveUpOn] = useState(false);
  const [moveDownOn, setMoveDownOn] = useState(false);

  const [moveEnabled, setMoveEnabled] = useState(false);

  type moveType =
    | "moveForward"
    | "moveBackward"
    | "moveUp"
    | "moveDown"
    | "moveRight"
    | "moveLeft";

  const handleMove = useCallback(
    (moveType: moveType, enable?: boolean) => {
      if (!moveType || !isPedestrianMode.current) return;
      const oppositeMoveTypeMap = new Map<moveType, moveType>([
        ["moveForward", "moveBackward"],
        ["moveBackward", "moveForward"],
        ["moveUp", "moveDown"],
        ["moveDown", "moveUp"],
        ["moveLeft", "moveRight"],
        ["moveRight", "moveLeft"],
      ]);
      const moveTypeStatusMap = new Map<moveType, boolean>([
        ["moveForward", moveForwardOn],
        ["moveBackward", moveBackwardOn],
        ["moveUp", moveUpOn],
        ["moveDown", moveDownOn],
        ["moveRight", moveRightOn],
        ["moveLeft", moveLeftOn],
      ]);
      const moveTypeStatusSetterMap = new Map<moveType, any>([
        ["moveForward", setMoveForwardOn],
        ["moveBackward", setMoveBackwardOn],
        ["moveUp", setMoveUpOn],
        ["moveDown", setMoveDownOn],
        ["moveRight", setMoveRightOn],
        ["moveLeft", setMoveLeftOn],
      ]);
      const on =
        enable === undefined ? !moveTypeStatusMap.get(moveType) : enable;
      if (on) {
        const oppositeMoveType = oppositeMoveTypeMap.get(moveType);
        if (oppositeMoveType && moveTypeStatusMap.get(oppositeMoveType)) {
          moveTypeStatusSetterMap.get(oppositeMoveType)(false);
          postMsg("endMove", oppositeMoveType);
        }
        postMsg("doMove", moveType);
      } else {
        postMsg("endMove", moveType);
      }
      moveTypeStatusSetterMap.get(moveType)(on);
    },
    [
      moveForwardOn,
      moveBackwardOn,
      moveUpOn,
      moveDownOn,
      moveRightOn,
      moveLeftOn,
    ]
  );

  const onExit = useCallback(() => {
    postMsg(
      "exitPedestrianMode",
      isPedestrianMode.current && !isPicking.current
    );
    isPedestrianMode.current = false;
    isPicking.current = false;
    setButtonText("Start");
    setMoveForwardOn(false);
    setMoveBackwardOn(false);
    setMoveLeftOn(false);
    setMoveRightOn(false);
    setMoveUpOn(false);
    setMoveDownOn(false);
    setMoveEnabled(false);
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
      setMoveEnabled(true);

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

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPedestrianMode.current || isPicking.current) return;
      const moveType = getMoveTypeFromCode(e.code);
      if (typeof moveType !== "undefined") {
        handleMove(moveType, true);
      }
    },
    [handleMove]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const moveType = getMoveTypeFromCode(e.code);
      if (typeof moveType !== "undefined") {
        handleMove(moveType, false);
      }
    },
    [handleMove]
  );

  const onSetTheme = useCallback(
    ({ theme, overriddenTheme }: { theme: string; overriddenTheme: Theme }) => {
      setTheme(theme);
      setOverriddenTheme(overriddenTheme);
    },
    []
  );

  const actHandles: actHandles = useMemo(() => {
    return {
      click: onClick,
      mousedown: onMouseDown,
      mouseup: onMouseUp,
      setTheme: onSetTheme,
    };
  }, [onClick, onMouseDown, onMouseUp, onSetTheme]);

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

    postMsg("getTheme");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
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
        <TextArea>
          Pick up a start point on map. Use mouse turn right and left.
        </TextArea>

        <ArrowWrapper>
          <Line centered>
            <Button
              text={"W"}
              icon="arrowUp"
              buttonStyle="secondary"
              status={moveForwardOn ? "on" : ""}
              disabled={!moveEnabled}
              width={56}
              onClick={() => handleMove("moveForward")}
            />
          </Line>
          <Line centered>
            <Button
              text={"A"}
              icon="arrowLeft"
              buttonStyle="secondary"
              status={moveLeftOn ? "on" : ""}
              disabled={!moveEnabled}
              extendWidth={true}
              onClick={() => handleMove("moveLeft")}
            />
            <Button
              text={"S"}
              icon="arrowDown"
              buttonStyle="secondary"
              status={moveBackwardOn ? "on" : ""}
              disabled={!moveEnabled}
              extendWidth={true}
              onClick={() => handleMove("moveBackward")}
            />
            <Button
              text={"D"}
              icon="arrowRight"
              buttonStyle="secondary"
              status={moveRightOn ? "on" : ""}
              disabled={!moveEnabled}
              extendWidth={true}
              onClick={() => handleMove("moveRight")}
            />
          </Line>
        </ArrowWrapper>
        <Line centered>
          <Button
            text={"Space"}
            icon="arrowLineUp"
            buttonStyle="secondary"
            status={moveUpOn ? "on" : ""}
            disabled={!moveEnabled}
            extendWidth={true}
            onClick={() => handleMove("moveUp")}
          />
          <Button
            text={"Shift"}
            icon="arrowLineDown"
            buttonStyle="secondary"
            status={moveDownOn ? "on" : ""}
            disabled={!moveEnabled}
            extendWidth={true}
            onClick={() => handleMove("moveDown")}
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
    default:
      return undefined;
  }
}
