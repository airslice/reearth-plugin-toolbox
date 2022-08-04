import styled from "@emotion/styled";

export type Props = {
  text: string;
  status?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<Props> = ({ text, onClick, status, disabled }) => {
  return (
    <StyledButton onClick={onClick} off={status === "off"} disabled={disabled}>
      {text}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ off: boolean; disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  gap: 10px;
  border-radius: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  outline: none;
  border: none;
  cursor: pointer;
  user-select: none;
  background: ${({ off, disabled }) =>
    off || disabled ? "#262626" : "#3b3cd0"};
  color: ${({ off, disabled }) => (off || disabled ? "#595959" : "#ededed")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
`;

export default Button;
