import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import { useCallback, useEffect, useRef, useState } from "react";

export type CommentItemType = {
  prefecture: string;
  authorName: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

type CommentItemProps = {
  comment: CommentItemType;
};

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const CommentContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [extended, setExtended] = useState(false);

  const toggleExtended = useCallback(() => {
    setExtended(!extended);
  }, [extended]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].target.scrollHeight > entries[0].target.clientHeight) {
        setIsOverflow(true);
      }
    });

    if (CommentContainerRef.current) {
      resizeObserver.observe(CommentContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <StyledCommentItem>
      <Commenter>
        <Name>{comment.authorName}</Name>
        <City>{comment.prefecture}</City>
      </Commenter>
      <CommentContainer ref={CommentContainerRef} extended={extended}>
        {comment.content}
      </CommentContainer>
      {isOverflow && (
        <ExtendButton onClick={toggleExtended}>
          <StyledIcon icon="extendArrow" size={16} extended={extended} />
          {extended ? "Collapse" : "View more"}
        </ExtendButton>
      )}
    </StyledCommentItem>
  );
};

const StyledCommentItem = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f4f4f4;
`;

const Commenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const Name = styled.div`
  max-width: 50%;
  flex: 1;
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  color: #262626;
`;

const City = styled.div`
  max-width: 50%;
  flex: 1;
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  color: #a8a8a8;
  text-align: right;
`;

const CommentContainer = styled.div<{ extended: boolean }>`
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  color: #262626;
  display: -webkit-box;

  ${({ extended }) =>
    !extended &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  `};
`;

const ExtendButton = styled.div`
  margin-top: 4px;
  font-size: 12px;
  line-height: 24px;
  font-weight: 500;
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(Icon)<{ extended: boolean }>`
  margin-right: 4px;
  transform: ${({ extended }) => (extended ? "rotate(180deg)" : "rotate(0)")};
`;
