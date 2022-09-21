import { css } from "@emotion/react";
import styled from "@emotion/styled";

export type Props = {
  text: string;
  icon?: string;
  buttonType?: "button" | "tag";
  buttonStyle?: "primary" | "secondary";
  status?: string;
  disabled?: boolean;
  extendWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Tag: React.FC<Props> = ({ text, status, disabled = false, onClick }) => {
  return (
    <StyledTag onClick={onClick} status={status ?? ""} disabled={disabled}>
      {text}
    </StyledTag>
  );
};

const StyledTag = styled.button<{
  status: string;
  disabled: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  width: auto;
  height: 23px;
  border-radius: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  outline: none;
  transition: all 0.1s ease-out;
  cursor: pointer;
  user-select: none;
  border-width: 1px;
  border-style: solid;

  ${(props) => {
    if (props.status === "off") {
      return css`
        background: ${props.theme.colors.off};
        border-color: ${props.theme.colors.off};
        color: ${props.theme.fontColors.off};
      `;
    } else {
      return css`
        background: ${props.theme.colors.primary};
        border-color: ${props.theme.colors.primary};
        color: ${props.theme.fontColors.primary};
      `;
    }
  }};

  ${(props) => {
    if (props.disabled) {
      return css`
        pointer-events: none;
        background: none;
        color: ${props.theme.colors.disabled};
        border-color: ${props.theme.colors.disabled};
      `;
    }
  }};
`;

export default Tag;
