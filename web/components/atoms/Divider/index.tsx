import styled from "@emotion/styled";

export type Props = {
  vertical?: boolean;
};

const Divider: React.FC<Props> = ({ vertical = false }) => {
  return <StyledDivider vertical={vertical} />;
};

const StyledDivider = styled.div<{ vertical: boolean }>`
  height: 0;
  width: 100%;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${(props) => props.theme.colors.weakest};
`;

export default Divider;
