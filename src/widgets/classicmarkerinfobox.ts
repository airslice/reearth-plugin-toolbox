import { ViewportSize } from "src/apiType";

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

const currentSize = [0, 0];
const minHeight = 280;
const onResize = (viewport: ViewportSize) => {
  const halfHeight = viewport.height / 2;
  reearth.ui.resize(
    currentSize[0],
    halfHeight > minHeight ? halfHeight : minHeight
  );
};

const handles: actHandles = {
  resize: (size: [number, number]) => {
    const halfHeight = reearth.viewport.height / 2;
    const maxHeight = halfHeight > minHeight ? halfHeight : minHeight;
    currentSize[0] = size[0];
    currentSize[1] =
      size[1] > maxHeight
        ? maxHeight
        : size[1] < minHeight
        ? minHeight
        : size[1];
    reearth.ui.resize(...currentSize);
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
