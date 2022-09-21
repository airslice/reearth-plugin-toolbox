import styled from "@emotion/styled";

export type Props = {
  enabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Switch: React.FC<Props> = ({ enabled = false, onClick }) => {
  return (
    <Wrapper onClick={onClick} enabled={enabled}>
      <Inner enabled={enabled} />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ enabled: boolean }>`
  position: relative;
  width: 28px;
  height: 16px;
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  border-color: ${(props) =>
    props.enabled ? props.theme.colors.primary : props.theme.colors.weakest};
  padding: 1px;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
`;

const Inner = styled.div<{ enabled: boolean }>`
  position: relative;
  width: 12px;
  height: 12px;
  transition: all 0.25s ease-in-out;
  left: ${({ enabled }) => (enabled ? "calc(100% - 12px)" : "0")};
  background: ${(props) =>
    props.enabled ? props.theme.colors.primary : props.theme.colors.weakest};
  border-radius: 16px;
`;

export default Switch;
