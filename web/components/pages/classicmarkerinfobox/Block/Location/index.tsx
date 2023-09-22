import styled from "@emotion/styled";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Props as BlockProps } from "..";
import { LatLng } from "../../util/value";
import { Border, Title } from "../common";

import iconSvg from "./icon.svg?raw";

export type Props = BlockProps<Property>;

export type Property = {
  default?: {
    location?: LatLng;
    title?: string;
    fullSize?: boolean;
  };
};

const defaultCenter = { lat: 0, lng: 0 };

export default function LocationBlock({
  block,
  infoboxProperty,
}: Props): JSX.Element {
  const { location, title, fullSize } =
    (block?.property as Property | undefined)?.default ?? {};
  const { size: infoboxSize } = infoboxProperty?.default ?? {};

  return (
    <Wrapper fullSize={fullSize}>
      {title && <Title infoboxProperty={infoboxProperty}>{title}</Title>}
      <MapContainer
        style={{
          height:
            infoboxSize === "large"
              ? title
                ? "236px"
                : "250px"
              : title
              ? "232px"
              : "250px",
          overflow: "hidden",
          zIndex: 1,
        }}
        center={location ?? defaultCenter}
        zoom={13}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && (
          <Marker icon={icon} position={location} draggable={false} />
        )}
      </MapContainer>
    </Wrapper>
  );
}

const Wrapper = styled(Border)<{
  fullSize?: boolean;
}>`
  margin: ${({ fullSize }) => (fullSize ? "0" : "0 8px")};
  border-radius: 6px;
  height: 250px;
  color: #000000;
`;

const icon = L.divIcon({
  className: "custom-icon",
  html: iconSvg,
});
