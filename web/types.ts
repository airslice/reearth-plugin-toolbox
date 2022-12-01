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
  date: string;
  time: string;
};
