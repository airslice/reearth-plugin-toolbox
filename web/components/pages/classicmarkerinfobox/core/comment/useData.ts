import { useCallback, useEffect, useState } from "react";

import { CommentItemType } from "./CommentItem";

type Props = {
  backendUrl: string | undefined;
  postId: string | undefined;
};

export default ({ backendUrl, postId }: Props) => {
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [likesNum, setLikesNum] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingNewPost, setIsFetchingNewPost] = useState<boolean>(false);
  const [isAddingLike, setIsAddingLike] = useState<boolean>(false);

  const fetchComments = useCallback(
    async (postId: string) => {
      if (!backendUrl) return;
      setIsLoading(true);
      const res = await fetch(`${backendUrl}/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      return res.json();
    },
    [backendUrl]
  );

  const refetch = useCallback(async () => {
    if (!postId) return;
    const res = await fetchComments(postId);
    if (res.message === "Not found") {
      setComments([]);
      setLikesNum(0);
    } else {
      setComments(res?.comments ?? []);
      setLikesNum(res?.likesNum ?? 0);
    }
  }, [postId, fetchComments]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setLikesNum(0);
      return;
    }
    (async () => {
      setIsFetchingNewPost(true);
      const res = await fetchComments(postId);
      if (res.message === "Not found") {
        setComments([]);
        setLikesNum(0);
      } else {
        setComments(res?.comments ?? []);
        setLikesNum(res?.likesNum ?? 0);
      }
      setIsFetchingNewPost(false);
    })();
  }, [postId, fetchComments]);

  const addLike = useCallback(async () => {
    if (!backendUrl || !postId) return;
    setIsAddingLike(true);
    const res = await fetch(`${backendUrl}/posts/${postId}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    setIsAddingLike(false);
    if (result) {
      localStorage.setItem(`like-${postId}`, "true");
      setHasLiked(true);
    }
    refetch();
  }, [backendUrl, postId, refetch]);

  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    setHasLiked(localStorage.getItem(`like-${postId}`) === "true");
  }, [postId]);

  return {
    comments,
    likesNum,
    hasLiked,
    isLoading,
    isFetchingNewPost,
    isAddingLike,
    addLike,
    refetch,
  };
};
