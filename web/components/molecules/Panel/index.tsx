import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import { useCallback, useState, useRef, useEffect } from "react";

export type Props = {
  title: string;
  icon: string;
  children?: React.ReactNode;

  cellSize?: number;
  fullWidth?: number;
  ref?: any;
  onResize?: (width: number, height: number) => void;
  onFoldChange?: (active: boolean) => void;
};

const Panel: React.FC<Props> = ({
  title,
  icon,
  children,
  onResize,
  onFoldChange,
  cellSize = 44,
  fullWidth = 312,
}) => {
  const [folded, setFolded] = useState(true);
  const [width, setWidth] = useState(cellSize);
  const [height, setHeight] = useState(cellSize);

  const content = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const toggleFolded = useCallback(() => {
    setFolded(!folded);
    onFoldChange?.(folded);
  }, [folded, onFoldChange]);

  useEffect(() => {
    if (folded) {
      setHeight(cellSize);
      setWidth(cellSize);
      onResize?.(cellSize, cellSize);
    } else {
      const fullHeight = content.current
        ? content.current.clientHeight + cellSize
        : cellSize;
      setHeight(fullHeight);
      setWidth(fullWidth);
      onResize?.(fullWidth, fullHeight);
    }
  }, [
    folded,
    cellSize,
    fullWidth,
    onResize,
    content.current?.clientWidth,
    content.current?.clientHeight,
  ]);

  return (
    <Wrapper ref={wrapper} width={width} height={height}>
      <FixArea width={fullWidth}>
        <Header height={cellSize}>
          <HeaderInfo>
            <IconArea width={cellSize} onClick={toggleFolded}>
              <Icon icon={icon} size={20} />
            </IconArea>
            <Title>{title}</Title>
          </HeaderInfo>
          <IconArea width={cellSize} onClick={toggleFolded}>
            <Icon icon="cross" size={20} />
          </IconArea>
        </Header>
        <Content ref={content}>{children}</Content>
      </FixArea>
    </Wrapper>
  );
};

const Header = styled.div<{ height?: number }>`
  height: ${({ height }) => height}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  user-select: none;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const IconArea = styled.div<{ width?: number }>`
  width: ${({ width }) => width}px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${(props) => props.theme.colors.main};
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: ${(props) => props.theme.colors.main};
`;

const Content = styled.div`
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Wrapper = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: ${(props) => props.theme.colors.background};
  color: #c7c5c5;
  border-radius: 4px;
  overflow: hidden;
`;

const FixArea = styled.div<{ width?: number }>`
  position: absolute;
  width: ${({ width }) => width}px;
`;

export default Panel;
