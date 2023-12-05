import { SerializedStyles, css } from "@emotion/react";
import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Infobox } from "src/apiType";

import BlockComponent from "./Block";
import { CommentsAndLikes, CommentsAndLikesHandles } from "./comment";
import { typographyStyles } from "./util/value";

export type Settings = {
  enableComment: boolean | undefined;
  backendUrl: string | undefined;
  primaryColor: string | undefined;
};

const App = () => {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [infobox, setInfobox] = useState<Infobox>();

  const [layerId, setLayerId] = useState<string | undefined>();
  const [featureId, setFeatureId] = useState<string | undefined>();

  const [enableComment, setEnableComment] = useState(false);
  const [backendUrl, setBackendUrl] = useState("");

  const commentsAndLikesRef = useRef<CommentsAndLikesHandles | null>(null);

  const postId = useMemo(
    () => (!!layerId && !!featureId ? `${layerId}-${featureId}` : undefined),
    [layerId, featureId]
  );

  const openInfobox = useCallback(
    ({
      infobox,
      layerId,
      featureId,
    }: {
      infobox?: Infobox;
      layerId?: string;
      featureId?: string;
    }) => {
      setInfobox(infobox);
      setLayerId(layerId);
      setFeatureId(featureId);
      setActive(true);
      setVisible(true);
    },
    []
  );

  const closeInfobox = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setActive(false);
    }, 300);
  }, []);

  const setSettings = useCallback((settings: Settings) => {
    setEnableComment(settings.enableComment ?? false);
    setBackendUrl(settings.backendUrl ?? "");

    document.documentElement.style.setProperty(
      "--primary-color",
      settings.primaryColor ?? "#00BEBE"
    );
  }, []);

  const refetchComments = useCallback(() => {
    commentsAndLikesRef.current?.refetchComments();
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      openInfobox,
      closeInfobox,
      setSettings,
      refetchComments,
    };
  }, [openInfobox, closeInfobox, setSettings, refetchComments]);

  useEffect(() => {
    const msgListener = (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    };
    (globalThis as any).addEventListener("message", msgListener);

    return () => {
      (globalThis as any).removeEventListener("message", msgListener);
    };
  }, [actHandles]);

  const [contentHeight, setContentHeight] = useState(244);

  useEffect(() => {
    postMsg(
      "resize",
      active
        ? [
            infobox?.property?.default?.size === "large"
              ? 624
              : infobox?.property?.default?.size === "medium"
              ? 540
              : 346,
            contentHeight +
              (infobox?.property?.default?.showTitle ?? true ? 36 : 0) +
              (infobox?.property?.default?.outlineWidth ?? 0) * 2 +
              (infobox?.property?.default?.infoboxPaddingTop ?? 0) +
              (infobox?.property?.default?.infoboxPaddingBottom ?? 0),
          ]
        : [0, 0]
    );
  }, [
    active,
    contentHeight,
    infobox?.property?.default?.size,
    infobox?.property?.default?.showTitle,
    infobox?.property?.default?.outlineWidth,
    infobox?.property?.default?.infoboxPaddingTop,
    infobox?.property?.default?.infoboxPaddingBottom,
  ]);

  const pageStyles = useMemo(
    () => css`
      background-color: ${infobox?.property?.default?.bgcolor};
      ${typographyStyles({
        ...infobox?.property?.default?.typography,
      })}
    `,
    [
      infobox?.property?.default?.typography,
      infobox?.property?.default?.bgcolor,
    ]
  );

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      let height: number | undefined;

      if (entry.contentBoxSize) {
        // Firefox(v69-91) implements `contentBoxSize` as a single content rect, rather than an array
        const contentBoxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize;
        height = contentBoxSize.blockSize;
      } else if (entry.contentRect) {
        height = entry.contentRect.height;
      } else {
        height = contentRef.current?.clientHeight;
      }

      setContentHeight((height ?? 214) + 10);
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentRef]);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [infobox]);

  useEffect(() => {
    postMsg("updateSettings");
  }, []);

  return (
    <Wrapper active={active} size={infobox?.property?.default?.size}>
      <Page
        visible={visible}
        outlineColor={infobox?.property?.default?.outlineColor}
        outlineWidth={infobox?.property?.default?.outlineWidth}
        styles={pageStyles}
      >
        <Title show={infobox?.property?.default?.showTitle ?? true}>
          {infobox?.property?.default?.title || "Marker"}
        </Title>
        <CloseBtn icon="cancel" size={16} onClick={closeInfobox} />
        <ContentArea
          paddingTop={infobox?.property?.default?.infoboxPaddingTop}
          paddingBottom={infobox?.property?.default?.infoboxPaddingBottom}
          paddingLeft={infobox?.property?.default?.infoboxPaddingLeft}
          paddingRight={infobox?.property?.default?.infoboxPaddingRight}
          ref={contentRef}
        >
          {infobox?.blocks?.map((b) => (
            <BlockComponent
              key={b.id}
              block={b}
              infoboxProperty={infobox?.property}
            />
          ))}
          {enableComment && postId && backendUrl && (
            <CommentsAndLikes
              postId={postId}
              backendUrl={backendUrl}
              ref={commentsAndLikesRef}
            />
          )}
        </ContentArea>
      </Page>
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.div<{ active: boolean; size?: string }>`
  position: absolute;
  width: ${({ size }) =>
    size === "large" ? "624px" : size === "medium" ? "540px" : "346px"};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

const Page = styled.div<{
  visible: boolean;
  outlineWidth?: number;
  outlineColor?: string;
  styles?: SerializedStyles;
}>`
  position: relative;
  box-sizing: border-box;
  min-height: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 6px;
  transform: translate3d(${({ visible }) => (visible ? "0" : "100%")}, 0, 0);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  ${({ outlineWidth, outlineColor }) =>
    outlineWidth ? `border: ${outlineWidth}px ${outlineColor} solid` : ""};
  ${({ styles }) => styles}
`;

const ContentArea = styled.div<{
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}>`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  a {
    color: inherit;
  }
  padding-top: ${({ paddingTop }) => (paddingTop ? `${paddingTop}px` : null)};
  padding-bottom: ${({ paddingBottom }) =>
    paddingBottom ? `${paddingBottom}px` : null};
  padding-left: ${({ paddingLeft }) =>
    paddingLeft ? `${paddingLeft}px` : null};
  padding-right: ${({ paddingRight }) =>
    paddingRight ? `${paddingRight}px` : null};
`;

const Title = styled.div<{
  show: boolean;
}>`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-align: center;
  display: ${({ show }) => (show ? "flex" : "none")};
  line-height: 24px;
  font-size: 16px;
  font-weight: bold;
`;

const CloseBtn = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  display: "block";
  color: rgb(147, 147, 147);
`;