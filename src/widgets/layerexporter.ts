import html from "../../dist/web/layerexporter/index.html?raw";
import type { Layer } from "../apiType";
import type { pluginMessage, actHandles } from "../type";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

type LayerData = { [index: string]: any };

const processProperty = (
  obj: any,
  key: string,
  property: LayerData,
  name: string,
  propertyNames: string[],
  extensionId = ""
) => {
  const currentName = name === "" ? `${extensionId}.${key}` : `${name}.${key}`;
  if (typeof obj[key] === "object") {
    Object.keys(obj[key]).forEach((k) => {
      processProperty(
        obj[key],
        k,
        property,
        currentName,
        propertyNames,
        extensionId
      );
    });
  } else {
    if (
      !currentName.includes("location.lat") &&
      !currentName.includes("location.lng") &&
      !(currentName in property)
    ) {
      property[currentName] = obj[key];
      if (!propertyNames.includes(currentName)) {
        propertyNames.push(currentName);
      }
    }
  }
};

const processLayer = (
  layer: Layer,
  layersdata: LayerData[],
  propertyNames: string[]
) => {
  if (layer.children) {
    layer.children.forEach((l) => processLayer(l, layersdata, propertyNames));
  } else {
    const property = {
      title: layer.title,
      lng: layer.property?.default?.location?.lng,
      lat: layer.property?.default?.location?.lat,
    };
    // property.set("title", layer.title);
    // property.set("longitude", layer.property?.default?.location?.lng);
    // property.set("latitude", layer.property?.default?.location?.lat);

    Object.keys(layer.property?.default).forEach((key) => {
      processProperty(
        layer.property.default,
        key,
        property,
        "",
        propertyNames,
        layer.extensionId
      );
    });

    layersdata.push(property);
  }
};

const handles: actHandles = {
  resize: (size: any) => {
    (globalThis as any).reearth.ui.resize(...size);
  },
  layersdata: ({ type }: { type: string }) => {
    const layers = (globalThis as any).reearth.layers.layers;
    const layersdata: LayerData[] = [];
    const propertyNames: string[] = ["title", "lng", "lat"];

    if (layers) {
      layers.forEach((layer: Layer) => {
        processLayer(layer, layersdata, propertyNames);
      });
    }

    (globalThis as any).reearth.ui.postMessage({
      act: "layersdata",
      payload: {
        type,
        layersdata,
        propertyNames,
      },
    });
  },
};

(globalThis as any).reearth.on("message", (msg: pluginMessage) => {
  if (msg?.act) {
    handles[msg.act]?.(msg.payload);
  }
});
