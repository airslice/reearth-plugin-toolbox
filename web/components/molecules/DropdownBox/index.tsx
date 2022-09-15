import styled from "@emotion/styled";
import Divider from "@web/components/atoms/Divider";
import Icon from "@web/components/atoms/Icon";
import Switch from "@web/components/atoms/Switch";
import { useCallback, useEffect, useMemo, useState } from "react";

export type Props = {
  title?: string;
  contentId?: string;
  switcher?: boolean;
  folder?: boolean;
  mainContent?: React.ReactNode;
  fixedContent?: React.ReactNode;
  noBorder?: boolean;
  onResize?: () => void;
  onSwitchChange?: (contentId: string | undefined, enabled: boolean) => void;
};

const DropdownBox: React.FC<Props> = ({
  title,
  contentId,
  switcher = false,
  folder = false,
  mainContent,
  fixedContent,
  noBorder = false,
  onResize,
  onSwitchChange,
}) => {
  const [folded, setFolded] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const hasMainContent = useMemo(
    () => !!mainContent?.toString(),
    [mainContent]
  );

  const hasFixedContent = useMemo(
    () => !!fixedContent?.toString(),
    [fixedContent]
  );

  const toggleEnabled = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled]);

  useEffect(() => {
    onResize?.();
  }, [folded, enabled, onResize]);

  useEffect(() => {
    onSwitchChange?.(contentId, enabled);
  }, [contentId, enabled, onSwitchChange]);

  return (
    <Wrapper noBorder={noBorder}>
      {title && (
        <Title
          interactive={folder}
          onClick={() => {
            folder && setFolded(!folded);
          }}
        >
          {title}
          <>
            {folder && (
              <Icon
                icon="arrowSelect"
                size={9}
                style={{
                  transform: `rotate(${folded ? "90" : "0"}deg)`,
                  marginRight: "5px",
                }}
              />
            )}
            {switcher && <Switch onClick={toggleEnabled} enabled={enabled} />}
          </>
        </Title>
      )}
      {(!switcher || (switcher && enabled)) && hasFixedContent && (
        <FixedContent noBorder={noBorder}>{fixedContent}</FixedContent>
      )}
      {(!switcher || (switcher && enabled)) && !folded && hasMainContent && (
        <Divider />
      )}
      {(!switcher || (switcher && enabled)) && !folded && hasMainContent && (
        <MainContent noBorder={noBorder}>{mainContent}</MainContent>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ noBorder: boolean }>`
  border: ${(props) =>
    props.noBorder ? "none" : `1px solid ${props.theme.colors.weakest}`};
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
  color: ${(props) => props.theme.colors.main};
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
