import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";

export type Props = {
  text: string;
  icon?: string;
  buttonType?: "button" | "tag";
  buttonStyle?: "primary" | "secondary";
  compact?: boolean;
  status?: string;
  disabled?: boolean;
  extendWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: React.FC<Props> = ({
  text,
  icon,
  buttonType = "button",
  buttonStyle = "primary",
  compact = false,
  status,
  disabled = false,
  extendWidth = false,
  onClick,
}) => {
  return (
    <StyledButton
      buttonType={buttonType}
      buttonStyle={buttonStyle}
      compact={compact}
      onClick={onClick}
      status={status ?? ""}
      disabled={disabled}
      extendWidth={extendWidth}
    >
      {icon && (
        <IconArea>
          <Icon icon={icon} size={16} />
        </IconArea>
      )}
      {text}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  buttonType: string;
  buttonStyle: string;
  compact: boolean;
  status: string;
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
  border: ${({ status, disabled, buttonStyle }) =>
    status === "on"
      ? "1px solid #3b3cd0"
      : buttonStyle === "secondary"
      ? "1px solid #595959"
      : status === "off" || disabled
      ? "1px solid #262626"
      : "1px solid #3b3cd0"};
  cursor: pointer;
  user-select: none;
  background: ${({ status, disabled, buttonStyle }) =>
    status === "on"
      ? "#3b3cd0"
      : buttonStyle === "secondary"
      ? "none"
      : status === "off" || disabled
      ? "#262626"
      : "#3b3cd0"};
  color: ${({ status, disabled }) =>
    status === "off" || disabled ? "#595959" : "#ededed"};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  width: ${({ extendWidth }) => (extendWidth ? "100%" : "auto")};
  height: ${({ buttonType }) => (buttonType === "button" ? "30px" : "23px")};
  transition: all 0.1s ease-out;

  @media (any-hover: hover) {
    &:hover {
      background: ${({ status, disabled, buttonStyle }) =>
        status === "off" || disabled
          ? buttonStyle === "secondary"
            ? "none"
            : "#262626"
          : "#3b3cd0"};
      border: ${({ status, disabled, buttonStyle }) =>
        status === "off" || disabled
          ? buttonStyle === "secondary"
            ? "1px solid #595959"
            : "1px solid #262626"
          : "1px solid #3b3cd0"};
    }
  }
`;

const IconArea = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

export default Button;
