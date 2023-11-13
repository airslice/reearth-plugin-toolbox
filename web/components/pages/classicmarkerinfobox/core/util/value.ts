import { css } from "@emotion/react";

export type Typography = {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify" | "justify_all";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export const typographyStyles = (t?: Typography) => {
  if (!t) return null;
  return css`
    font: ${toCSSFont(t)};
    text-decoration: ${toTextDecoration(t)};
    color: ${t.color ?? null};
    text-align: ${t.textAlign ?? null};
  `;
};

export const getCSSFontFamily = (f?: string) => {
  return !f
    ? undefined
    : f === "YuGothic"
    ? `"游ゴシック体", YuGothic, "游ゴシック Medium", "Yu Gothic Medium", "游ゴシック", "Yu Gothic"`
    : f;
};

export const toCSSFont = (t?: Typography, d?: Typography) => {
  const ff = getCSSFontFamily(t?.fontFamily ?? d?.fontFamily)
    ?.replace("'", '"')
    .trim();
  return `${t?.italic ?? d?.italic ? "italic " : ""}${
    t?.bold ?? d?.bold
      ? "bold "
      : (t?.fontWeight ?? d?.fontWeight ?? "") + " " ?? ""
  }${t?.fontSize ?? d?.fontSize ?? 16}px ${
    ff ? (ff.includes(`"`) ? ff : `"${ff}"`) : "sans-serif"
  }`;
};

export const toTextDecoration = (t?: Typography) =>
  t?.underline ? "underline" : "none";

export type ValueTypes = {
  string: string;
  number: number;
  bool: boolean;
  latlng: LatLng;
  latlngheight: LatLngHeight;
  url: string;
  camera: Camera;
  typography: Typography;
  coordinates: Coordinates;
  polygon: Polygon;
  rect: Rect;
  ref: string;
  tiletype: string;
};

export type ValueType = keyof ValueTypes;

export type LatLng = {
  lat: number;
  lng: number;
};

export type LatLngHeight = {
  lat: number;
  lng: number;
  height: number;
};

export type Camera = {
  lat: number;
  lng: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
  fov: number;
};

export type Coordinates = LatLngHeight[];

export type Polygon = LatLngHeight[][];

export type Rect = {
  west: number;
  south: number;
  east: number;
  north: number;
};
