import styled from "@emotion/styled";

import { Props as BlockProps } from "..";
import { Border, Title } from "../common";

export type Props = BlockProps<Property>;

export type Property = {
  default?: {
    image?: string;
    title?: string;
    fullSize?: boolean;
    imageSize?: "contain" | "cover";
    imagePositionX?: "left" | "center" | "right";
    imagePositionY?: "top" | "center" | "bottom";
  };
};

const ImageBlock: React.FC<Props> = ({ block, infoboxProperty }) => {
  const {
    title,
    fullSize,
    image: src,
    imageSize,
    imagePositionX,
    imagePositionY,
  } = (block?.property as Property | undefined)?.default ?? {};
  const { size: infoboxSize } = infoboxProperty?.default ?? {};

  return (
    <Wrapper fullSize={fullSize} infoboxSize={infoboxSize}>
      {title && <Title infoboxProperty={infoboxProperty}>{title}</Title>}
      {
        <Image
          src={src}
          fullSize={fullSize}
          imageSize={imageSize}
          imagePositionX={imagePositionX}
          imagePositionY={imagePositionY}
          name={title}
          infoboxSize={infoboxSize}
        />
      }
    </Wrapper>
  );
};

const Wrapper = styled(Border)<{
  fullSize?: boolean;
  infoboxSize?: string;
}>`
  margin: ${({ fullSize }) => (fullSize ? "0" : "0 8px")};
  height: ${(props) => (props.infoboxSize === "large" ? "340px" : "200px")};
`;

const Image = styled.img<{
  fullSize?: boolean;
  imageSize?: "contain" | "cover";
  imagePositionX?: "left" | "center" | "right";
  imagePositionY?: "top" | "center" | "bottom";
  isHovered?: boolean;
  isSelected?: boolean;
  name?: string;
  infoboxSize?: string;
}>`
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: ${(props) =>
    props.infoboxSize === "large"
      ? props.name
        ? "326px"
        : "340px"
      : props.name
      ? "181px"
      : "200px"};
  object-fit: ${({ imageSize }) => imageSize || "cover"};
  object-position: ${({ imagePositionX, imagePositionY }) =>
    `${imagePositionX || "center"} ${imagePositionY || "center"}`};
  outline: none;
`;

export default ImageBlock;
