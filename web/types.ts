export type transMessage = {
  act: string;
  payload?: any;
};

export type actHandles = {
  [key: string]: any;
};

export type CurrentLocationInfo = {
  latitude: number;
  longitude: number;
  altitude: number;
  date: string;
  time: string;
};
export type WidgetMode = "button" | "ui";

export type StyleTypes = "point" | "icon" | "3dModel";

export type PointInfo = {
  pointColor: string;
  pointSize: string | number;
  outlineColor: string;
  outlineWidth: string;
};

export type IconInfo = {
  imageUrl: string;
  imageSize: number;
};

export type ModelInfoType = {
  modelUrl: string;
  modelSize: number;
  modelHeading: number;
};

export type MarkerStyle = {
  style: StyleTypes;
  pointInfo?: PointInfo;
  iconInfo?: IconInfo;
  ModelInfo?: ModelInfoType;
};
