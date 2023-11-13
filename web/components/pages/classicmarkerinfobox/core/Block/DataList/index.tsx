import styled from "@emotion/styled";
import React, { Fragment } from "react";

import { Props as BlockProps } from "..";
import { Typography, typographyStyles } from "../../util/value";
import { Border, Title } from "../common";

export type Props = BlockProps<Property>;

export type Item = {
  id: string;
  item_title?: string;
  item_datatype?: "string" | "number";
  item_datastr?: string;
  item_datanum?: number;
};

export type Property = {
  default?: {
    title?: string;
    typography?: Typography;
  };
  items?: Item[];
};

const DataList: React.FC<Props> = ({ block, infoboxProperty }) => {
  const { items } = (block?.property as Property | undefined) ?? {};
  const { title, typography } = block?.property?.default ?? {};

  return (
    <Wrapper typography={typography}>
      {title && <Title infoboxProperty={infoboxProperty}>{title}</Title>}
      <Dl>
        {items?.map((i) => (
          <Fragment key={i.id}>
            <Dt>{i.item_title}</Dt>
            <Dd>
              {i.item_datatype === "number" ? i.item_datanum : i.item_datastr}
            </Dd>
          </Fragment>
        ))}
      </Dl>
    </Wrapper>
  );
};

const Wrapper = styled(Border)<{
  typography?: Typography;
}>`
  margin: 0 8px;
  ${({ typography }) => typographyStyles({ ...typography })}
  min-height: 70px;
`;

const Dl = styled.dl`
  display: flex;
  flex-wrap: wrap;
  min-height: 15px;
`;

const Dt = styled.dt`
  width: 30%;
  padding: 10px;
  padding-left: 0;
  box-sizing: border-box;
  font-weight: bold;
`;

const Dd = styled.dd`
  width: 70%;
  margin: 0;
  padding: 10px;
  padding-right: 0;
  box-sizing: border-box;
`;

export default DataList;
