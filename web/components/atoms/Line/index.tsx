import styled from "@emotion/styled";

export type Props = {
  children?: React.ReactNode;
  centered?: boolean;
};

const Line: React.FC<Props> = ({ children, centered = false }) => {
  return <StyledLine centered={centered}>{children}</StyledLine>;
};

const StyledLine = styled.div<{ centered: boolean }>`
  display: flex;
  width: 100%;
  gap: 8px;
  justify-content: ${({ centered }) => (centered ? "center" : "flex-start")}; ;
`;

export default Line;
