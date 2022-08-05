import html from "../../dist/web/starter/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  flyTo: (target: any) => {
    (globalThis as any).reearth.visualizer.camera.flyTo(target);
  },
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

(globalThis as any).reearth.on("mousemove", (mousedata: any) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "mousemove",
    payload: mousedata,
  });
});
