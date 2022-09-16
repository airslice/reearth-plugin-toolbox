import _ from "lodash";

import { commonTheme } from "../common";

export default _.merge({}, commonTheme, {
  name: "light",
  colors: {
    background: "#ECECEC",
    // buttons
    primary: "#F57C4B",
    secondary: "#FC5B00",
    disabled: commonTheme.colors.gray[7],
    off: commonTheme.colors.gray[7],
    // common
    strongest: commonTheme.colors.gray[12],
    main: commonTheme.colors.gray[10],
    weak: commonTheme.colors.gray[8],
    weakest: commonTheme.colors.gray[7],
  },
  fontColors: {
    // buttons
    primary: "#FAFAFA",
    secondary: "#FAFAFA",
    disabled: "#FAFAFA",
    off: "#FAFAFA",
  },
});
