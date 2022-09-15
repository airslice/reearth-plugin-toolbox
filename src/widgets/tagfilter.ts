import html from "../../dist/web/tagfilter/index.html?raw";
import type { Layer } from "../apiType";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

type Tag = {
  id: string;
  name: string;
  layerIds?: string[];
};

type TagGroup = {
  id: string;
  name: string;
  tags?: Tag[];
};

const processLayer = (layer: Layer, tags: TagGroup[]) => {
  if (layer.children) {
    layer.children.forEach((cl) => {
      processLayer(cl, tags);
    });
  } else {
    tags.forEach((tagGroup) => {
      let belongsToSomeTagInThisGroup = false;
      if (layer.tags) {
        layer.tags.forEach((tag) => {
          if (tag.tags && tag.id === tagGroup.id) {
            belongsToSomeTagInThisGroup = true;
            tag.tags.forEach((ct) => {
              if (!tagGroup.tags?.find((tag) => tag.id === ct.id)) {
                tagGroup.tags?.push({
                  id: ct.id,
                  name: ct.label,
                  layerIds: [],
                });
              }
              tagGroup.tags
                ?.find((tag) => tag.id === ct.id)
                ?.layerIds?.push(layer.id);
            });
          }
        });
      }
      if (!belongsToSomeTagInThisGroup) {
        const tagOthersId = `${tagGroup.id}-others`;
        if (!tagGroup.tags?.find((tag) => tag.id === tagOthersId)) {
          tagGroup.tags?.push({
            id: tagOthersId,
            name: "...",
            layerIds: [],
          });
        }
        tagGroup.tags
          ?.find((tag) => tag.id === tagOthersId)
          ?.layerIds?.push(layer.id);
      }
    });
  }
};

const getTagsFromLayers = (layers: Layer[], tarTagGroupNames: any[]) => {
  if (!layers) return [];
  const tags: TagGroup[] = [];

  if (!tarTagGroupNames) return tags;

  const tagGroupMap = getTagGroupMap();

  tarTagGroupNames.forEach((tgns) => {
    tags.push({
      id: tagGroupMap.get(tgns.tgname),
      name: tgns.tgname,
      tags: [],
    });
  });

  layers.forEach((layer) => {
    processLayer(layer, tags);
  });

  tags.forEach((tagGroup) => {
    tagGroup.tags?.sort((a, b) =>
      a.name === "..." ? 1 : b.name === "..." ? -1 : a.name > b.name ? 1 : -1
    );
  });

  return tags;
};

const processLayerForTagGroup = (
  layer: Layer,
  tagGroupMap: Map<string, string>
) => {
  if (layer.children) {
    layer.children.forEach((cl) => {
      processLayerForTagGroup(cl, tagGroupMap);
    });
  } else {
    if (layer.tags) {
      layer.tags.forEach((tag) => {
        if (tag.tags) {
          tagGroupMap.set(tag.label, tag.id);
        }
      });
    }
  }
};

const getTagGroupMap = () => {
  const tagGroupMap = new Map();
  const layers = (globalThis as any).reearth.layers.layers;
  if (!layers) return tagGroupMap;

  layers.forEach((layer: Layer) => {
    processLayerForTagGroup(layer, tagGroupMap);
  });

  return tagGroupMap;
};

const forceRerender = () => {
  (globalThis as any).reearth.visualizer.camera.flyTo(
    (globalThis as any).reearth.visualizer.camera.position
  );
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

const handles: actHandles = {
  getTags: () => {
    const tarTagGroupNames =
      (globalThis as any).reearth.widget.property &&
      (globalThis as any).reearth.widget.property.default
        ? (globalThis as any).reearth.widget.property.default || []
        : [];

    const layers = (globalThis as any).reearth.layers.layers;
    const tagsdata = getTagsFromLayers(layers, tarTagGroupNames);

    (globalThis as any).reearth.ui.postMessage({
      act: "tags",
      payload: tagsdata,
    });
  },
  showLayers: (layerIds: string[]) => {
    (globalThis as any).reearth.layers.show(...layerIds);
    forceRerender();
  },
  hideLayers: (layerIds: string[]) => {
    (globalThis as any).reearth.layers.hide(...layerIds);
    forceRerender();
  },
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
  handles.getTags?.();
});
