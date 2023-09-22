import styled from "@emotion/styled";
import React, { useState, useCallback, useLayoutEffect } from "react";

import { Props as BlockProps } from "..";
import fonts from "../../util/fonts";
import { Border } from "../common";

export type Props = BlockProps<Property>;

export type Property = {
  default: {
    html?: string;
    title?: string;
  };
};

const HTMLBlock: React.FC<Props> = ({ block, infoboxProperty }) => {
  const { html, title } = block?.property?.default ?? {};

  // iframe
  const themeColor = infoboxProperty?.default?.typography?.color;
  const [frameRef, setFrameRef] = useState<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(15);
  const initializeIframe = useCallback(() => {
    const frameDocument = frameRef?.contentDocument;
    const frameWindow = frameRef?.contentWindow;
    if (!frameWindow || !frameDocument) {
      return;
    }

    if (!frameDocument.body.innerHTML.length) {
      // `document.write()` is not recommended API by HTML spec,
      // but we need to use this API to make it work correctly on Safari.
      // If Safari supports `onLoad` event with `srcDoc`, we can remove this line.
      frameDocument.write(html || "");
    }

    // Initialize styles
    frameWindow.document.documentElement.style.margin = "0";

    // Check if a style element has already been appended to the head
    let style: HTMLElement | null = frameWindow.document.querySelector(
      'style[data-id="reearth-iframe-style"]'
    );
    if (!style) {
      // Create a new style element if it doesn't exist
      style = frameWindow.document.createElement("style");
      style.dataset.id = "reearth-iframe-style";
      frameWindow.document.head.append(style);
    }
    // Update the content of the existing or new style element
    style.textContent = `body { color:${
      themeColor ?? getComputedStyle(frameRef).color
    }; 
    font-family:Noto Sans, hiragino sans, hiragino kaku gothic proN, -apple-system, BlinkMacSystem, sans-serif; 
    font-size: ${fonts.sizes.s}px; } a {color:${
      themeColor ?? getComputedStyle(frameRef).color
    };}`;

    const resize = () => {
      setHeight(frameWindow.document.documentElement.scrollHeight);
    };

    // Resize
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(frameWindow.document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, [frameRef, themeColor, html]);

  useLayoutEffect(() => initializeIframe(), [initializeIframe]);

  return (
    <Wrapper>
      {
        <>
          {title && <Title>{title}</Title>}
          <IFrame
            key={html}
            ref={setFrameRef}
            frameBorder="0"
            scrolling="no"
            iframeHeight={height}
            allowFullScreen
            sandbox="allow-same-origin allow-popups allow-forms"
          />
        </>
      }
    </Wrapper>
  );
};

const Wrapper = styled(Border)`
  margin: 0 8px;
`;

const Title = styled.div`
  font-size: 12px;
`;

const IFrame = styled.iframe<{ iframeHeight: number }>`
  display: block;
  border: none;
  padding: 5px;
  height: ${({ iframeHeight }) => iframeHeight}px;
  width: 100%;
  min-width: 100%;
  box-sizing: border-box;
`;

export default HTMLBlock;
