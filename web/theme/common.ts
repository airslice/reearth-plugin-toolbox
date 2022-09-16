export const commonTheme = {
  colors: {
    gray: {
      1: "#ffffff",
      2: "#fafafa",
      3: "#f5f5f5",
      4: "#f0f0f0",
      5: "#d9d9d9",
      6: "#bfbfbf",
      7: "#8c8c8c",
      8: "#595959",
      9: "#434343",
      10: "#262626",
      11: "#1f1f1f",
      12: "#141414",
      13: "#000000",
    },
  },
};

export type Theme = {
  name: string;
  colors: { [id: string]: any };
  fontColors: { [id: string]: any };
  borderColors: { [id: string]: any };
};
