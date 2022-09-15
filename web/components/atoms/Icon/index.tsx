import styled from "@emotion/styled";
import React, { AriaAttributes, AriaRole, CSSProperties, memo } from "react";

import CommonSvgIcons from "./commonSvgIcons";
import PluginSvgIcons from "./pluginSvgIcons";

export type Icons = keyof typeof CommonSvgIcons;

export type Props = {
  className?: string;
  icon?: string;
  size?: string | number;
  color?: string;
  style?: CSSProperties;
  role?: AriaRole;
  onClick?: () => void;
} & AriaAttributes;

const Icon: React.FC<Props> = ({
  className,
  icon,
  style,
  color,
  size,
  role,
  onClick,
}) => {
  const sizeStr = typeof size === "number" ? `${size}px` : size;

  const Iconele = Object.assign(CommonSvgIcons, PluginSvgIcons)[icon as Icons];

  return (
    <Wrapper
      className={className}
      style={style}
      role={role}
      color={color}
      size={sizeStr}
      onClick={onClick}
    >
      <Iconele />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ color?: string; size?: string }>`
  font-size: 0;
  display: inline-block;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  color: ${({ color }) => color};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export default memo(Icon);
