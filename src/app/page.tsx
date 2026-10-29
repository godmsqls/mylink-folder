"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/SocialIcons";
import { PROFILE_DATA, LinkItem } from "@/data/profile";
import { LinkCard } from "@/components/LinkCard";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { LandingPage } from "@/components/LandingPage";
import { UserProfile } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { InlineEditableField } from "@/components/InlineEditableField";
import { AvatarEditable } from "@/components/AvatarEditable";
import { useQueryClient } from "@tanstack/react-query";
import { useLinkquery, useLinkMutations } from "@/hooks/useLinks";
import { useProfileQuery, useProfileMutation } from "@/hooks/useProfile";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function TossProfilePage() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"projects" | "skills" | "links">("projects");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // ────────────────────────────────────────────────────────────
  // TanStack Query 기반 데이터 관리 (실시간 리스너 배제, 훅 기반 간결화)
  // ────────────────────────────────────────────────────────────
  const { data: links = [], isLoading: linksLoading } = useLinkquery(user?.uid);
  const { addLink, updateLink, deleteLink } = useLinkMutations(user?.uid);

  const { data: profile, isLoading: profileLoading } = useProfileQuery(user);

  // TanStack Query 기반 낙관적 프로필 업데이트 뮤테이션 (중복 검사 및 자동 롤백 내장)
  const { mutate: updateProfile } = useProfileMutation(user, {
    onSuccess: (_, variables) => {
      if (variables.displayName !== undefined) {
        showToast("표시 이름을 저장했어요", "success");
      } else if (variables.username !== undefined) {
        showToast("아이디(@username)를 저장했어요", "success");
      } else if (variables.bio !== undefined) {
        showToast("소개글(bio)을 저장했어요", "success");
      } else if (variables.photoURL !== undefined) {
        showToast("아바타 이미지를 변경했어요", "success");
      }
    },
    onError: (error) => {
      showToast(
        error.message || "저장 중 오류가 발생하여 이전 상태로 복원했습니다.",
        "error"
      );
    },
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        showToast(`${loggedUser.displayName || "사용자"}님, 환영합니다! 🎉`, "success");
      }
    } catch {
      showToast("로그인 중 오류가 발생했어요. 다시 시도해 주세요.", "error");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast("로그아웃되었습니다.", "success");
    } catch {
      showToast("로그아웃 중 오류가 발생했어요.", "error");
    }
  };

  // ────────────────────────────────────────────────────────────
  // 프로필 인라인 수정 핸들러 (TanStack Query 낙관적 업데이트 트리거)
  // ────────────────────────────────────────────────────────────
  const handleUpdateDisplayName = (newDisplayName: string) => {
    if (!profile) return;
    const cleanName = newDisplayName.trim();
    if (!cleanName) {
      showToast("표시 이름(displayName)은 비워둘 수 없습니다.", "error");
      return;
    }
    if (cleanName === profile.displayName) return;
    updateProfile({ displayName: cleanName });
  };

  const handleUpdateUsername = (newUsername: string) => {
    if (!profile) return;
    const cleanUsername = newUsername.trim().replace(/^@/, "");
    if (!cleanUsername) {
      showToast("username은 비워둘 수 없습니다.", "error");
      return;
    }
    if (cleanUsername === profile.username) return;
    updateProfile({ username: cleanUsername });
  };

  const handleUpdateBio = (newBio: string) => {
    if (!profile) return;
    const cleanBio = newBio.trim();
    if (cleanBio === profile.bio) return;
    updateProfile({ bio: cleanBio });
  };

  const handleUpdateAvatar = (newPhotoURL: string) => {
    if (!profile) return;
    const cleanUrl = newPhotoURL.trim();
    if (!cleanUrl || cleanUrl === profile.photoURL) return;
    updateProfile({ photoURL: cleanUrl });
  };

  const handleAddLink = (_newLink: LinkItem) => {
    queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
    showToast("링크를 추가했어요", "success");
  };

  const handleUpdateLink = (_updatedLink: LinkItem) => {
    queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
    showToast("링크를 수정했어요", "success");
  };

  const handleDeleteLink = (_id: string) => {
    queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
    showToast("링크를 삭제했어요", "success");
  };

  const handleCopyEmail = () => {
    const emailToCopy = profile?.email || user?.email || PROFILE_DATA.email;
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
  // 인증 상태 로딩 중 (초기 세션 감지 화면)
  // ────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-[20px] bg-white shadow-tds-1 flex items-center justify-center border border-[#e5e8eb] mb-4">
          <div className="w-6 h-6 border-3 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[14px] font-bold text-[#191f28]">마이링크를 불러오는 중…</p>
        <p className="text-[12px] text-[#8b95a1] mt-1">잠시만 기다려 주세요</p>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // 1. 비로그인 상태: 랜딩 페이지 (설명 문구 및 구글 로그인 CTA)
  // ────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
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
        <LandingPage onSignIn={handleSignIn} isSigningIn={isSigningIn} />
      </>
    );
  }

  // ────────────────────────────────────────────────────────────
  // 2. 로그인 상태: 사용자 개인 맞춤 페이지
  // ────────────────────────────────────────────────────────────
  const currentDisplayName =
    profile?.displayName || user.displayName || PROFILE_DATA.name;
  const currentUsername =
    profile?.username || (user.email ? user.email.split("@")[0] : "user");
  const currentBio = profile?.bio ?? PROFILE_DATA.bio;
  const currentAvatar =
    profile?.photoURL || user.photoURL || PROFILE_DATA.avatarImage;
  const currentEmail = profile?.email || user.email || PROFILE_DATA.email;

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28]">
      
      {/* 토스트 알림창 (TDS Toast) - 성공/실패 시각적 구분 */}
      {toast && (
        <div
          className={`fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[14px] text-white text-[14px] font-medium shadow-tds-toast animate-tds-fade whitespace-nowrap ${
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

      {/* 반응형 2단 레이아웃 (모바일 1단 스택 / 데스크톱 2단 분할) */}
      <div className="w-full mx-auto min-h-screen flex flex-col">
        
        {/* 상단 네비게이션 헤더 (TDS TopBar, 56pt) */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md px-4 sm:px-5 flex items-center justify-between border-b border-[#e5e8eb]/60 lg:max-w-[1024px] lg:mx-auto lg:w-full lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:px-8 lg:pt-6 lg:pb-2">
          {/* 좌측: 로고 및 사용자 이름 */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-full bg-[#3182f6] flex items-center justify-center text-white text-[13px] font-bold">
              {currentDisplayName[0] || "M"}
            </div>
            <span className="text-[16px] sm:text-[17px] font-bold text-[#191f28]">
              {currentDisplayName}
            </span>
          </div>

          {/* 우측: 로그인 사용자 상태 및 프로필 공유 버튼 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-white border border-[#e5e8eb] shadow-2xs">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={currentDisplayName}
                    referrerPolicy="no-referrer"
                    className="w-4.5 h-4.5 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full bg-[#3182f6] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {currentDisplayName[0] || "유"}
                  </div>
                )}
                <span className="text-[12px] sm:text-[13px] font-semibold text-[#191f28] max-w-[80px] sm:max-w-[120px] truncate">
                  {currentDisplayName}님
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="h-8 px-2 sm:px-2.5 rounded-[8px] text-[12px] font-medium text-[#6b7684] hover:text-[#191f28] hover:bg-[#e5e8eb] active:bg-[#d1d6db] transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </div>

            <button
              onClick={handleShareProfile}
              aria-label="프로필 링크 복사"
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#4e5968] hover:bg-[#e5e8eb] active:bg-[#d1d6db] transition-colors cursor-pointer lg:bg-white lg:shadow-2xs shrink-0"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 메인 콘텐츠 그리드 (모바일: Stack / 데스크톱: 2-Columns Grid) */}
        <main className="w-full max-w-[480px] lg:max-w-[1024px] mx-auto flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:px-8 pt-0 lg:pt-6 pb-32 lg:pb-12">
          
          {/* [좌측 패널] 개인 프로필 히어로 카드 (아바타, username, displayname, bio 인라인 편집) */}
          <div className="w-full lg:w-[360px] lg:shrink-0 lg:sticky lg:top-[88px] z-10 flex flex-col">
            <section className="mx-4 lg:mx-0 mt-3 lg:mt-0 mb-3 lg:mb-0 p-6 bg-white rounded-[24px] shadow-tds-1 border border-[#e5e8eb]/50">
              
              {/* 프로필 헤더: 아바타 + displayName + username + 이메일 */}
              <div className="flex items-start gap-4 mb-3">
                {/* 1. 아바타 (64px 라운드 스퀘어, 호버 시 수정 오버레이 및 인라인 팝오버) */}
                <AvatarEditable
                  photoURL={currentAvatar}
                  displayName={currentDisplayName}
                  onSave={handleUpdateAvatar}
                  disabled={profileLoading}
                />

                <div className="min-w-0 flex-1">
                  {/* 2. displayName (인라인 편집 UI: 클릭 시 Input 전환, Enter/Blur 시 중복검사 후 저장, ESC 시 취소) */}
                  <div className="flex items-center">
                    <InlineEditableField
                      value={currentDisplayName}
                      onSave={handleUpdateDisplayName}
                      placeholder="이름을 입력해 주세요"
                      className="text-[20px] sm:text-[22px] font-bold text-[#191f28] tracking-tight leading-tight"
                      inputClassName="text-[18px] sm:text-[20px] font-bold text-[#191f28] py-0.5"
                      ariaLabel="표시 이름 (displayName) 수정"
                      disabled={profileLoading}
                    />
                  </div>

                  {/* 3. username (인라인 편집 UI: @아이디) */}
                  <div className="mt-0.5 flex items-center">
                    <InlineEditableField
                      value={currentUsername}
                      prefix="@"
                      onSave={handleUpdateUsername}
                      placeholder="username"
                      className="text-[13px] font-semibold text-[#3182f6] hover:text-[#1b64da]"
                      inputClassName="text-[13px] font-semibold text-[#191f28] py-0.5"
                      ariaLabel="사용자 아이디 (username) 수정"
                      disabled={profileLoading}
                    />
                  </div>

                  <p className="text-[11px] text-[#8b95a1] truncate mt-1">
                    {currentEmail}
                  </p>
                </div>
              </div>

              {/* 인라인 편집 안내 팁 */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-[#f2f4f6] text-[#6b7684] text-[11px] font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3182f6] shrink-0" />
                <span className="truncate">이름, 아이디, 소개글을 클릭하여 바로 수정할 수 있어요</span>
              </div>

              {/* 활동 상태 뱃지 (TDS Brand-Weak Pill) */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[13px] font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-[#3182f6]" />
                <span>새로운 기회와 프로젝트를 기다리고 있어요</span>
              </div>

              {/* 4. 소개글 bio (인라인 편집 UI: 클릭 시 textarea 전환, Enter/Blur 시 저장, ESC 시 취소) */}
              <div className="mb-5">
                <InlineEditableField
                  value={currentBio}
                  onSave={handleUpdateBio}
                  placeholder="자신을 소개하는 한 줄 소개글을 작성해 보세요."
                  isTextarea={true}
                  className="text-[14px] text-[#333d4b] leading-[1.5] break-keep w-full block"
                  inputClassName="text-[14px] text-[#333d4b] leading-[1.5]"
                  ariaLabel="소개글 (bio) 수정"
                  disabled={profileLoading}
                />
              </div>

              {/* 스탯 요약 박스 (3-Columns) */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#f9fafb] rounded-[16px] border border-[#e5e8eb]/60 text-center">
                <div className="space-y-0.5">
                  <p className="text-[17px] font-bold text-[#191f28]">
                    {links.length}
                  </p>
                  <p className="text-[12px] font-medium text-[#8b95a1]">
                    등록된 링크
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[17px] font-bold text-[#191f28]">
                    {PROFILE_DATA.projects.length}
                  </p>
                  <p className="text-[12px] font-medium text-[#8b95a1]">
                    프로젝트
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[17px] font-bold text-[#191f28]">
                    {PROFILE_DATA.skills.reduce((acc, cat) => acc + cat.skills.length, 0)}
                  </p>
                  <p className="text-[12px] font-medium text-[#8b95a1]">
                    기술 스택
                  </p>
                </div>
              </div>

              {/* 보조 액션 버튼군 (TDS Secondary Buttons) */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={handleCopyEmail}
                  className="h-10 px-3 rounded-[12px] btn-tds-secondary text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#6b7684]" />
                  <span>이메일 복사</span>
                </button>
                <a
                  href={`mailto:${currentEmail}`}
                  className="h-10 px-3 rounded-[12px] btn-tds-secondary text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6b7684]" />
                  <span>메일 앱 열기</span>
                </a>
              </div>
            </section>
          </div>

          {/* [우측 패널] 탭 컨트롤 & 개인화된 콘텐츠 */}
          <div className="w-full flex-1 flex flex-col min-w-0">
            
            {/* 분절형 컨트롤 (TDS SegmentedControl) */}
            <div className="mx-4 lg:mx-0 mb-3 p-1 bg-[#e5e8eb] rounded-[14px] flex gap-1 select-none">
              <button
                onClick={() => setActiveTab("links")}
                className={`flex-1 py-2 rounded-[10px] text-[14px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "links"
                    ? "bg-white text-[#191f28] shadow-tds-1"
                    : "text-[#6b7684] hover:text-[#191f28]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>링크 모음 ({links.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 py-2 rounded-[10px] text-[14px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "projects"
                    ? "bg-white text-[#191f28] shadow-tds-1"
                    : "text-[#6b7684] hover:text-[#191f28]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>프로젝트</span>
              </button>

              <button
                onClick={() => setActiveTab("skills")}
                className={`flex-1 py-2 rounded-[10px] text-[14px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "skills"
                    ? "bg-white text-[#191f28] shadow-tds-1"
                    : "text-[#6b7684] hover:text-[#191f28]"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>기술 스택</span>
              </button>
            </div>

            {/* 탭 1: 링크 & 소셜 채널 (TDS ListRow, Firestore users/{uid}/links 연동) */}
            {activeTab === "links" && (
              <div className="space-y-3 animate-tds-fade">
                <div className="mx-4 lg:mx-0 bg-white rounded-[24px] p-2 shadow-tds-1 border border-[#e5e8eb]/50">
                  <div className="p-3 pb-1 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-bold text-[#191f28]">
                          연결된 채널
                        </h3>
                        <span className="px-2 py-0.5 rounded-[8px] bg-[#e8f3ff] text-[#3182f6] text-[11px] font-bold">
                          개인 보관함
                        </span>
                      </div>
                      <p className="text-[13px] text-[#8b95a1] mt-0.5">
                        {currentDisplayName}님의 개인 맞춤 링크 목록입니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col mt-2 px-1 pb-1">
                    {linksLoading ? (
                      <div className="flex items-center justify-center py-12 text-[13px] text-[#8b95a1]">
                        링크를 불러오는 중…
                      </div>
                    ) : links.length === 0 ? (
                      <div className="py-12 px-4 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#f2f4f6] text-[#8b95a1] flex items-center justify-center mb-3">
                          <Layers className="w-5 h-5" />
                        </div>
                        <p className="text-[15px] font-bold text-[#333d4b]">
                          아직 등록된 링크가 없어요
                        </p>
                        <p className="text-[12px] text-[#8b95a1] mt-1">
                          아래 "새 링크 추가하기" 버튼을 눌러 첫 번째 링크를 등록해보세요!
                        </p>
                      </div>
                    ) : (
                      links
                        .slice()
                        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
                        .map((link) => (
                          <LinkCard
                            key={link.id}
                            link={link}
                            userId={user.uid}
                            onUpdate={handleUpdateLink}
                            onDelete={handleDeleteLink}
                          />
                        ))
                    )}
                    <AddLinkDialog userId={user.uid} onAdd={handleAddLink} />
                  </div>

                  {/* 협업 문의 안내 박스 */}
                  <div className="m-2 mt-4 p-4 rounded-[16px] bg-[#e8f3ff] text-left">
                    <p className="text-[14px] font-bold text-[#191f28]">
                      새로운 협업 기회가 있으신가요?
                    </p>
                    <p className="text-[12px] text-[#4e5968] mt-1 leading-[1.4]">
                      프로젝트 제안이나 궁금한 점이 있으시다면 언제든 편하게 연락해 주세요.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 2: 대표 프로젝트 */}
            {activeTab === "projects" && (
              <div className="space-y-3 animate-tds-fade">
                <div className="mx-4 lg:mx-0 bg-white rounded-[24px] p-5 shadow-tds-1 border border-[#e5e8eb]/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[17px] font-bold text-[#191f28]">
                      대표 프로젝트
                    </h2>
                    <span className="text-[13px] font-semibold text-[#3182f6]">
                      {PROFILE_DATA.projects.length}개
                    </span>
                  </div>

                  <div className="space-y-4 divide-y divide-[#f2f4f6]">
                    {PROFILE_DATA.projects.map((project, idx) => (
                      <article
                        key={project.id}
                        className={`flex flex-col gap-3 ${idx > 0 ? "pt-4" : ""}`}
                      >
                        <div className="flex gap-3.5 items-start">
                          <div className="relative w-16 h-16 rounded-[14px] overflow-hidden bg-[#f2f4f6] flex-shrink-0 border border-[#e5e8eb]">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-[15px] font-bold text-[#191f28] truncate">
                                {project.title}
                              </h3>
                              {project.featured && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#e8f3ff] text-[#3182f6]">
                                  추천
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-[#6b7684] line-clamp-2 mt-1 leading-[1.4]">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-[8px] bg-[#f2f4f6] text-[#4e5968] text-[11px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-1">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 h-9 rounded-[10px] bg-[#e8f3ff] text-[#3182f6] text-[12px] font-bold flex items-center justify-center gap-1 hover:bg-[#d9ecff] transition-colors"
                            >
                              <span>서비스 체험하기</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 h-9 rounded-[10px] bg-[#f2f4f6] text-[#4e5968] text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[#e5e8eb] transition-colors"
                            >
                              <GithubIcon className="w-3.5 h-3.5" />
                              <span>코드 보기</span>
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 탭 3: 기술 스택 */}
            {activeTab === "skills" && (
              <div className="space-y-3 animate-tds-fade">
                {PROFILE_DATA.skills.map((category) => (
                  <div
                    key={category.category}
                    className="mx-4 lg:mx-0 bg-white rounded-[20px] p-5 shadow-tds-1 border border-[#e5e8eb]/50"
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <h3 className="text-[16px] font-bold text-[#191f28]">
                        {category.category}
                      </h3>
                      <span className="text-[12px] font-medium text-[#8b95a1]">
                        {category.skills.length}개
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="px-3.5 py-2 rounded-[12px] bg-[#f2f4f6] text-[#333d4b] text-[13px] font-semibold hover:bg-[#e8f3ff] hover:text-[#3182f6] transition-colors"
                        >
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 푸터 영역 */}
            <footer className="mt-8 mb-4 text-center lg:text-left text-[12px] text-[#8b95a1] space-y-1 lg:px-2">
              <p>© {new Date().getFullYear()} {currentDisplayName} · MyLink</p>
              <p className="text-[11px] text-[#b0b8c1]">토스 디자인 시스템(TDS) 스타일로 구성된 개인 프로필 공간입니다</p>
            </footer>
          </div>
        </main>

      </div>

      {/* 화면 최하단 고정 버튼 (TDS BottomCTA) */}
      <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center bottom-cta-barrier pointer-events-none">
        <div className="w-full max-w-[480px] lg:max-w-[1024px] lg:px-8 p-4 pointer-events-auto flex lg:justify-end">
          <button
            onClick={handleCopyEmail}
            className="w-full lg:w-[320px] h-14 rounded-[16px] btn-tds-primary text-[16px] font-bold flex items-center justify-center gap-2 shadow-tds-2 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <Mail className="w-4 h-4" />
            <span>이메일로 문의하기</span>
          </button>
        </div>
      </div>

    </div>
  );
}
