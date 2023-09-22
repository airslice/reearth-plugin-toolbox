import styled from "@emotion/styled";
import type { InfoboxProperty } from "src/apiType";

import fonts from "../util/fonts";
import { typographyStyles } from "../util/value";

export const Title = styled.div<{ infoboxProperty?: InfoboxProperty }>`
  color: #000;
  font-size: ${fonts.sizes.xs}px;
  ${({ infoboxProperty }) =>
    typographyStyles(infoboxProperty?.default?.typography)}
`;

export const Border = styled.div``;
