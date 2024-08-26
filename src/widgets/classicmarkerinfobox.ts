import { Settings } from "@web/components/pages/classicmarkerinfobox/core/App";
import { ModalSettings } from "@web/components/pages/classicmarkerinfobox/modals/form/App";
import { GlobalThis } from "src/apiTypes";

import html from "../../dist/web/classicmarkerinfobox/core/index.html?raw";
import form from "../../dist/web/classicmarkerinfobox/modals/form/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html, { width: 0, height: 0 });

let currentPostId: string | undefined = undefined;

const updateSettings = () => {
  reearth.ui.postMessage({
    act: "setSettings",
    payload: {
      enableComment: reearth.extension.widget?.property?.default?.enableComment,
      backendUrl: reearth.extension.widget?.property?.default?.backendUrl,
      primaryColor: reearth.extension.widget?.property?.default?.primaryColor,
    } as Settings,
  });
};

const updateSettingsForModal = () => {
  reearth.modal.postMessage({
    act: "setSettings",
    payload: {
      backendUrl: reearth.extension.widget?.property?.default?.backendUrl,
      primaryColor: reearth.extension.widget?.property?.default?.primaryColor,
      tacLink: reearth.extension?.widget?.property?.default?.tacLink,
      postId: currentPostId,
    } as ModalSettings,
  });
};

const onSelect = (layerId?: string) => {
  if (!layerId) return;
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

const getFinalSize = (contentSize: number[]): [number, number] => {
  const maxHeight = reearth.viewer.viewport.height * 0.62;
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

reearth.extension.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

reearth.layers.on("select", onSelect);

reearth.viewer.on("resize", onResize);
