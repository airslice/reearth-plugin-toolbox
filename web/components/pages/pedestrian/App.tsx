/// <reference types="vite-plugin-svgr/client" />

import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import EmptyInfo from "@web/components/atoms/EmptyInfo";
import Line from "@web/components/atoms/Line";
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

  const toggleMoveForward = useCallback(() => {
    if (!isPedestrianMode.current) return;
    if (!moveForwardOn) {
      if (moveBackwardOn) {
        setMoveBackwardOn(false);
        postMsg("endMove", "moveBackward");
      }
      postMsg("doMove", "moveForward");
    } else {
      postMsg("endMove", "moveForward");
    }
    setMoveForwardOn((moveForwardOn) => !moveForwardOn);
  }, [moveForwardOn, moveBackwardOn]);

  const toggleMoveBackward = useCallback(() => {
    if (!isPedestrianMode.current) return;
    if (!moveBackwardOn) {
      if (moveForwardOn) {
        setMoveForwardOn(false);
        postMsg("endMove", "moveForward");
      }
      postMsg("doMove", "moveBackward");
    } else {
      postMsg("endMove", "moveBackward");
    }
    setMoveBackwardOn((moveBackwardOn) => !moveBackwardOn);
  }, [moveBackwardOn, moveForwardOn]);

  const toggleMoveLeft = useCallback(() => {
    if (!isPedestrianMode.current) return;
    if (!moveLeftOn) {
      if (moveRightOn) {
        setMoveRightOn(false);
        postMsg("endMove", "moveRight");
      }
      postMsg("doMove", "moveLeft");
    } else {
      postMsg("endMove", "moveLeft");
    }
    setMoveLeftOn((moveLeftOn) => !moveLeftOn);
  }, [moveLeftOn, moveRightOn]);

  const toggleMoveRight = useCallback(() => {
    if (!isPedestrianMode.current) return;
    if (!moveRightOn) {
      if (moveLeftOn) {
        setMoveLeftOn(false);
        postMsg("endMove", "moveLeft");
      }
      postMsg("doMove", "moveRight");
    } else {
      postMsg("endMove", "moveRight");
    }
    setMoveRightOn((moveRightOn) => !moveRightOn);
  }, [moveRightOn, moveLeftOn]);

  const toggleMoveUp = useCallback(() => {
    if (!isPedestrianMode.current) return;
    if (!moveUpOn) {
      if (moveDownOn) {
        setMoveDownOn(false);
        postMsg("endMove", "moveDown");
      }
      postMsg("doMove", "moveUp");
    } else {
      postMsg("endMove", "moveUp");
    }
    setMoveUpOn((moveUpOn) => !moveUpOn);
  }, [moveUpOn, moveDownOn]);

  const toggleMoveDown = useCallback(() => {
    if (!isPedestrianMode.current) return;
    if (!moveDownOn) {
      if (moveUpOn) {
        setMoveUpOn(false);
        postMsg("endMove", "moveUp");
      }
      postMsg("doMove", "moveDown");
    } else {
      postMsg("endMove", "moveDown");
    }
    setMoveDownOn((moveDownOn) => !moveDownOn);
  }, [moveDownOn, moveUpOn]);

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

  const onSetTheme = useCallback(
    ({ theme, overriddenTheme }: { theme: string; overriddenTheme: Theme }) => {
      console.log(theme, overriddenTheme);
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
        <EmptyInfo>
          Pick up a start point on map. Use mouse turn right and left.
        </EmptyInfo>

        <ArrowWrapper>
          <Line centered>
            <Button
              text={"W"}
              icon="arrowUp"
              buttonStyle="secondary"
              status={moveForwardOn ? "on" : ""}
              onClick={toggleMoveForward}
            />
          </Line>
          <Line centered>
            <Button
              text={"A"}
              icon="arrowLeft"
              buttonStyle="secondary"
              status={moveLeftOn ? "on" : ""}
              extendWidth={true}
              onClick={toggleMoveLeft}
            />
            <Button
              text={"S"}
              icon="arrowDown"
              buttonStyle="secondary"
              status={moveBackwardOn ? "on" : ""}
              extendWidth={true}
              onClick={toggleMoveBackward}
            />
            <Button
              text={"D"}
              icon="arrowRight"
              buttonStyle="secondary"
              status={moveRightOn ? "on" : ""}
              extendWidth={true}
              onClick={toggleMoveRight}
            />
          </Line>
        </ArrowWrapper>
        <Line centered>
          <Button
            text={"Space"}
            icon="arrowLineUp"
            buttonStyle="secondary"
            status={moveUpOn ? "on" : ""}
            extendWidth={true}
            onClick={toggleMoveUp}
          />
          <Button
            text={"Shift"}
            icon="arrowLineDown"
            buttonStyle="secondary"
            status={moveDownOn ? "on" : ""}
            extendWidth={true}
            onClick={toggleMoveDown}
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
