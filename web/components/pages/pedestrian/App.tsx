/// <reference types="vite-plugin-svgr/client" />

import styled from "@emotion/styled";
import Button from "@web/components/atoms/Button";
import Line from "@web/components/atoms/Line";
import TextArea from "@web/components/atoms/TextArea";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import L, { Map as LeafletMap } from "leaflet";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import type { CameraPosition, MouseEvent } from "src/apiType";

import { ReactComponent as MouseTip } from "./mousetip.svg";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

  const isActive = useRef(false);
  const isPicking = useRef(false);
  const isPedestrianMode = useRef(false);

  const moveStatus = useRef({
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveRight: false,
    moveLeft: false,
  });

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

  const oppositeMoveTypeMap = useMemo(
    () =>
      new Map<moveType, moveType>([
        ["moveForward", "moveBackward"],
        ["moveBackward", "moveForward"],
        ["moveUp", "moveDown"],
        ["moveDown", "moveUp"],
        ["moveLeft", "moveRight"],
        ["moveRight", "moveLeft"],
      ]),
    []
  );

  const moveTypeStatusSetterMap = useMemo(
    () =>
      new Map<moveType, any>([
        ["moveForward", setMoveForwardOn],
        ["moveBackward", setMoveBackwardOn],
        ["moveUp", setMoveUpOn],
        ["moveDown", setMoveDownOn],
        ["moveRight", setMoveRightOn],
        ["moveLeft", setMoveLeftOn],
      ]),
    []
  );

  const handleMove = useCallback(
    (moveType: moveType, enable?: boolean) => {
      if (!moveType || !isPedestrianMode.current) return;

      const on = enable === undefined ? !moveStatus.current[moveType] : enable;

      if (on) {
        const oppositeMoveType = oppositeMoveTypeMap.get(moveType);

        if (oppositeMoveType && moveStatus.current[oppositeMoveType]) {
          moveStatus.current[oppositeMoveType] = false;
          moveTypeStatusSetterMap.get(oppositeMoveType)(false);
          postMsg("endMove", oppositeMoveType);
        }
        postMsg("doMove", moveType);
      } else {
        postMsg("endMove", moveType);
      }

      moveStatus.current[moveType] = on;
      moveTypeStatusSetterMap.get(moveType)(on);
    },
    [moveStatus, oppositeMoveTypeMap, moveTypeStatusSetterMap]
  );

  const onExit = useCallback(() => {
    postMsg(
      "exitPedestrianMode",
      isPedestrianMode.current && !isPicking.current
    );
    isPedestrianMode.current = false;
    isPicking.current = false;
    moveStatus.current = {
      moveForward: false,
      moveBackward: false,
      moveUp: false,
      moveDown: false,
      moveRight: false,
      moveLeft: false,
    };
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

  const onMainButtonClick = useCallback(() => {
    if (isPedestrianMode.current || isPicking.current) {
      onExit();
    } else {
      isPicking.current = true;
      setButtonText("Exit");
    }
  }, [onExit]);

  const onMoveButtonClick = useCallback(
    (moveType: moveType) => {
      (globalThis as any).parent.document.body.focus();
      handleMove(moveType);
    },
    [handleMove]
  );

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

  const updateMiniMap = useCallback((camera: CameraPosition) => {
    if (miniMap.current) {
      console.log(camera.lat, camera.lng);
      miniMap.current.setView([camera.lat, camera.lng], 18, {
        duration: 0.1,
        easeLinearity: 1,
        noMoveStart: true,
      });
    }
  }, []);

  const onClick = useCallback(
    (mousedata: MouseEvent) => {
      if (!isActive.current || !isPicking.current) return;
      if (mousedata.lat !== undefined && mousedata.lng !== undefined) {
        isPicking.current = false;
        isPedestrianMode.current = true;
        setMoveEnabled(true);

        updateMiniMap({
          lat: mousedata.lat,
          lng: mousedata.lng,
          height: 0,
          heading: 0,
          pitch: 0,
          roll: 0,
          fov: 0.5,
        });

        postMsg("enterPedestrianMode", {
          lng: mousedata.lng,
          lat: mousedata.lat,
        });
      }
    },
    [updateMiniMap]
  );

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
      updateMiniMap: updateMiniMap,
    };
  }, [onClick, onMouseDown, onMouseUp, onSetTheme, updateMiniMap]);

  const execEventHandels = useCallback(
    (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    },
    [actHandles]
  );

  const miniMap = useRef<LeafletMap>();

  const initMiniMap = useCallback(() => {
    miniMap.current = L.map("minimap", {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      boxZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      touchZoom: false,
      easeLinearity: 1,
    }).setView([35.68, 139.78], 18);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(miniMap.current);
  }, []);

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

    (globalThis as any).parent.document.body.setAttribute("tabindex", "0");

    postMsg("getTheme");

    if (!miniMap.current) {
      initMiniMap();
    }

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
          onClick={onMainButtonClick}
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
              onClick={() => onMoveButtonClick("moveForward")}
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
              onClick={() => onMoveButtonClick("moveLeft")}
            />
            <Button
              text={"S"}
              icon="arrowDown"
              buttonStyle="secondary"
              status={moveBackwardOn ? "on" : ""}
              disabled={!moveEnabled}
              extendWidth={true}
              onClick={() => onMoveButtonClick("moveBackward")}
            />
            <Button
              text={"D"}
              icon="arrowRight"
              buttonStyle="secondary"
              status={moveRightOn ? "on" : ""}
              disabled={!moveEnabled}
              extendWidth={true}
              onClick={() => onMoveButtonClick("moveRight")}
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
            onClick={() => onMoveButtonClick("moveUp")}
          />
          <Button
            text={"Shift"}
            icon="arrowLineDown"
            buttonStyle="secondary"
            status={moveDownOn ? "on" : ""}
            disabled={!moveEnabled}
            extendWidth={true}
            onClick={() => onMoveButtonClick("moveDown")}
          />
        </Line>
        <Line>
          <MiniMapContainer id="minimap" />
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

const MiniMapContainer = styled.div`
  width: 100%;
  height: 200px;
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
