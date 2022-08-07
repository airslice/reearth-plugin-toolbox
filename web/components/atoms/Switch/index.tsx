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
  border: ${({ enabled }) =>
    enabled ? "1px solid #c7c5c5" : "1px solid #4a4a4a"};
  border-radius: 16px;
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
  background: ${({ enabled }) => (enabled ? "#c7c5c5" : "#4a4a4a")};
  border-radius: 16px;
`;

export default Switch;
