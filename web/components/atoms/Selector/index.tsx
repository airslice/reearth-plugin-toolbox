import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";

import Divider from "../Divider";

type Props = {
  title?: string;
  options?: { title: string; value: any }[];
  defaultValue?: any;
  placeholder?: string;
  onSelect?: (value: any) => void;
  onResize?: () => void;
};

const Selector: React.FC<Props> = ({
  title,
  options,
  defaultValue,
  placeholder,
  onSelect,
  onResize,
}) => {
  const [folded, setFolded] = useState(true);
  useEffect(() => {
    onResize?.();
  }, [folded, options, onResize]);

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const current = useMemo(
    () => options?.find((o) => o.value === currentValue),
    [currentValue, options]
  );

  useEffect(() => {
    onSelect?.(current?.value);
  }, [current, onSelect]);

  const handleSelect = useCallback((value: any) => {
    setCurrentValue(value);
    setFolded(true);
  }, []);

  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      <ContentWrapper>
        <CurrentWrapper
          onClick={() => {
            setFolded(!folded);
          }}
        >
          <Current>
            {current?.title ?? (
              <Placeholder>{placeholder ?? "Please select.."}</Placeholder>
            )}
          </Current>
          <Icon
            icon="arrowSelect"
            size={9}
            style={{
              transform: `rotate(${folded ? "90" : "0"}deg)`,
              marginRight: "5px",
              flexShrink: 0,
            }}
          />
        </CurrentWrapper>
        <DropdownWrapper folded={folded}>
          <Divider />
          <Options>
            {options && options.length > 0 ? (
              options?.map((o) => (
                <Option
                  key={o.value.toString()}
                  onClick={() => {
                    handleSelect?.(o.value);
                  }}
                >
                  {o.title}
                </Option>
              ))
            ) : (
              <EmptyOption>EMPTY</EmptyOption>
            )}
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

const Current = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.fontColors.primary};
  }
`;

const Placeholder = styled.div`
  color: ${(props) => props.theme.colors.weak};
`;

const EmptyOption = styled(Option)`
  color: ${(props) => props.theme.colors.weak};
  pointer-events: none;
`;
