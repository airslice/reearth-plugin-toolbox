import styled from "@emotion/styled";
import svgToMiniDataURI from "mini-svg-data-uri";
import React, {
  AriaAttributes,
  AriaRole,
  CSSProperties,
  memo,
  useMemo,
} from "react";
import SVG from "react-inlinesvg";

import Icons from "./iconslist";

export type Icons = keyof typeof Icons;

export type Props = {
  className?: string;
  icon?: string;
  size?: string | number;
  alt?: string;
  color?: string;
  style?: CSSProperties;
  role?: AriaRole;
  onClick?: () => void;
} & AriaAttributes;

const Icon: React.FC<Props> = ({
  className,
  icon,
  alt,
  style,
  color,
  size,
  role,
  onClick,
}) => {
  const src = useMemo(
    () =>
      icon?.startsWith("<svg ") ? svgToMiniDataURI(icon) : Icons[icon as Icons],
    [icon]
  );
  if (!icon) return null;

  const sizeStr = typeof size === "number" ? `${size}px` : size;
  if (!src) {
    return (
      <StyledImg
        className={className}
        src={icon}
        alt={alt}
        style={style}
        role={role}
        size={sizeStr}
        onClick={onClick}
      />
    );
  }

  return (
    <StyledSvg
      className={className}
      src={src}
      style={style}
      role={role}
      color={color}
      size={sizeStr}
      onClick={onClick}
    />
  );
};

const StyledImg = styled.img<{ size?: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const StyledSvg = styled(SVG)<{ color?: string; size?: string }>`
  font-size: 0;
  display: inline-block;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  color: ${({ color }) => color};
`;

export default memo(Icon);
