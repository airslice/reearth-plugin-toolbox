import "@emotion/react";
import { Theme as PluginTheme } from "./common";

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends PluginTheme {}
}
