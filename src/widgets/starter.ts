import html from "../../dist/web/starter/core/index.html?raw";
import demoModal from "../../dist/web/starter/modals/demoModal/index.html?raw";
import demoPopup from "../../dist/web/starter/popups/demoPopup/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

const reearth = (globalThis as any).reearth;
reearth.ui.show(html, { width: 312, height: 44 });

const updateTheme = () => {
  reearth.ui.postMessage({
    act: "setTheme",
    payload: {
      theme: reearth.widget.property.customize?.theme,
      overriddenTheme: {
        colors: {
          background: reearth.widget.property.customize?.backgroundColor,
          primary: reearth.widget.property.customize?.primaryColor,
        },
      },
    },
  });
};

let demoModalOpened = false;
let demoPopupOpened = false;

const handles: actHandles = {
  resize: (size: any) => {
    reearth.ui.resize(...size);
  },
  getTheme: () => {
    updateTheme();
  },
  toggleDemoModal: () => {
    if (!demoModalOpened) {
      reearth.modal.show(demoModal, { width: 500, height: 300 });
      demoModalOpened = true;
    } else {
      reearth.modal.close();
      demoModalOpened = false;
    }
  },
  closeDemoModal: () => {
    reearth.modal.close();
  },
  toggleDemoPopup: () => {
    if (!demoPopupOpened) {
      reearth.popup.show(demoPopup, {
        width: 200,
        height: 150,
        position: "bottom-start",
        offset: { mainAxis: -18, crossAxis: 126 },
      });
      demoPopupOpened = true;
    } else {
      reearth.popup.close();
      demoPopupOpened = false;
    }
  },
  closeDemoPopup: () => {
    reearth.popup.close();
  },
};

reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

reearth.on("update", () => {
  updateTheme();
});
