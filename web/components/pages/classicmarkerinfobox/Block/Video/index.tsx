import styled from "@emotion/styled";
import Player from "react-player";

import { Props as BlockProps } from "..";
import { Border, Title } from "../common";

export type Props = BlockProps<Property>;

export type Property = {
  default?: {
    url?: string;
    title?: string;
    fullSize?: boolean;
  };
};

const VideoBlock: React.FC<Props> = ({ block, infoboxProperty }) => {
  const {
    url: videoUrl,
    fullSize,
    title,
  } = (block?.property as Property | undefined)?.default ?? {};
  const { size: infoboxSize } = infoboxProperty?.default ?? {};

  return (
    <Wrapper fullSize={fullSize} infoboxSize={infoboxSize}>
      {title && <Title infoboxProperty={infoboxProperty}>{title}</Title>}
      {
        <Player
          url={videoUrl}
          width="100%"
          height={
            infoboxSize === "large"
              ? title
                ? "326px"
                : "340px"
              : title
              ? "185px"
              : "200px"
          }
          playsinline
          pip
          controls
          preload
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

export default VideoBlock;
