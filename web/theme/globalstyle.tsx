import { Global, css } from "@emotion/react";
import React from "react";

export const styles = css`
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
  html,
  body,
  #root {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: Roboto, Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
    font-size: 14px;
  }

  h1,
  p,
  input {
    margin: 0;
    padding: 0;
    font-family: Roboto, Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
  }

  button {
    margin: 0;
    padding: 0;
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    font-family: Roboto, Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
  }

  textarea {
    font-family: Roboto, Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;

const GlobalStyle: React.FC = () => <Global styles={styles} />;
export default GlobalStyle;
