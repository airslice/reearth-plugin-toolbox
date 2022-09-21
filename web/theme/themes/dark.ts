import _ from "lodash";

import { commonTheme } from "../common";

export default _.merge({}, commonTheme, {
  name: "dark",
  colors: {
    background: "#171618",
    // buttons
    primary: "#3B3CD0",
    disabled: commonTheme.colors.gray[8],
    off: commonTheme.colors.gray[10],
    // common
    strongest: commonTheme.colors.gray[2],
    main: commonTheme.colors.gray[6],
    weak: commonTheme.colors.gray[7],
    weakest: commonTheme.colors.gray[8],
  },
  fontColors: {
    // buttons
    primary: commonTheme.colors.gray[2],
    disabled: commonTheme.colors.gray[2],
    off: commonTheme.colors.gray[6],
  },
});
