import styled from "@emotion/styled";
import { Theme } from "@web/theme/common";

import TextArea from "../TextArea";

export type Props<T> = {
  className?: string;
  headers?: (keyof T)[];
  items?: T[];
  textSize?: number;
  layout?: "auto" | "fixed";
  textAlign?: "left" | "center" | "right";
  width?: string;
  columnWidth?: string;
  scroll?: boolean;
  multiLine?: boolean;
  tableAlignment: "Vertical" | "Horizontal";
};

export default function Table<T>({
  className,
  width,
  headers,
  items,
  textSize = 10,
  layout = "auto",
  textAlign = "center",
  columnWidth,
  scroll = false,
  multiLine = false,
  tableAlignment = "Horizontal",
}: Props<T>): JSX.Element | null {
  return (
    <StyledTable
      textSize={textSize}
      layout={layout}
      className={className}
      textAlign={textAlign}
      multiLine={multiLine}
      width={width}
      scroll={scroll}
    >
      <thead>
        <StyledTr>
          {tableAlignment !== "Vertical" &&
            headers?.map((h, i) => (
              <StyledTh key={i} width={columnWidth}>
                <StyledText>{h}</StyledText>
              </StyledTh>
            ))}
        </StyledTr>
      </thead>
      <tbody>
        {tableAlignment != "Vertical"
          ? items?.map((item, i) => {
              return (
                <StyledTr key={i}>
                  {headers?.map((h, i) => {
                    return (
                      <StyledTd key={i}>
                        <StyledText>{item[h]}</StyledText>
                      </StyledTd>
                    );
                  })}
                </StyledTr>
              );
            })
          : items?.map((item) => {
              return headers?.map((h, i) => {
                return (
                  item[h] && (
                    <StyledTr key={i}>
                      <StyledTd key={1}>
                        <StyledText>{h}</StyledText>
                      </StyledTd>
                      <StyledTd key={2}>
                        <StyledText>{item[h]}</StyledText>
                      </StyledTd>
                    </StyledTr>
                  )
                );
              });
            })}
      </tbody>
    </StyledTable>
  );
}

const StyledTable = styled.table<{
  bg?: string;
  borderColor?: string;
  textColor?: string;
  textSize?: number;
  layout?: "auto" | "fixed";
  textAlign?: "left" | "center" | "right";
  multiLine?: boolean;
  scroll?: boolean;
  width?: string;
  theme?: Theme;
}>`
  table-layout: ${({ layout }) => layout};
  white-space: ${({ multiLine }) => (multiLine ? "normal" : "nowrap")};
  background:  ${(props) => props.theme.colors.background}
  color: ${(props) => props.theme.colors.main}
  font-size: ${({ textSize }) => `${textSize}px`};
  width: ${({ width }) => (width ? width : "100%")};
  overflow: ${({ scroll }) => (scroll ? "scroll" : "hidden")};
  display: block;
`;

const StyledTh = styled.th<{ width?: string }>`
  width: ${({ width }) => width};
`;

const StyledTr = styled.tr<{
  width?: string;
  textAlign?: string;
}>`
  width: ${({ width }) => (width ? width : "100%")};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : "center")};
  line-height: 16px;
`;

const StyledTd = styled.td<{
  columnWidth?: string;
}>`
  width: ${({ columnWidth }) => (columnWidth ? columnWidth : "100%")};
`;

const StyledText = styled(TextArea)`
  align-items: flex-start;
`;
