import { Global, css } from "@emotion/react";
import React from "react";

export const styles = css`
  html,
  body,
  #root {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
    font-size: 14px;
  }

  h1,
  p,
  input {
    margin: 0;
    padding: 0;
    font-family: Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
  }

  button {
    margin: 0;
    padding: 0;
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;
  }

  textarea {
    font-family: Noto Sans, hiragino sans, hiragino kaku gothic proN,
      -apple-system, BlinkMacSystem, sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;

const GlobalStyle: React.FC = () => <Global styles={styles} />;
export default GlobalStyle;
