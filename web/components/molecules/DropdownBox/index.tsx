import styled from "@emotion/styled";
import Divider from "@web/components/atoms/Divider";
import Icon from "@web/components/atoms/Icon";
import { useEffect, useMemo, useState } from "react";

export type Props = {
  title?: string;
  noFolder?: boolean;
  mainContent?: React.ReactNode;
  fixedContent?: React.ReactNode;
  noBorder?: boolean;
  onResize?: () => void;
};

const DropdownBox: React.FC<Props> = ({
  title,
  noFolder = false,
  mainContent,
  fixedContent,
  noBorder = false,
  onResize,
}) => {
  const [folded, setFolded] = useState(false);

  const hasMainContent = useMemo(
    () => !!mainContent?.toString(),
    [mainContent]
  );

  const hasFixedContent = useMemo(
    () => !!fixedContent?.toString(),
    [fixedContent]
  );

  useEffect(() => {
    onResize?.();
  }, [folded, onResize]);

  return (
    <Wrapper noBorder={noBorder}>
      {title && (
        <Title
          interactive={!noFolder}
          onClick={() => {
            !noFolder && setFolded(!folded);
          }}
        >
          {title}
          {!noFolder && (
            <Icon
              icon="arrowSelect"
              size={9}
              style={{ transform: `rotate(${folded ? "90" : "0"}deg)` }}
            />
          )}
        </Title>
      )}
      {hasFixedContent && (
        <FixedContent noBorder={noBorder}>{fixedContent}</FixedContent>
      )}
      {!folded && hasMainContent && <Divider dividerType="secondary" />}
      {!folded && hasMainContent && (
        <MainContent noBorder={noBorder}>{mainContent}</MainContent>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ noBorder: boolean }>`
  background: ${({ noBorder }) => (noBorder ? "none" : "#141414;")};
  border: ${({ noBorder }) => (noBorder ? "none" : "1px solid #353535")};
  border-radius: 4px;
  overflow: hidden;
`;

const Title = styled.div<{ interactive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  height: 36px;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #bfbfbf;
  user-select: none;
  cursor: ${({ interactive }) => (interactive ? "pointer" : "default")};
`;

const FixedContent = styled.div<{ noBorder: boolean }>`
  padding: ${({ noBorder }) => (noBorder ? "0" : "8px")};
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MainContent = styled.div<{ noBorder: boolean }>`
  padding: ${({ noBorder }) => (noBorder ? "0" : "8px")};
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export default DropdownBox;
