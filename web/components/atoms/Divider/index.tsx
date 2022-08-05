import styled from "@emotion/styled";

export type Props = {
  vertical?: boolean;
};

const Divider: React.FC<Props> = ({ vertical = false }) => {
  return <StyledDivider vertical={vertical} />;
};

const StyledDivider = styled.div<{ vertical: boolean }>`
  height: 0;
  border: 1px solid #7a7777;
`;

export default Divider;
