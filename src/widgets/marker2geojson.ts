import { Infobox, Layer } from "src/apiType";

import html from "../../dist/web/marker2geojson/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 44 });

const cachedTheme = {
  theme: undefined,
  backgroundColor: undefined,
  primaryColor: undefined,
};

const updateTheme = () => {
  if (
    cachedTheme.theme ===
      (globalThis as any).reearth.widget.property.customize?.theme &&
    cachedTheme.backgroundColor ===
      (globalThis as any).reearth.widget.property.customize?.backgroundColor &&
    cachedTheme.primaryColor ===
      (globalThis as any).reearth.widget.property.customize?.primaryColor
  ) {
    return;
  }

  cachedTheme.theme = (
    globalThis as any
  ).reearth.widget.property.customize?.theme;
  cachedTheme.backgroundColor = (
    globalThis as any
  ).reearth.widget.property.customize?.backgroundColor;
  cachedTheme.primaryColor = (
    globalThis as any
  ).reearth.widget.property.customize?.primaryColor;

  setTheme();
};

const setTheme = () => {
  (globalThis as any).reearth.ui.postMessage({
    act: "setTheme",
    payload: {
      theme: cachedTheme.theme,
      overriddenTheme: {
        colors: {
          background: cachedTheme.backgroundColor,
          primary: cachedTheme.primaryColor,
        },
      },
    },
  });
};

// Layers
let cachedFolders: { id: string; title: string }[] = [];
const setFolders = () => {
  (globalThis as any).reearth.ui.postMessage({
    act: "setFolders",
    payload: {
      folders: cachedFolders,
    },
  });
};
const updateFolders = () => {
  const folders = (globalThis as any).reearth.layers.layers
    .filter((l: Layer) => l.children !== undefined)
    .map((l: Layer) => ({ id: l.id, title: l.title }))
    .reverse();
  if (
    cachedFolders.length === folders.length &&
    cachedFolders.every(
      (f, i) => f.id === folders[i].id && f.title === folders[i].title
    )
  ) {
    return;
  }
  cachedFolders = folders;
  setFolders();
};

type MarkerInfo = {
  id: string;
  markerProperty?: Partial<Layer["property"]>;
  infobox?: Infobox;
};

const walkLayer = (layer: Layer, markers: MarkerInfo[]) => {
  layer.children?.forEach((l) => {
    if (l.extensionId === "marker") {
      markers.push({
        id: l.id,
        markerProperty: l.property?.default,
        infobox: l.infobox,
      });
    } else if (l.children && l.children.length > 0) {
      walkLayer(l, markers);
    }
  });
};

const getMarkersInFolder = (folderId: string) => {
  const folderLayer = (globalThis as any).reearth.layers.layers.find(
    (l: Layer) => l.id === folderId
  );
  const markers: MarkerInfo[] = [];
  walkLayer(folderLayer, markers);
  (globalThis as any).reearth.ui.postMessage({
    act: "setMarkers",
    payload: {
      markers,
      title: folderLayer?.title,
    },
  });
};

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  getTheme: () => {
    setTheme();
  },
  getFolders: () => {
    setFolders();
  },
  updateFolders,
  getMarkersInFolder,
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

(globalThis as any).reearth.on("update", () => {
  updateTheme();
  updateFolders();
});

updateTheme();
updateFolders();
