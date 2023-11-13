import styled from "@emotion/styled";
import { ComponentType } from "react";
import type { Block, InfoboxProperty } from "src/apiType";

import { ValueType, ValueTypes } from "../util/value";

import builtin from "./builtin";

export type { Block } from "src/apiType";

export type Props<BP = any> = {
  isEditable?: boolean;
  isBuilt?: boolean;
  isSelected?: boolean;
  block?: Block<BP>;
  infoboxProperty?: InfoboxProperty;
  onClick?: () => void;
  onChange?: <T extends ValueType>(
    schemaItemId: string,
    fieldId: string,
    value: ValueTypes[T],
    type: T
  ) => void;
};

export type Component<BP = any> = ComponentType<Props<BP>>;

export default function BlockComponent<P = any>({
  ...props
}: Props<P>): JSX.Element | null {
  const Builtin =
    props.block?.pluginId && props.block.extensionId
      ? builtin[`${props.block.pluginId}/${props.block.extensionId}`]
      : undefined;

  return Builtin ? (
    <BuiltinWrapper>
      <Builtin {...props} />
    </BuiltinWrapper>
  ) : null;
}

const BuiltinWrapper = styled.div`
  padding: 10px 0;
`;
