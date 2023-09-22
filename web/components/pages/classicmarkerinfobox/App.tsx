import { SerializedStyles, css } from "@emotion/react";
import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Infobox } from "src/apiType";

import BlockComponent from "./Block";
import { typographyStyles } from "./util/value";

const App = () => {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [infobox, setInfobox] = useState<Infobox>();

  const openInfobox = useCallback(({ infobox }: { infobox?: Infobox }) => {
    setInfobox(infobox);
    setActive(true);
    setVisible(true);
  }, []);

  const closeInfobox = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setActive(false);
    }, 300);
  }, []);

  const actHandles: actHandles = useMemo(() => {
    return {
      openInfobox,
      closeInfobox,
    };
  }, [openInfobox, closeInfobox]);

  useEffect(() => {
    const msgListener = (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    };
    (globalThis as any).addEventListener("message", msgListener);

    return () => {
      (globalThis as any).removeEventListner("message", msgListener);
    };
  }, [actHandles]);

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
            629,
          ]
        : [0, 0]
    );
  }, [active, infobox?.property?.default?.size]);

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

  return (
    <Wrapper active={active} size={infobox?.property?.default?.size}>
      <Page
        visible={visible}
        outlineColor={infobox?.property?.default?.outlineColor}
        outlineWidth={infobox?.property?.default?.outlineWidth}
        styles={pageStyles}
      >
        <Title show={infobox?.property?.default?.showTitle ?? true}>
          {infobox?.property?.default?.title || " "}
        </Title>
        <CloseBtn icon="cancel" size={16} onClick={closeInfobox} />
        <Content
          paddingTop={infobox?.property?.default?.infoboxPaddingTop}
          paddingBottom={infobox?.property?.default?.infoboxPaddingBottom}
          paddingLeft={infobox?.property?.default?.infoboxPaddingLeft}
          paddingRight={infobox?.property?.default?.infoboxPaddingRight}
        >
          {infobox?.blocks?.map((b) => (
            <BlockComponent
              key={b.id}
              block={b}
              infoboxProperty={infobox?.property}
            />
          ))}
        </Content>
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
`;

const Page = styled.div<{
  visible: boolean;
  outlineWidth?: number;
  outlineColor?: string;
  styles?: SerializedStyles;
}>`
  position: relative;
  min-height: 280px;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  transform: translate3d(${({ visible }) => (visible ? "0" : "100%")}, 0, 0);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: all 0.2s linear;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  ${({ outlineWidth, outlineColor }) =>
    outlineWidth ? `border: ${outlineWidth}px ${outlineColor} solid` : ""};
  ${({ styles }) => styles}
`;

const Content = styled.div<{
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}>`
  height: 100%;
  padding: 10px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  a {
    color: inherit;
  }
  padding: 10px 0 20px 0;
  padding-top: ${({ paddingTop }) => (paddingTop ? `${paddingTop}px` : null)};
  padding-bottom: ${({ paddingBottom }) =>
    paddingBottom ? `${paddingBottom}px` : null};
  padding-left: ${({ paddingLeft }) =>
    paddingLeft ? `${paddingLeft}px` : null};
  padding-right: ${({ paddingRight }) =>
    paddingRight ? `${paddingRight}px` : null};
`;

const Title = styled.span<{
  show: boolean;
}>`
  flex-shrink: 0;
  text-align: center;
  display: ${({ show }) => (show ? "block" : "none")};
  line-height: 24px;
  font-size: 16px;
  font-weight: bold;
  padding: 6px 0;
`;

const CloseBtn = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  display: "block";
  color: rgb(147, 147, 147);
`;
