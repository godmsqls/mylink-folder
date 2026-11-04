"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  Mail,
  ExternalLink,
  Check,
  Share2,
  Copy,
  Layers,
  Code2,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  User as UserIcon,
  Home,
  Edit3,
} from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/SocialIcons";
import { PROFILE_DATA, LinkItem } from "@/data/profile";
import { LinkCard } from "@/components/LinkCard";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import {
  getUserIdByDisplayName,
  getUserProfile,
  fetchLinks,
  UserProfile,
} from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";

interface ToastState {
  message: string;
  type: "success" | "error";
}

interface PageProps {
  params: Promise<{ displayName: string }>;
}

export default function DisplayNameProfilePage({ params }: PageProps) {
  // Next.js 16 비동기 params 언랩
  const resolvedParams = use(params);
  const rawDisplayName = resolvedParams.displayName || "";
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim();

  const router = useRouter();
  const { user: currentUser, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"projects" | "skills" | "links">("projects");
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // ────────────────────────────────────────────────────────────
  // 1. displayName으로 userId 검색 (where 쿼리)
  // ────────────────────────────────────────────────────────────
  const {
    data: userId,
    isLoading: isSearchingUser,
    isError: searchError,
  } = useQuery({
    queryKey: ["user-id-by-display-name", decodedDisplayName],
    queryFn: async () => {
      if (!decodedDisplayName) return null;
      return await getUserIdByDisplayName(decodedDisplayName);
    },
    enabled: !!decodedDisplayName,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });

  // ────────────────────────────────────────────────────────────
  // 2. 프로필 조회 (users/{userId}/profile 또는 users/{userId})
  // ────────────────────────────────────────────────────────────
  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ["profile-by-uid", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // ────────────────────────────────────────────────────────────
  // 3. 링크 목록 조회 (users/{userId}/links)
  // ────────────────────────────────────────────────────────────
  const {
    data: links = [],
    isLoading: isLinksLoading,
  } = useQuery({
    queryKey: ["links-by-uid", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await fetchLinks(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // 현재 로그인한 유저의 프로필 정보 (헤더 드롭다운용)
  const { data: myProfile } = useQuery({
    queryKey: ["my-profile", currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return null;
      return await getUserProfile(currentUser.uid);
    },
    enabled: !!currentUser?.uid,
  });

  const handleCopyEmail = () => {
    const emailToCopy = profile?.email || PROFILE_DATA.email;
    navigator.clipboard.writeText(emailToCopy);
    showToast("이메일 주소를 복사했어요", "success");
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 링크를 복사했어요", "success");
    }
  };

  // ────────────────────────────────────────────────────────────
  // 로딩 상태 UI
  // ────────────────────────────────────────────────────────────
  if (isSearchingUser) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-[20px] bg-white shadow-tds-1 flex items-center justify-center border border-[#e5e8eb] mb-4">
          <div className="w-6 h-6 border-3 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[14px] font-bold text-[#191f28]">
          &apos;{decodedDisplayName}&apos; 님의 마이링크를 찾는 중…
        </p>
        <p className="text-[12px] text-[#8b95a1] mt-1">잠시만 기다려 주세요</p>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // 404 처리 (displayName으로 검색한 유저가 없을 경우)
  // ────────────────────────────────────────────────────────────
  if (!isSearchingUser && (userId === null || searchError)) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex flex-col items-center justify-center p-6 text-[#191f28]">
        <div className="w-full max-w-[420px] bg-white rounded-[28px] p-8 shadow-tds-1 border border-[#e5e8eb] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-[22px] bg-red-50 text-[#f04452] flex items-center justify-center mb-5 shadow-inner">
            <AlertCircle className="w-8 h-8 stroke-[2.2]" />
          </div>

          <span className="text-[12px] font-bold tracking-wider uppercase text-[#3182f6] px-2.5 py-1 rounded-full bg-[#e8f3ff] mb-2">
            404 Not Found
          </span>
          <h1 className="text-[22px] font-bold text-[#191f28] mb-2">
            사용자를 찾을 수 없어요
          </h1>
          <p className="text-[14px] text-[#6b7684] leading-relaxed mb-6">
            <span className="font-semibold text-[#191f28]">&apos;{decodedDisplayName}&apos;</span> 표시 이름을 가진 사용자가 존재하지 않거나, 잘못된 주소입니다.
          </p>

          <div className="w-full flex flex-col gap-2.5">
            <Link
              href="/"
              className="w-full h-12 rounded-[14px] bg-[#3182f6] hover:bg-[#1b64da] active:bg-[#1553b7] text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Home className="w-4 h-4" />
              마이링크 홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 본인의 프로필 페이지인지 확인
  const isOwnProfile = !!currentUser?.uid && currentUser.uid === userId;

  const currentDisplayName = profile?.displayName || decodedDisplayName;
  const currentUsername = profile?.username || "user";
  const currentBio = profile?.bio ?? PROFILE_DATA.bio;
  const currentAvatar = profile?.photoURL || PROFILE_DATA.avatarImage;
  const currentEmail = profile?.email || PROFILE_DATA.email;

  // 활성화된 링크만 필터링
  const activeLinks = links.filter((link) => link.isActive !== false);

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28]">
      {/* TDS 토스트 알림창 */}
      {toast && (
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[14px] text-white text-[14px] font-medium shadow-tds-toast animate-tds-fade whitespace-nowrap ${
            toast.type === "error" ? "bg-[#e53935]" : "bg-[#191f28]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === "error" ? "bg-white/20" : "bg-[#04c759]"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5] text-white" />
            ) : (
              <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
            )}
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="w-full mx-auto min-h-screen flex flex-col">
        {/* 상단 네비게이션 헤더 */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md px-4 sm:px-5 flex items-center justify-between border-b border-[#e5e8eb]/60 lg:max-w-[1024px] lg:mx-auto lg:w-full lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:px-8 lg:pt-6 lg:pb-2">
          {/* 좌측: 로고 및 홈 이동 */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 rounded-full bg-[#3182f6] flex items-center justify-center text-white text-[13px] font-bold">
              {currentDisplayName[0] || "M"}
            </div>
            <span className="text-[16px] sm:text-[17px] font-bold text-[#191f28]">
              {currentDisplayName}
            </span>
          </Link>

          {/* 우측 액션: 프로필 드롭다운 or 홈 버튼, 공유 버튼 */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <ProfileDropdown
                displayName={myProfile?.displayName || currentUser.displayName || "내 계정"}
                email={currentUser.email}
                photoURL={myProfile?.photoURL || currentUser.photoURL}
                onSignOut={async () => {
                  await signOut();
                  showToast("로그아웃되었습니다.", "success");
                }}
              />
            ) : (
              <Link
                href="/"
                className="h-8 px-3 rounded-[10px] bg-white border border-[#e5e8eb] text-[12px] font-semibold text-[#3182f6] hover:bg-[#e8f3ff] transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>마이링크 만들기</span>
              </Link>
            )}

            <button
              onClick={handleShareProfile}
              aria-label="프로필 링크 복사"
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#4e5968] hover:bg-[#e5e8eb] active:bg-[#d1d6db] transition-colors cursor-pointer bg-white shadow-2xs shrink-0 border border-[#e5e8eb]/60"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 메인 콘텐츠 그리드 (모바일: Stack / 데스크톱: 2-Columns) */}
        <main className="w-full max-w-[480px] lg:max-w-[1024px] mx-auto flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:px-8 pt-0 lg:pt-6 pb-24 lg:pb-12">
          {/* [좌측 패널] 공개 프로필 히어로 카드 */}
          <div className="w-full lg:w-[360px] lg:shrink-0 lg:sticky lg:top-[88px] z-10 flex flex-col">
            <section className="mx-4 lg:mx-0 mt-3 lg:mt-0 mb-3 lg:mb-0 p-6 bg-white rounded-[24px] shadow-tds-1 border border-[#e5e8eb]/50">
              {/* 프로필 헤더 */}
              <div className="flex items-start gap-4 mb-3">
                <div className="w-16 h-16 rounded-[20px] overflow-hidden bg-[#f2f4f6] border border-[#e5e8eb] flex-shrink-0 shadow-2xs">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={currentDisplayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#3182f6] text-white text-[24px] font-bold flex items-center justify-center">
                      {currentDisplayName[0] || "M"}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-[#191f28] tracking-tight leading-tight truncate">
                    {currentDisplayName}
                  </h1>
                  <p className="text-[13px] font-semibold text-[#3182f6] mt-0.5">
                    @{currentUsername}
                  </p>
                  <p className="text-[11px] text-[#8b95a1] truncate mt-0.5">
                    {currentEmail}
                  </p>
                </div>
              </div>

              {/* 소개글 */}
              <p className="text-[14px] text-[#4e5968] leading-relaxed mb-4 whitespace-pre-wrap break-words">
                {currentBio}
              </p>

              {/* 스탯 요약 박스 */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#f9fafb] rounded-[16px] border border-[#f2f4f6] mb-4 text-center">
                <div>
                  <p className="text-[16px] font-bold text-[#191f28]">
                    {activeLinks.length}
                  </p>
                  <p className="text-[11px] text-[#8b95a1] mt-0.5">링크</p>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#3182f6]">
                    {activeLinks.filter((l) => l.type === "highlight").length}
                  </p>
                  <p className="text-[11px] text-[#8b95a1] mt-0.5">대표작</p>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#04c759]">Active</p>
                  <p className="text-[11px] text-[#8b95a1] mt-0.5">상태</p>
                </div>
              </div>

              {/* 빠른 액션 버튼 */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 h-10 rounded-[12px] bg-[#f2f4f6] hover:bg-[#e5e8eb] active:bg-[#d1d6db] text-[13px] font-semibold text-[#333d4b] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>이메일 복사</span>
                </button>
                <a
                  href={`mailto:${currentEmail}`}
                  className="flex-1 h-10 rounded-[12px] bg-[#3182f6] hover:bg-[#1b64da] active:bg-[#1553b7] text-[13px] font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>메일 보내기</span>
                </a>
              </div>

              {/* 소셜 링크 바 */}
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#f2f4f6]">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#f9fafb] hover:bg-[#f2f4f6] text-[#4e5968] flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#f9fafb] hover:bg-[#f2f4f6] text-[#4e5968] flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#f9fafb] hover:bg-[#f2f4f6] text-[#4e5968] flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4.5 h-4.5" />
                </a>
              </div>

              {/* 본인 프로필일 때 표시되는 바로가기 */}
              {isOwnProfile && (
                <div className="mt-4 pt-3 border-t border-[#f2f4f6]">
                  <Link
                    href="/"
                    className="w-full h-10 rounded-[12px] bg-[#e8f3ff] hover:bg-[#d0e6ff] text-[#3182f6] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>내 링크 편집기로 이동</span>
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* [우측 패널] 링크 목록 */}
          <div className="flex-1 w-full min-w-0 px-4 lg:px-0">
            {/* 3단 탭 네비게이션 */}
            <div className="mb-4 bg-white p-1 rounded-[16px] shadow-2xs border border-[#e5e8eb] flex">
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`flex-1 py-2 rounded-[12px] text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "projects"
                    ? "bg-[#3182f6] text-white shadow-sm"
                    : "text-[#6b7684] hover:text-[#191f28]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>대표작</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("links")}
                className={`flex-1 py-2 rounded-[12px] text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "links"
                    ? "bg-[#3182f6] text-white shadow-sm"
                    : "text-[#6b7684] hover:text-[#191f28]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>전체 링크</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`flex-1 py-2 rounded-[12px] text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "skills"
                    ? "bg-[#3182f6] text-white shadow-sm"
                    : "text-[#6b7684] hover:text-[#191f28]"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>소개/기술</span>
              </button>
            </div>

            {/* 탭 내용 */}
            <div className="bg-white rounded-[24px] p-4 sm:p-6 shadow-tds-1 border border-[#e5e8eb]/50">
              {isLinksLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-[13px] text-[#8b95a1]">링크를 불러오는 중…</p>
                </div>
              ) : activeTab === "skills" ? (
                /* 소개 / 기술 탭 */
                <div className="space-y-4 py-2">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#191f28] mb-2">
                      💡 소개 및 목표
                    </h3>
                    <p className="text-[13px] text-[#4e5968] leading-relaxed bg-[#f9fafb] p-3.5 rounded-[14px] border border-[#f2f4f6]">
                      {currentBio}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#191f28] mb-2">
                      🛠️ 주요 활동 링크
                    </h3>
                    <div className="space-y-2">
                      {activeLinks.slice(0, 3).map((link) => (
                        <LinkCard key={link.id} link={link} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 전체 링크 / 대표작 탭 */
                <div>
                  {activeLinks.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#f2f4f6] text-[#8b95a1] flex items-center justify-center mx-auto mb-3">
                        <Layers className="w-6 h-6" />
                      </div>
                      <p className="text-[14px] font-bold text-[#191f28]">
                        등록된 링크가 아직 없어요
                      </p>
                      <p className="text-[12px] text-[#8b95a1] mt-1">
                        새로운 소식이 등록되면 여기에 표시됩니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {(activeTab === "projects"
                        ? activeLinks.filter((l) => l.type === "highlight" || l.type === "link")
                        : activeLinks
                      ).map((link) => (
                        <LinkCard key={link.id} link={link} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
