import { CurrentLocationInfo } from "@web/types";
import { CameraPosition } from "src/apiType";

import html from "../../dist/web/geolocation/index.html?raw";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 208, height: 202 });
let initCameraPos: CameraPosition | undefined = undefined;

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

const updateWidgetValues = () => {
  (globalThis as any).reearth.ui.postMessage({
    act: "SetWidgetValues",
    payload: {
      mode: (globalThis as any).reearth.widget.property.mode,
      autoFollow: (globalThis as any).reearth.widget.property.location
        .autoFollow,
      style: (globalThis as any).reearth.widget.property.markerStyle.style,
      pointColor: (globalThis as any).reearth.widget.property.markerStyle
        .pointColor,
      pointSize: (globalThis as any).reearth.widget.property.markerStyle
        .pointSize,
      outlineColor: (globalThis as any).reearth.widget.property.markerStyle
        .outlineColor,
      outlineWidth: (globalThis as any).reearth.widget.property.markerStyle
        .outlineWidth,
      imageUrl: (globalThis as any).reearth.widget.property.markerStyle
        .imageUrl,
      imageSize: (globalThis as any).reearth.widget.property.markerStyle
        .imageSize,
      modelUrl: (globalThis as any).reearth.widget.property.markerStyle
        .modelUrl,
      modelSize: (globalThis as any).reearth.widget.property.markerStyle
        .modelSize,
      modelHeading: (globalThis as any).reearth.widget.property.markerStyle
        .modelHeading,
    },
  });
};

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  getTheme: () => {
    updateTheme();
  },
  getWidgetValues: () => {
    updateWidgetValues();
  },
  flyTo: (CurrentLocation: CurrentLocationInfo) => {
    if (
      CurrentLocation.altitude !== undefined &&
      CurrentLocation.latitude !== undefined &&
      CurrentLocation.longitude !== undefined
    ) {
      initCameraPos = (globalThis as any).reearth.camera.position;
      (globalThis as any).reearth.camera.flyTo(
        {
          lat: CurrentLocation.latitude, // degrees
          lng: CurrentLocation.longitude, // degrees
          height: CurrentLocation.altitude, // meters
          heading: initCameraPos?.heading ?? 0, // radians
          pitch: -Math.PI / 2, // radians
          roll: 0, // radians
          fov: initCameraPos?.fov ?? 0.75,
        },
        {
          duration: 2, // seconds
        }
      );
    }
  },
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});

(globalThis as any).reearth.on("update", () => {
  updateTheme();
  updateWidgetValues();
});
