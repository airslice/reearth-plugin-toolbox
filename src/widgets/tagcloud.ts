import html from "../../dist/web/tagcloud/index.html?raw";
import type { Layer } from "../apiType";
import type { pluginMessage, actHandles } from "../type";

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
  layerId: string,
  allowedTagGroupName?: string
) => {
  if (allowedTagGroupName && groupName !== allowedTagGroupName) return;
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

const processLayer = (
  layer: Layer,
  tags: TagGroup[],
  tarTagGroupName: string,
  otherLayerIds: string[]
) => {
  if (layer.children) {
    layer.children.forEach((cl) => {
      processLayer(cl, tags, tarTagGroupName, otherLayerIds);
    });
  } else {
    let belongsToOthers = true;
    if (layer.tags) {
      layer.tags.forEach((tag) => {
        if (tag.tags) {
          if (tag.label === tarTagGroupName) {
            belongsToOthers = false;
          }
          tag.tags.forEach((ct) => {
            addTagData(
              tags,
              tag.id,
              tag.label,
              ct.id,
              ct.label,
              layer.id,
              tarTagGroupName
            );
          });
        } else {
          if ("Default" === tarTagGroupName) {
            belongsToOthers = false;
          }
          addTagData(
            tags,
            "default",
            "Default",
            tag.id,
            tag.label,
            layer.id,
            tarTagGroupName
          );
        }
      });
    }
    // add to others
    if (belongsToOthers) {
      otherLayerIds.push(layer.id);
    }
  }
};

const getTagsFromLayers = (layers: Layer[], tarTagGroupName: string) => {
  if (!layers) return [];
  const tags: TagGroup[] = [];
  const otherLayerIds: string[] = [];

  layers.forEach((layer) => {
    processLayer(layer, tags, tarTagGroupName, otherLayerIds);
  });

  tags.forEach((tagGroup) => {
    tagGroup.tags.sort((a, b) => (a.name > b.name ? 1 : -1));
  });

  tags.sort((a, b) => (a.name > b.name ? 1 : -1));

  if (otherLayerIds) {
    tags
      .find((tg) => tg.name === tarTagGroupName)
      ?.tags.push({
        id: "others",
        name: "...",
        layerIds: otherLayerIds,
      });
  }

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
    const tarTagGroupName =
      (globalThis as any).reearth.widget.property &&
      (globalThis as any).reearth.widget.property.default
        ? (globalThis as any).reearth.widget.property.default.tgname || ""
        : "";

    const layers = (globalThis as any).reearth.layers.layers;
    const tagsdata = tarTagGroupName
      ? getTagsFromLayers(layers, tarTagGroupName)
      : [];

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

(globalThis as any).reearth.on("update", () => {
  handles.getTags?.();
});
