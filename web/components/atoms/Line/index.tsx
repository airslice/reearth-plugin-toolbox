import styled from "@emotion/styled";
import { CSSProperties } from "react";

export type Props = {
  children?: React.ReactNode;
  centered?: boolean;
  style?: CSSProperties;
};

const Line: React.FC<Props> = ({ children, centered = false, style }) => {
  return (
    <StyledLine centered={centered} style={style}>
      {children}
    </StyledLine>
  );
};

const StyledLine = styled.div<{ centered: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  gap: 8px;
  justify-content: ${({ centered }) => (centered ? "center" : "flex-start")}; ;
`;

export default Line;
