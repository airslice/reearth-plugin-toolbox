import styled from "@emotion/styled";
import nl2br from "react-nl2br";

import { Props as BlockProps } from "..";
import Markdown from "../../components/Markdown";
import { Typography, typographyStyles } from "../../util/value";
import { Border } from "../common";

export type Props = BlockProps<Property>;

export type Property = {
  default?: {
    text?: string;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    title?: string;
    markdown?: boolean;
    typography?: Typography;
  };
};

const TextBlock: React.FC<Props> = ({ block, infoboxProperty }) => {
  const {
    text,
    title,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    markdown,
    typography,
  } = (block?.property as Property | undefined)?.default ?? {};
  const { bgcolor: bg } = infoboxProperty?.default ?? {};

  return (
    <Wrapper
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      <>
        {title && <Title>{title}</Title>}
        {markdown ? (
          <Markdown styles={typography} backgroundColor={bg}>
            {text}
          </Markdown>
        ) : (
          <Field styles={typography}>{nl2br(text ?? "")}</Field>
        )}
      </>
    </Wrapper>
  );
};

const Wrapper = styled(Border)<{
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}>`
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop + "px" : "0")};
  padding-bottom: ${({ paddingBottom }) =>
    paddingBottom ? paddingBottom + "px" : "0"};
  padding-left: ${({ paddingLeft }) =>
    paddingLeft ? paddingLeft + "px" : "0"};
  padding-right: ${({ paddingRight }) =>
    paddingRight ? paddingRight + "px" : "0"};
  margin: 0 8px;
`;

const Title = styled.div`
  font-size: 12px;
`;

const Field = styled.div<{ styles?: Typography }>`
  ${({ styles }) => typographyStyles(styles)}
  padding: 5px;
  min-height: 15px;
`;

export default TextBlock;
