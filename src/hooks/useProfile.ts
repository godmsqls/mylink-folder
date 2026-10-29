"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  UserProfile,
  ensureUserProfile,
  saveUserProfile,
  checkDisplayNameDuplicate,
} from "@/lib/firestore";

/**
 * 사용자 프로필 정보를 불러오는 TanStack Query 훅
 */
export function useProfileQuery(user: User | null) {
  return useQuery<UserProfile | null>({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      return await ensureUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    },
    enabled: !!user?.uid,
  });
}

interface ProfileMutationCallbacks {
  onSuccess?: (data: Partial<UserProfile>, variables: Partial<UserProfile>) => void;
  onError?: (error: Error, variables: Partial<UserProfile>) => void;
}

/**
 * 프로필 정보 수정 및 TanStack Query 기반 낙관적 업데이트(Optimistic Update) 훅
 * - onMutate에서 캐시를 즉시 갱신하여 UI 반응성 확보
 * - 중복 검사 또는 Firestore 저장 실패 시 onError에서 자동으로 이전 캐시로 롤백
 * - onSettled에서 서버 데이터와 최종 동기화
 */
export function useProfileMutation(
  user: User | null,
  callbacks?: ProfileMutationCallbacks
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProfileData: Partial<UserProfile>) => {
      if (!user?.uid) throw new Error("로그인이 필요합니다.");

      // 1. displayName 변경 시 중복 검사 수행
      if (newProfileData.displayName !== undefined) {
        const cleanName = newProfileData.displayName.trim();
        if (!cleanName) {
          throw new Error("표시 이름(displayName)은 비워둘 수 없습니다.");
        }

        const isDuplicate = await checkDisplayNameDuplicate(user.uid, cleanName);
        if (isDuplicate) {
          throw new Error(`"${cleanName}"은(는) 이미 사용 중인 표시 이름입니다.`);
        }
      }

      // 2. username 변경 시 유효성 검사
      if (newProfileData.username !== undefined) {
        const cleanUsername = newProfileData.username.trim().replace(/^@/, "");
        if (!cleanUsername) {
          throw new Error("username은 비워둘 수 없습니다.");
        }
      }

      // 3. Firestore users/{uid}에 영구 저장
      await saveUserProfile(user.uid, newProfileData);

      // 4. Firebase Auth currentUser 세션 동기화 (가능한 경우)
      if (auth.currentUser) {
        const authUpdates: { displayName?: string; photoURL?: string } = {};
        if (newProfileData.displayName) {
          authUpdates.displayName = newProfileData.displayName.trim();
        }
        if (newProfileData.photoURL) {
          authUpdates.photoURL = newProfileData.photoURL.trim();
        }
        if (Object.keys(authUpdates).length > 0) {
          try {
            await updateProfile(auth.currentUser, authUpdates);
          } catch (e) {
            console.warn("Auth profile sync skipped:", e);
          }
        }
      }

      return newProfileData;
    },

    // ────────────────────────────────────────────────────────────
    // 낙관적 업데이트 (Optimistic Update)
    // ────────────────────────────────────────────────────────────
    onMutate: async (newProfileData) => {
      if (!user?.uid) return;

      // 1. 백그라운드 재조회와의 충돌 방지를 위해 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["profile", user.uid] });

      // 2. 롤백을 위해 이전 프로필 캐시 스냅샷 보관
      const previousProfile = queryClient.getQueryData<UserProfile>([
        "profile",
        user.uid,
      ]);

      // 3. 캐시에 낙관적 업데이트 적용 (UI 즉시 반영)
      queryClient.setQueryData<UserProfile>(["profile", user.uid], (old) => {
        if (!old) return old;
        return {
          ...old,
          ...newProfileData,
          displayName:
            newProfileData.displayName !== undefined
              ? newProfileData.displayName.trim()
              : old.displayName,
          username:
            newProfileData.username !== undefined
              ? newProfileData.username.trim().replace(/^@/, "")
              : old.username,
        };
      });

      // 4. 에러 발생 시 rollback에 사용할 컨텍스트 반환
      return { previousProfile };
    },

    // ────────────────────────────────────────────────────────────
    // 에러 발생 시: 이전 상태로 안전하게 자동 롤백
    // ────────────────────────────────────────────────────────────
    onError: (err: any, variables, context) => {
      if (user?.uid && context?.previousProfile) {
        queryClient.setQueryData(
          ["profile", user.uid],
          context.previousProfile
        );
      }
      callbacks?.onError?.(err, variables);
    },

    onSuccess: (data, variables) => {
      callbacks?.onSuccess?.(data, variables);
    },

    // ────────────────────────────────────────────────────────────
    // 완료 시점: 서버 상태와 캐시 무결성 최종 검증 동기화
    // ────────────────────────────────────────────────────────────
    onSettled: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: ["profile", user.uid] });
      }
    },
  });
}
