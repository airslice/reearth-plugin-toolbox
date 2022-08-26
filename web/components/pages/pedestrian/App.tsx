/// <reference types="vite-plugin-svgr/client" />

import Button from "@web/components/atoms/Button";
import Line from "@web/components/atoms/Line";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";

import type { CameraPosition, MouseEvent } from "../../../../src/apiType";

import { ReactComponent as Tooltip } from "./tooltip.svg";

import "@web/components/molecules/Common/common.css";
import "./app.css";

type screenPos = {
  x: number;
  y: number;
};

const App = () => {
  const isActive = useRef(false);
  const isPicking = useRef(false);
  const isPedestrianMode = useRef(false);
  const isControllingCamera = useRef(false);

  const initialCamera = useRef<CameraPosition>();
  const startCamera = useRef<CameraPosition>();
  const startScreenPos = useRef<screenPos>();

  const [buttonText, setButtonText] = useState("Start");

  const onExit = useCallback(() => {
    isPedestrianMode.current = false;
    isPicking.current = false;
    setButtonText("Start");

    (globalThis as any).parent.postMessage(
      {
        act: "setSSCameraController",
        payload: true,
      },
      "*"
    );

    if (initialCamera.current) {
      (globalThis as any).parent.postMessage(
        {
          act: "flyTo",
          payload: {
            target: initialCamera.current,
            duration: 2,
          },
        },
        "*"
      );

      initialCamera.current = undefined;
    }
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
    (globalThis as any).parent.postMessage(
      {
        act: "resize",
        payload: [width, height],
      },
      "*"
    );
  }, []);

  const handleClick = useCallback((mousedata: MouseEvent) => {
    if (!isActive.current || !isPicking.current) return;
    if (!!mousedata.lat && !!mousedata.lng) {
      isPicking.current = false;
      isPedestrianMode.current = true;

      (globalThis as any).parent.postMessage(
        {
          act: "getInitialCamera",
        },
        "*"
      );

      (globalThis as any).parent.postMessage(
        {
          act: "setSSCameraController",
          payload: false,
        },
        "*"
      );

      (globalThis as any).parent.postMessage(
        {
          act: "flyTo",
          payload: {
            target: {
              lng: mousedata.lng,
              lat: mousedata.lat,
              height: 10,
              heading: 0,
              pitch: 0,
              roll: 0,
              fov: 0.75,
            },
            duration: 2,
          },
        },
        "*"
      );
    }
  }, []);

  const handleMousedown = useCallback((mousedata: MouseEvent) => {
    // console.log("md", mousedata);
    if (!isPedestrianMode.current) return;
    if (!!mousedata.x && !!mousedata.y) {
      isControllingCamera.current = true;

      startScreenPos.current = {
        x: mousedata.x,
        y: mousedata.y,
      };

      (globalThis as any).parent.postMessage(
        {
          act: "getStartCamera",
        },
        "*"
      );
    }
  }, []);

  const handleMousemove = useCallback((mousedata: MouseEvent) => {
    console.log("mv");
    if (
      !isPedestrianMode.current ||
      !isControllingCamera.current ||
      !startCamera.current ||
      !startScreenPos.current ||
      (!mousedata.x && mousedata.x !== 0) ||
      (!mousedata.y && mousedata.y !== 0)
    )
      return;
    const deltaX = mousedata.x - startScreenPos.current.x;
    const deltaY = mousedata.y - startScreenPos.current.y;
    startScreenPos.current.x = mousedata.x;
    startScreenPos.current.y = mousedata.y;
    startCamera.current.heading += deltaX / -1000;
    startCamera.current.pitch += deltaY / 1000;
    (globalThis as any).parent.postMessage(
      {
        act: "flyTo",
        payload: {
          target: startCamera.current,
          duration: 0,
        },
      },
      "*"
    );
  }, []);

  const handleMouseup = useCallback(() => {
    isControllingCamera.current = false;
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      click: handleClick,
      mousedown: handleMousedown,
      mousemove: handleMousemove,
      mouseup: handleMouseup,
      initialCamera: (camera: CameraPosition) => {
        initialCamera.current = camera;
      },
      startCamera: (camera: CameraPosition) => {
        startCamera.current = camera;
      },
    };
  }, [handleClick, handleMousedown, handleMousemove, handleMouseup]);

  const execEventHandels = useCallback(
    (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    },
    [actHandles]
  );

  const init = useCallback(() => {
    (globalThis as any).addEventListener("message", execEventHandels);
  }, [execEventHandels]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Panel
      title="Pedestrian"
      onResize={onResize}
      icon="pedestrian"
      fullWidth={144}
      onFoldChange={handleActiveChange}
    >
      <Button
        text={buttonText}
        buttonStyle="secondary"
        onClick={handleButtonClick}
      />
      <Line centered>
        <Tooltip />
      </Line>
    </Panel>
  );
};

export default App;
