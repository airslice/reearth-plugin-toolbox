import html from "../../dist/web/pedestrian/index.html?raw";
import type { MouseEvent, CameraPosition } from "../apiType";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 144, height: 46 });

let initCameraPos: CameraPosition | undefined = undefined;
const flags = {
  looking: false,
  moveForward: false,
  moveBackward: false,
  moveUp: false,
  moveDown: false,
  moveLeft: false,
  moveRight: false,
};
const startPos: { x: number | undefined; y: number | undefined } = {
  x: 0,
  y: 0,
};
const lookFactor = 0.00005;
const lookAmount = {
  x: 0,
  y: 0,
};

const oppositeMove = new Map<keyof typeof flags, keyof typeof flags>([
  ["moveForward", "moveBackward"],
  ["moveBackward", "moveForward"],
  ["moveUp", "moveDown"],
  ["moveDown", "moveUp"],
  ["moveLeft", "moveRight"],
  ["moveRight", "moveLeft"],
]);

const updateCamera = () => {
  const moveRate = (globalThis as any).reearth.camera.position.height / 200.0;

  if (flags.moveForward) {
    (globalThis as any).reearth.camera.moveForward(moveRate);
  }
  if (flags.moveBackward) {
    (globalThis as any).reearth.camera.moveBackward(moveRate);
  }
  if (flags.moveUp) {
    (globalThis as any).reearth.camera.moveUp(moveRate);
  }
  if (flags.moveDown) {
    (globalThis as any).reearth.camera.moveDown(moveRate);
  }
  if (flags.moveLeft) {
    (globalThis as any).reearth.camera.moveLeft(moveRate);
  }
  if (flags.moveRight) {
    (globalThis as any).reearth.camera.moveRight(moveRate);
  }
  if (flags.looking) {
    (globalThis as any).reearth.camera.lookHorizontal(lookAmount.x);
    (globalThis as any).reearth.camera.lookVertical(lookAmount.y);
  }

  if (
    flags.moveForward ||
    flags.moveBackward ||
    flags.moveUp ||
    flags.moveDown ||
    flags.moveRight ||
    flags.moveLeft
  ) {
    (globalThis as any).reearth.camera.moveOverTerrain(1.8);
  }
};

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  enterPedestrianMode: ({ lng, lat }: { lng: number; lat: number }) => {
    initCameraPos = (globalThis as any).reearth.camera.position;
    if (
      (globalThis as any).reearth.scene.property.default?.sceneMode !== "2d"
    ) {
      (globalThis as any).reearth.camera.enableScreenSpaceController(false);
    }
    (globalThis as any).reearth.camera.flyToGround(
      {
        lng,
        lat,
        height: 100,
        heading: initCameraPos?.heading ?? 0,
        pitch: 0,
        roll: 0,
        fov: initCameraPos?.fov ?? 0.75,
      },
      {
        duration: 2,
      },
      20
    );
  },
  exitPedestrianMode: (resetCamera: boolean) => {
    (globalThis as any).reearth.camera.enableScreenSpaceController(true);
    if (resetCamera && initCameraPos) {
      const curCamera = (globalThis as any).reearth.camera.position;
      (globalThis as any).reearth.camera.flyTo(
        {
          lng: curCamera.lng,
          lat: curCamera.lat,
          height: initCameraPos.height,
          heading: initCameraPos.heading,
          pitch: initCameraPos.pitch,
          roll: initCameraPos.roll,
          fov: initCameraPos.fov,
        },
        { duration: 2 }
      );
    }
  },
  setLooking: (looking: boolean) => {
    flags.looking = looking;
  },
  doMove: (moveType: keyof typeof flags) => {
    flags[moveType] = true;
    const op = oppositeMove.get(moveType);
    if (op) {
      flags[op] = false;
    }
  },
  endMove: (moveType: keyof typeof flags) => {
    flags[moveType] = false;
  },
  getTheme: () => {
    updateTheme();
  },
};

const updateTheme = () => {
  (globalThis as any).reearth.ui.postMessage({
    act: "setTheme",
    payload: {
      theme: (globalThis as any).reearth.widget.property.customize?.theme,
      overriddenTheme: {
        colors: {
          background: (globalThis as any).reearth.widget.property.customize
            ?.backgroundColor,
          primary: (globalThis as any).reearth.widget.property.customize
            ?.primaryColor,
        },
      },
    },
  });
};

(globalThis as any).reearth.on("tick", updateCamera);

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

(globalThis as any).reearth.on("click", (mousedata: MouseEvent) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "click",
    payload: mousedata,
  });
});

(globalThis as any).reearth.on("mousedown", (mousedata: MouseEvent) => {
  if (mousedata.x !== undefined && mousedata.y !== undefined) {
    startPos.x = mousedata.x;
    startPos.y = mousedata.y;
  }

  (globalThis as any).reearth.ui.postMessage({
    act: "mousedown",
    payload: mousedata,
  });
});

(globalThis as any).reearth.on("mousemove", (mousedata: MouseEvent) => {
  if (
    flags.looking &&
    mousedata.x !== undefined &&
    mousedata.y !== undefined &&
    startPos.x !== undefined &&
    startPos.y !== undefined
  ) {
    lookAmount.x = (mousedata.x - startPos.x) * lookFactor;
    lookAmount.y = (mousedata.y - startPos.y) * lookFactor;
  }
});

(globalThis as any).reearth.on("mouseup", (mousedata: MouseEvent) => {
  startPos.x = undefined;
  startPos.y = undefined;

  (globalThis as any).reearth.ui.postMessage({
    act: "mouseup",
    payload: mousedata,
  });
});

(globalThis as any).reearth.on("update", () => {
  updateTheme();
});
