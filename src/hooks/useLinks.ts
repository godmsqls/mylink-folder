"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LinkItem } from "@/data/profile";
import { fetchLinks, addLink, updateLink, deleteLink } from "@/lib/firestore";

/**
 * Firestore users/{userId}/links 데이터를 비동기 조회하는 TanStack Query 훅
 * (실시간 리스너 대신 캐싱 및 온디맨드 쿼리 활용)
 */
export function useLinkQuery(userId?: string | null) {
  return useQuery<LinkItem[]>({
    queryKey: ["links", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await fetchLinks(userId);
    },
    enabled: !!userId,
  });
}

// 사용자 요청 네이밍(useLinkquery) 호환용 alias
export const useLinkquery = useLinkQuery;

/**
 * 링크 추가, 수정, 삭제 작업을 위한 TanStack Mutation 훅
 */
export function useLinkMutations(userId?: string | null) {
  const queryClient = useQueryClient();

  // 링크 추가 Mutation
  const addMutation = useMutation({
    mutationFn: async (newLink: LinkItem) => {
      if (!userId) throw new Error("사용자 ID가 필요합니다.");
      const docId = await addLink(userId, newLink);
      return { ...newLink, id: docId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });

  // 링크 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, link }: { id: string; link: Partial<LinkItem> }) => {
      if (!userId) throw new Error("사용자 ID가 필요합니다.");
      await updateLink(userId, id, link);
      return { id, link };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });

  // 링크 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("사용자 ID가 필요합니다.");
      await deleteLink(userId, id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });

  return {
    addLink: addMutation,
    updateLink: updateMutation,
    deleteLink: deleteMutation,
  };
}
