import styled from "@emotion/styled";

export type Props = {
  text: string;
  buttonType?: "primary" | "secondary";
  compact?: boolean;
  status?: string;
  disabled?: boolean;
  extendWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<Props> = ({
  text,
  buttonType = "primary",
  compact = false,
  status,
  disabled = false,
  extendWidth = false,
  onClick,
}) => {
  return (
    <StyledButton
      buttonType={buttonType}
      compact={compact}
      onClick={onClick}
      off={status === "off"}
      disabled={disabled}
      extendWidth={extendWidth}
    >
      {text}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  buttonType: string;
  compact: boolean;
  off: boolean;
  disabled: boolean;
  extendWidth: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ compact }) => (compact ? "2px 4px" : "2px 10px")};
  border-radius: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  outline: none;
  border: ${({ off, disabled, buttonType }) =>
    buttonType === "secondary"
      ? "1px solid #595959"
      : off || disabled
      ? "1px solid #262626"
      : "1px solid #3b3cd0"};
  cursor: pointer;
  user-select: none;
  background: ${({ off, disabled, buttonType }) =>
    buttonType === "secondary"
      ? "none"
      : off || disabled
      ? "#262626"
      : "#3b3cd0"};
  color: ${({ off, disabled }) => (off || disabled ? "#595959" : "#ededed")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  width: ${({ extendWidth }) => (extendWidth ? "100%" : "auto")};
`;

export default Button;
