import { ThemeProvider } from "@emotion/react";
import { ReactNode } from "react";

import { Theme } from "./common";
import GlobalStyle from "./globalstyle";
import dark from "./themes/dark";
import light from "./themes/light";

const Provider: React.FC<{
  children?: ReactNode;
  theme: string;
  overriddenTheme: Theme | undefined;
}> = ({ children, theme, overriddenTheme }) => {
  const appliedTheme = theme === "light" ? light : dark;
  const themeData = {
    ...appliedTheme,
    ...overriddenTheme,
  };

  console.log(themeData);

  return (
    <ThemeProvider theme={themeData}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Provider;
