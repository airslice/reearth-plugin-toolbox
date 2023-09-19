import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";

import Divider from "../Divider";

type OptionValue = string | number | boolean;
type Props = {
  title?: string;
  options?: { title: string; value: OptionValue }[];
  defaultValue?: OptionValue;
  onSelect?: (value: OptionValue) => void;
  onResize?: () => void;
};

const Selector: React.FC<Props> = ({
  title,
  options,
  defaultValue,
  onSelect,
  onResize,
}) => {
  const [folded, setFolded] = useState(true);
  useEffect(() => {
    onResize?.();
  }, [folded, onResize]);

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const currentTitle = useMemo(
    () => options?.find((o) => o.value === currentValue)?.title,
    [currentValue, options]
  );

  const handleSelect = useCallback(
    (value: OptionValue) => {
      setCurrentValue(value);
      setFolded(true);
      onSelect?.(value);
    },
    [onSelect]
  );

  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      <ContentWrapper>
        <CurrentWrapper
          onClick={() => {
            setFolded(!folded);
          }}
        >
          <Current>{currentTitle ?? "Please select.."}</Current>
          <Icon
            icon="arrowSelect"
            size={9}
            style={{
              transform: `rotate(${folded ? "90" : "0"}deg)`,
              marginRight: "5px",
            }}
          />
        </CurrentWrapper>
        <DropdownWrapper folded={folded}>
          <Divider />
          <Options>
            {options?.map((o) => (
              <Option
                key={o.value.toString()}
                onClick={() => {
                  handleSelect?.(o.value);
                }}
              >
                {o.title}
              </Option>
            ))}
          </Options>
        </DropdownWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Selector;

const Wrapper = styled.div``;

const ContentWrapper = styled.div`
  border: ${(props) => `1px solid ${props.theme.colors.weakest}`};
  border-radius: 4px;
  overflow: hidden;
`;

const Title = styled.div`
  display: inline-block;
  padding: 2px;
  height: 25px;
  border-radius: 4px 0px;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.main};
`;

const CurrentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  height: 36px;
  font-size: 14px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.main};
  user-select: none;
  cursor: pointer;
`;

const Current = styled.div``;

const DropdownWrapper = styled.div<{ folded: boolean }>`
  display: ${({ folded }) => (folded ? "none" : "block")};
`;

const Options = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Option = styled.div`
  padding: 2px 4px;
  height: 25px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.main};
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.fontColors.primary};
  }
`;
