import html from "../../dist/web/distance/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

let toolboxFolderId: string | undefined;

const addToolboxFolder = () => {
  (globalThis as any).reearth.layers.add({
    extensionId: "",
    isVisible: true,
    title: `Toolbox`,
    children: [],
    property: {
      customs: {
        id: "toolbox-folder",
      },
    },
  });
};

const findToolboxFolderLayerId = () => {
  const layers = (globalThis as any).reearth.layers.layers;
  for (let i = 0, l = layers.length; i < l; i += 1) {
    if (layers[i].property?.customs?.id === "toolbox-folder") {
      return layers[i].id;
    }
  }
  return false;
};

const findToolboxLayerId = (id: string) => {
  const folder = (globalThis as any).reearth.layers.findById(toolboxFolderId);
  for (let i = 0, l = folder.children.length; i < l; i += 1) {
    if (folder.children[i].property?.customs?.id === id) {
      return folder.children[i].id;
    }
  }
  return false;
};

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  clearPoints: (layerIds: string[]) => {
    (globalThis as any).reearth.layers.hide(...layerIds);
  },
  clearLine: (layerId: string) => {
    (globalThis as any).reearth.layers.hide(layerId);
  },
  addPoint: ({
    lat,
    lng,
    mIndex,
    index,
  }: {
    lat: number;
    lng: number;
    mIndex: number;
    index: number;
  }) => {
    if (!toolboxFolderId) {
      toolboxFolderId = findToolboxFolderLayerId();
      if (!toolboxFolderId) {
        addToolboxFolder();
        toolboxFolderId = findToolboxFolderLayerId();
      }
    }

    const color =
      (globalThis as any).reearth.widget?.property?.default?.pointcolor ??
      "#ff0000";

    const id = `toolbox-distance-${mIndex}-point-${index}`;

    (globalThis as any).reearth.layers.add(
      {
        extensionId: "marker",
        isVisible: true,
        title: id,
        property: {
          default: {
            location: {
              lat,
              lng,
            },
            pointColor: color,
            style: "point",
          },
          customs: {
            id,
          },
        },
      },
      toolboxFolderId
    );

    (globalThis as any).reearth.ui.postMessage({
      act: "pointAdded",
      payload: {
        index,
        layerId: findToolboxLayerId(id),
      },
    });
  },
  addLine: ({
    lat,
    lng,
    mIndex,
  }: {
    lat: number;
    lng: number;
    mIndex: number;
  }) => {
    if (!toolboxFolderId) {
      toolboxFolderId = findToolboxFolderLayerId();
      if (!toolboxFolderId) {
        addToolboxFolder();
        toolboxFolderId = findToolboxFolderLayerId();
      }
    }

    const color =
      (globalThis as any).reearth.widget?.property?.default?.linecolor ??
      "#ff9900";

    const id = `toolbox-distance-${mIndex}-line`;

    (globalThis as any).reearth.layers.add(
      {
        extensionId: "polyline",
        isVisible: true,
        title: id,
        property: {
          default: {
            coordinates: [
              {
                lat,
                lng,
                height: 0,
              },
              {
                lat,
                lng,
                height: 0,
              },
            ],
            strokeColor: color,
            strokeWidth: 5,
            clampToGround: true,
          },
          customs: {
            id,
          },
        },
      },
      toolboxFolderId
    );

    const lineLayerId = findToolboxLayerId(id);

    (globalThis as any).reearth.ui.postMessage({
      act: "lineAdded",
      payload: {
        layerId: lineLayerId,
      },
    });

    (globalThis as any).reearth.layers.hide(lineLayerId);
  },
  updateLine: ({ coords, layerId }: { coords: any[]; layerId: string }) => {
    if (coords.length <= 1) {
      (globalThis as any).reearth.layers.hide(layerId);
    } else {
      const color =
        (globalThis as any).reearth.widget?.property?.default?.linecolor ??
        "#ff9900";
      (globalThis as any).reearth.layers.overrideProperty(layerId, {
        default: {
          coordinates: coords,
          strokeColor: color,
        },
      });
      (globalThis as any).reearth.layers.show(layerId);
    }
  },
  updatePoint: ({ location, layerId }: { location: any; layerId: string }) => {
    (globalThis as any).reearth.layers.overrideProperty(layerId, {
      default: {
        location,
      },
    });
  },
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

(globalThis as any).reearth.on("click", (mousedata: any) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "click",
    payload: mousedata,
  });
});

(globalThis as any).reearth.on("mousemove", (mousedata: any) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "mousemove",
    payload: mousedata,
  });
});

(globalThis as any).reearth.on("rightclick", (mousedata: any) => {
  (globalThis as any).reearth.ui.postMessage({
    act: "rightclick",
    payload: mousedata,
  });
});

// (globalThis as any).reearth.on("mousedown", (mousedata: any) => {
//   (globalThis as any).reearth.ui.postMessage({
//     act: "mousedown",
//     payload: mousedata,
//   });
// });

// (globalThis as any).reearth.on("mouseup", (mousedata: any) => {
//   (globalThis as any).reearth.ui.postMessage({
//     act: "mouseup",
//     payload: mousedata,
//   });
// });
