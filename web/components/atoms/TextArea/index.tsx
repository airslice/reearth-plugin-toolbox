import { css } from "@emotion/react";
import styled from "@emotion/styled";

export type Props = {
  text?: string;
  minHeight?: number;
  children?: React.ReactNode;
};

const TextArea: React.FC<Props> = ({ text, minHeight, children }) => {
  return (
    <Text minHeight={minHeight}>
      {text && <div>{text}</div>}
      {children}
    </Text>
  );
};

const Text = styled.div<{ minHeight?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  color: ${(props) => props.theme.colors.weak};
  user-select: none;

  ${(props) => {
    if (props.minHeight) {
      return css`
        min-height: ${props.minHeight}px;
      `;
    }
  }}
`;

export default TextArea;
