import html from "../../dist/web/pedestrian/index.html?raw";
import type { MouseEvent } from "../apiType";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 144, height: 46 });

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  flyTo: ({ target, duration }: { target: any; duration: number }) => {
    (globalThis as any).reearth.visualizer.camera.flyTo(target, { duration });
  },
  setSSCameraController: (enable: boolean) => {
    if (enable) {
      (globalThis as any).reearth.visualizer.camera.enableScreenSpaceControl();
    } else {
      (globalThis as any).reearth.visualizer.camera.disableScreenSpaceControl();
    }
  },
  getInitialCamera: () => {
    (globalThis as any).reearth.ui.postMessage({
      act: "initialCamera",
      payload: (globalThis as any).reearth.visualizer.camera.position,
    });
  },
  getStartCamera: () => {
    (globalThis as any).reearth.ui.postMessage({
      act: "startCamera",
      payload: (globalThis as any).reearth.visualizer.camera.position,
    });
  },
};

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
  (globalThis as any).reearth.ui.postMessage({
    act: "mousedown",
    payload: mousedata,
  });
});

const onMousemove = (mousedata: MouseEvent) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "mousemove",
    payload: mousedata,
  });
};

(globalThis as any).reearth.on("mousemove", onMousemove);

(globalThis as any).reearth.on("mouseup", (mousedata: MouseEvent) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "mouseup",
    payload: mousedata,
  });
});
