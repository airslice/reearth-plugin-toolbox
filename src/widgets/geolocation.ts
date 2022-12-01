import html from "../../dist/web/geolocation/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 208, height: 202 });

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

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  getTheme: () => {
    updateTheme();
  },
  getAutoFollowValue: () => {
    (globalThis as any).reearth.ui.postMessage({
      act: "setAutoFollow",
      payload: {
        autoFollow: (globalThis as any).reearth.widget.property.location
          .autoFollow,
      },
    });
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
