import html from "../../dist/web/classicmarkerinfobox/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

const reearth = (globalThis as any).reearth;
reearth.ui.show(html, { width: 0, height: 0 });

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

const closeInfobox = () => {
  reearth.ui.postMessage({
    act: "closeInfobox",
  });
};

const openInfobox = (infobox: any) => {
  reearth.ui.postMessage({
    act: "openInfobox",
    payload: {
      infobox,
    },
  });
};

const onSelect = () => {
  const feature = reearth.layers.selectedFeature;
  if (!feature || !feature.properties?.reearthClassicInfobox) {
    closeInfobox();
  } else {
    openInfobox(feature.properties?.reearthClassicInfobox);
  }
};

const contentSize = [0, 0];
const minHeight = 280;

const onResize = () => {
  reearth.ui.resize(...getFinalSize(contentSize));
};

const getFinalSize = (contentSize: number[]) => {
  const maxHeight = reearth.viewport.height * 0.62;
  return [
    contentSize[0],
    contentSize[1] > maxHeight
      ? maxHeight
      : contentSize[1] < minHeight
      ? minHeight
      : contentSize[1],
  ];
};

const handles: actHandles = {
  resize: (size: [number, number]) => {
    contentSize[0] = size[0];
    contentSize[1] = size[1];
    reearth.ui.resize(...getFinalSize(contentSize));
  },
  getTheme: () => {
    updateTheme();
  },
};

reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

reearth.on("select", onSelect);

reearth.on("resize", onResize);
