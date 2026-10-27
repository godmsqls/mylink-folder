"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Mail,
  ExternalLink,
  ChevronRight,
  Check,
  Share2,
  Copy,
  Layers,
  Code2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";
import { PROFILE_DATA, LinkItem } from "@/data/profile";
import { LinkCard } from "@/components/LinkCard";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { fetchLinks } from "@/lib/firestore";

export default function TossProfilePage() {
  const [activeTab, setActiveTab] = useState<"projects" | "skills" | "links">("projects");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>(PROFILE_DATA.links);
  const [linksLoading, setLinksLoading] = useState(false);

  // Firestore에서 링크 목록을 불러옴 (링크 탭 첫 진입 시 1회)
  const [linksFetched, setLinksFetched] = useState(false);

  useEffect(() => {
    if (activeTab !== "links" || linksFetched) return;
    setLinksLoading(true);
    fetchLinks()
      .then((firestoreLinks) => {
        if (firestoreLinks.length > 0) {
          setLinks(firestoreLinks);
        }
      })
      .catch((err) => console.error("링크 불러오기 실패:", err))
      .finally(() => {
        setLinksLoading(false);
        setLinksFetched(true);
      });
  }, [activeTab, linksFetched]);

  const handleAddLink = (newLink: LinkItem) => {
    setLinks((prev) => [...prev, newLink]);
    showToast("링크를 추가했어요");
  };

  const handleUpdateLink = (updatedLink: LinkItem) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === updatedLink.id ? updatedLink : item))
    );
    showToast("링크를 수정했어요");
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
    showToast("링크를 삭제했어요");
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    showToast("이메일 주소를 복사했어요");
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 링크를 복사했어요");
    }
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "github":
        return <GithubIcon className="w-5 h-5 text-[#333d4b]" />;
      case "linkedin":
        return <LinkedinIcon className="w-5 h-5 text-[#333d4b]" />;
      case "instagram":
        return <InstagramIcon className="w-5 h-5 text-[#333d4b]" />;
      default:
        return <ExternalLink className="w-5 h-5 text-[#333d4b]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28]">
      
      {/* ======================================================== */}
      {/* 토스트 알림창 (TDS Toast)                                */}
      {/* ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[14px] bg-[#191f28] text-white text-[14px] font-medium shadow-tds-toast animate-tds-fade whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-[#04c759] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 반응형 2단 레이아웃 (모바일 1단 스택 / 데스크톱 2단 분할) */}
      {/* ======================================================== */}
      <div className="w-full mx-auto min-h-screen flex flex-col">
        
        {/* 1. 상단 앱 바 (TDS TopBar, 56pt) - 데스크톱에서는 투명한 헤더로 전환 */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md px-5 flex items-center justify-between border-b border-[#e5e8eb]/60 lg:max-w-[1024px] lg:mx-auto lg:w-full lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:px-8 lg:pt-6 lg:pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#3182f6] flex items-center justify-center text-white text-[13px] font-bold">
              E
            </div>
            <span className="text-[17px] font-bold text-[#191f28]">
              {PROFILE_DATA.name}
            </span>
          </div>

          <button
            onClick={handleShareProfile}
            aria-label="프로필 링크 복사"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4e5968] hover:bg-[#e5e8eb] active:bg-[#d1d6db] transition-colors cursor-pointer lg:bg-white lg:shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </header>

        {/* 메인 콘텐츠 그리드 (모바일: Stack / 데스크톱: 2-Columns Grid) */}
        <main className="w-full max-w-[480px] lg:max-w-[1024px] mx-auto flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:px-8 pt-0 lg:pt-6 pb-32 lg:pb-12">
          
          {/* [좌측 패널] 프로필 히어로 카드 */}
          <div className="w-full lg:w-[360px] lg:shrink-0 lg:sticky lg:top-[88px] z-10 flex flex-col">
            <section className="mx-4 lg:mx-0 mt-3 lg:mt-0 mb-3 lg:mb-0 p-6 bg-white rounded-[24px] shadow-tds-1 border border-[#e5e8eb]/50">
          <div className="flex items-center gap-4 mb-4">
            {/* 64px 라운드 아바타 */}
            <div className="relative w-16 h-16 rounded-[20px] overflow-hidden bg-[#f2f4f6] flex-shrink-0 border border-[#e5e8eb]">
              <Image
                src={PROFILE_DATA.avatarImage}
                alt={PROFILE_DATA.name}
                fill
                priority
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[22px] sm:text-[24px] font-bold text-[#191f28] tracking-tight">
                  {PROFILE_DATA.name}
                </h1>
                <span className="text-[13px] text-[#8b95a1] font-medium">
                  {PROFILE_DATA.englishName}
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#4e5968] mt-0.5">
                {PROFILE_DATA.role}
              </p>
            </div>
          </div>

          {/* 활동 상태 뱃지 (TDS Brand-Weak Pill) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[13px] font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#3182f6]" />
            <span>새로운 기회와 프로젝트를 기다리고 있어요</span>
          </div>

          {/* 소개글 (해요체 톤앤매너) */}
          <p className="text-[15px] text-[#333d4b] leading-[1.5] break-keep mb-5">
            문제를 코드로 깔끔하게 해결하고 직관적인 사용자 경험을 만들어요. 최신 웹 기술과 AI Vibe Coding으로 빠르고 완성도 높은 프로덕트를 개발하고 있어요.
          </p>

          {/* 스탯 요약 박스 (3-Columns) */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#f9fafb] rounded-[16px] border border-[#e5e8eb]/60 text-center">
            {PROFILE_DATA.stats.map((stat) => (
              <div key={stat.label} className="space-y-0.5">
                <p className="text-[17px] font-bold text-[#191f28]">
                  {stat.value}
                </p>
                <p className="text-[12px] font-medium text-[#8b95a1]">
                  {stat.label}
                </p>
              </div>
            ))}
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
              href={`mailto:${PROFILE_DATA.email}`}
              className="h-10 px-3 rounded-[12px] btn-tds-secondary text-[13px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Mail className="w-3.5 h-3.5 text-[#6b7684]" />
              <span>메일 앱 열기</span>
            </a>
          </div>
        </section>
          </div>

          {/* [우측 패널] 탭 컨트롤 & 콘텐츠 */}
          <div className="w-full flex-1 flex flex-col min-w-0">
            
            {/* 3. 분절형 컨트롤 (TDS SegmentedControl) */}
            <div className="mx-4 lg:mx-0 mb-3 p-1 bg-[#e5e8eb] rounded-[14px] flex gap-1 select-none">
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

          <button
            onClick={() => setActiveTab("links")}
            className={`flex-1 py-2 rounded-[10px] text-[14px] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "links"
                ? "bg-white text-[#191f28] shadow-tds-1"
                : "text-[#6b7684] hover:text-[#191f28]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>링크 모음</span>
          </button>
        </div>

        {/* 4. 탭 콘텐츠 영역 */}
        
        {/* 탭 1: 프로젝트 목록 */}
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
                      {/* 프로젝트 이미지 썸네일 */}
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

                    {/* 스택 태그 칩 */}
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

                    {/* 프로젝트 바로가기 액션 */}
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

        {/* 탭 2: 기술 스택 */}
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

        {/* 탭 3: 링크 & 소셜 채널 (TDS ListRow) */}
        {activeTab === "links" && (
          <div className="space-y-3 animate-tds-fade">
            <div className="mx-4 lg:mx-0 bg-white rounded-[24px] p-2 shadow-tds-1 border border-[#e5e8eb]/50">
              <div className="p-3 pb-1">
                <h3 className="text-[16px] font-bold text-[#191f28]">
                  연결된 채널
                </h3>
                <p className="text-[13px] text-[#8b95a1] mt-0.5">
                  기록과 작업물을 함께 살펴보실 수 있어요.
                </p>
              </div>

              <div className="flex flex-col mt-2 px-1 pb-1">
                {linksLoading ? (
                  <div className="flex items-center justify-center py-8 text-[13px] text-[#8b95a1]">
                    링크를 불러오는 중…
                  </div>
                ) : (
                  links
                    .slice()
                    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
                    .map((link) => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        onUpdate={handleUpdateLink}
                        onDelete={handleDeleteLink}
                      />
                    ))
                )}
                <AddLinkDialog onAdd={handleAddLink} />
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

        {/* 푸터 영역 */}
            <footer className="mt-8 mb-4 text-center lg:text-left text-[12px] text-[#8b95a1] space-y-1 lg:px-2">
              <p>© {new Date().getFullYear()} {PROFILE_DATA.name} ({PROFILE_DATA.englishName})</p>
              <p className="text-[11px] text-[#b0b8c1]">토스 디자인 시스템(TDS) 스타일로 구성된 프로필입니다</p>
            </footer>
          </div>
        </main>

      </div>

      {/* ======================================================== */}
      {/* 5. 화면 최하단 고정 버튼 (TDS BottomCTA)                 */}
      {/* ======================================================== */}
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


