import html from "../../dist/web/starter/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

const updateTheme = () => {
  (globalThis as any).reearth.ui.postMessage({
    act: "setTheme",
    payload: {
      theme: (globalThis as any).reearth.widget.property.default.theme,
      overriddenTheme: {
        colors: {
          background: (globalThis as any).reearth.widget.property.default
            .backgroundColor,
          primary: (globalThis as any).reearth.widget.property.default
            .primaryColor,
        },
      },
    },
  });
};

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  getTheme: () => {
    updateTheme();
  },
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

(globalThis as any).reearth.on("update", () => {
  updateTheme();
});
