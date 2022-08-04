import html from "../dist/web/tagcloud/index.html?raw";

import type { Layer } from "./apiType";
import type { pluginMessage, actHandles } from "./type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

type Tag = {
  id: string;
  name: string;
  layerIds: string[];
};

type TagGroup = {
  id: string;
  name: string;
  tags: Tag[];
};

const addTagData = (
  tags: TagGroup[],
  groupId: string,
  groupName: string,
  tagId: string,
  tagName: string,
  layerId: string
) => {
  let tg = tags.find((g) => g.id === groupId);
  if (!tg) {
    tags.push({
      id: groupId,
      name: groupName,
      tags: [],
    });
  }
  tg = tags.find((g) => g.id === groupId);
  let tag = tg?.tags.find((t) => t.id === tagId);
  if (!tag) {
    tg?.tags.push({
      id: tagId,
      name: tagName,
      layerIds: [],
    });
  }
  tag = tg?.tags.find((t) => t.id === tagId);
  tag?.layerIds.push(layerId);
};

const processLayer = (layer: Layer, tags: TagGroup[]) => {
  if (layer.children) {
    layer.children.forEach((cl) => {
      processLayer(cl, tags);
    });
  } else {
    if (layer.tags) {
      layer.tags.forEach((tag) => {
        if (tag.tags) {
          tag.tags.forEach((ct) => {
            addTagData(tags, tag.id, tag.label, ct.id, ct.label, layer.id);
          });
        } else {
          addTagData(tags, "default", "Default", tag.id, tag.label, layer.id);
        }
      });
    }
  }
};

const getTagsFromLayers = (layers: Layer[]) => {
  if (!layers) return [];
  const tags: TagGroup[] = [];
  layers.forEach((layer) => {
    processLayer(layer, tags);
  });
  tags.forEach((tagGroup) => {
    tagGroup.tags.sort((a, b) => (a.name > b.name ? 1 : -1));
  });
  tags.sort((a, b) => (a.name > b.name ? 1 : -1));

  const defaultGroup = tags.find((tg) => tg.id === "default");
  if (!defaultGroup) return tags;

  const otherGroups = tags.filter((tg) => tg.id !== "default");
  return [defaultGroup, ...otherGroups];
};

const forceRerender = () => {
  (globalThis as any).reearth.visualizer.camera.flyTo(
    (globalThis as any).reearth.visualizer.camera.position
  );
};

const handles: actHandles = {
  getTags: () => {
    const layers = (globalThis as any).reearth.layers.layers;
    const tagsdata = getTagsFromLayers(layers);

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
  showTag: ({ tagId, show }: { tagId: string; show: boolean }) => {
    const layers = (globalThis as any).reearth.layers.findByTags(tagId);
    if (!layers) return;
    const layerIds = layers.map((l: Layer) => l.id);
    if (show) {
      (globalThis as any).reearth.layers.show(...layerIds);
    } else {
      (globalThis as any).reearth.layers.hide(...layerIds);
    }
    //
    forceRerender();
  },
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});
