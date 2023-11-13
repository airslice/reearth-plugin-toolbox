import styled from "@emotion/styled";
import Icon from "@web/components/atoms/Icon";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState } from "react";

import { CommentItem, CommentItemType } from "./CommentItem";
import { mockComments } from "./mock";

type CommentsAndLikesProps = {
  uuid: string;
  client: any;
};
export const CommentsAndLikes: React.FC<CommentsAndLikesProps> = ({
  uuid,
  client,
}) => {
  const [showCommentPanel, setShowCommentPanel] = useState(true);
  const [comments, setComments] = useState<CommentItemType[]>(mockComments);
  const [hasLiked, setHasLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    if (!client || !uuid) return;
    console.log(uuid);
    client
      .get({
        endpoint: "comments",
      })
      .then((res: any) => console.log(res));
  }, [client, uuid]);

  const toggleCommentPanel = useCallback(() => {
    setShowCommentPanel(!showCommentPanel);
  }, [showCommentPanel]);

  const openFormModal = useCallback(() => {
    postMsg("openFormModal", { uuid });
  }, [uuid]);

  return (
    <StyledCommentsAndLikes>
      <ActionsWrapper>
        <Action active={showCommentPanel} onClick={toggleCommentPanel}>
          <Icon size={24} icon="comment" />
          <ActionText>{totalComments}</ActionText>
        </Action>
        <Action active={hasLiked}>
          <Icon size={24} icon="like" />
          <ActionText>{totalLikes}</ActionText>
        </Action>
      </ActionsWrapper>
      {showCommentPanel && (
        <CommentPanel>
          <CommentButtonWrapper>
            <CommentButton onClick={openFormModal}>
              コメントを書く
            </CommentButton>
          </CommentButtonWrapper>
          <CommentList>
            <CommentListTitle>コメント</CommentListTitle>
            {comments.map((comment, index) => (
              <CommentItem key={index} comment={comment}></CommentItem>
            ))}
          </CommentList>
        </CommentPanel>
      )}
    </StyledCommentsAndLikes>
  );
};

const StyledCommentsAndLikes = styled.div`
  display: block;
  font-family: "Noto Sans", "hiragino sans", "hiragino kaku gothic proN",
    -apple-system, BlinkMacSystem, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.71;
  color: #000;
  padding: 0 12px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #f4f4f4;
  height: 49px;
`;

const Action = styled.div<{
  active: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: ${({ active }) => (active ? "var(--primary-color)" : "#A8A8A8")};
`;

const ActionText = styled.span`
  font-size: 14px;
  padding-top: 2px;
`;

const CommentPanel = styled.div``;

const CommentButtonWrapper = styled.div`
  padding: 12px 16px;
`;

const CommentButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-radius: 6px;
  color: #fff;
  background-color: var(--primary-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0 4px 4px #ededed;
  }
`;

const CommentList = styled.div``;

const CommentListTitle = styled.div`
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: #6f6f6f;
`;
