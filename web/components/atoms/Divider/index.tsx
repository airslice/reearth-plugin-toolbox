import styled from "@emotion/styled";

export type Props = {
  vertical?: boolean;
  dividerType?: "default" | "secondary";
};

const Divider: React.FC<Props> = ({
  vertical = false,
  dividerType = "defalut",
}) => {
  return <StyledDivider vertical={vertical} dividerType={dividerType} />;
};

const StyledDivider = styled.div<{ vertical: boolean; dividerType: string }>`
  height: 0;
  width: 100%;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({ dividerType }) =>
    dividerType === "secondary" ? "#353535" : "#7a7777"};
`;

export default Divider;
