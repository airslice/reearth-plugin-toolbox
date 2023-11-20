import { useCallback, useState } from "react";

import { CommentItemType } from "../../core/comment/CommentItem";

type Props = {
  backendUrl: string | undefined;
  postId: string | undefined;
};

export default ({ backendUrl, postId }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addComment = useCallback(
    async (comment: CommentItemType) => {
      if (!backendUrl || !postId) return;
      setIsLoading(true);
      const res = await fetch(`${backendUrl}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      const result = await res.json();
      setIsLoading(false);
      return result;
    },
    [backendUrl, postId]
  );

  return { isLoading, addComment };
};
