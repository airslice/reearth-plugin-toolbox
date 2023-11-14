import { Settings } from "@web/components/pages/classicmarkerinfobox/core/App";
import { ModalSettings } from "@web/components/pages/classicmarkerinfobox/modals/form/App";

import html from "../../dist/web/classicmarkerinfobox/core/index.html?raw";
import form from "../../dist/web/classicmarkerinfobox/modals/form/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

const reearth = (globalThis as any).reearth;
reearth.ui.show(html, { width: 0, height: 0 });

let currentPostId: string | undefined = undefined;

const updateSettings = () => {
  reearth.ui.postMessage({
    act: "setSettings",
    payload: {
      enableComment: reearth.widget.property.default?.enableComment,
      backendUrl: reearth.widget.property.default?.backendUrl,
      primaryColor: reearth.widget.property.default?.primaryColor,
    } as Settings,
  });
};

const updateSettingsForModal = () => {
  reearth.modal.postMessage({
    act: "setSettings",
    payload: {
      backendUrl: reearth.widget.property.default?.backendUrl,
      primaryColor: reearth.widget.property.default?.primaryColor,
      tacLink: reearth.widget.property.default?.tacLink,
      postId: currentPostId,
    } as ModalSettings,
  });
};

const onSelect = (layerId: string) => {
  const feature = reearth.layers.selectedFeature;
  if (!feature || !feature.properties?.reearthClassicInfobox) {
    reearth.ui.postMessage({
      act: "closeInfobox",
    });
  } else {
    reearth.ui.postMessage({
      act: "openInfobox",
      payload: {
        infobox: feature.properties?.reearthClassicInfobox,
        layerId,
        featureId: feature.properties?.reearthFeatureId,
      },
    });
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
  updateSettings,
  updateSettingsForModal,
  openFormModal: ({ postId }: { postId: string }) => {
    currentPostId = postId;
    reearth.modal.show(form, {
      width: 572,
      height: 546,
      background: "rgba(0,0,0,.3)",
    });
  },
  closeFormModal: () => {
    reearth.modal.close();
  },
  refetchComments: () => {
    reearth.ui.postMessage({
      act: "refetchComments",
    });
  },
};

reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

reearth.on("select", onSelect);

reearth.on("resize", onResize);
