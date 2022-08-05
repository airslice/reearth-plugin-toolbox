import styled from "@emotion/styled";

export type Props = {
  children?: React.ReactNode;
};

const Line: React.FC<Props> = ({ children }) => {
  return <StyledLine>{children}</StyledLine>;
};

const StyledLine = styled.div`
  display: flex;
  gap: 8px;
`;

export default Line;
