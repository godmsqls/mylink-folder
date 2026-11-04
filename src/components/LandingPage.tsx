"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  BarChart3,
  Check,
  Smartphone,
  Share2,
  Flame,
  ChevronDown,
  Pencil,
  Eye,
  Users,
  Globe,
  BookOpen,
  FolderGit2,
  Video,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  GoogleIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/SocialIcons";

interface LandingPageProps {
  onSignIn: () => void;
  isSigningIn?: boolean;
}

// 페르소나 쇼케이스 데이터
interface Persona {
  id: string;
  role: string;
  name: string;
  handle: string;
  badge: string;
  avatar: string;
  bio: string;
  links: {
    title: string;
    sub: string;
    badge?: string;
    badgeColor?: string;
    icon: string;
  }[];
  stats: {
    views: string;
    clicks: string;
    rate: string;
  };
}

const PERSONAS: Persona[] = [
  {
    id: "dev",
    role: "개발자 (Developer)",
    name: "김민서",
    handle: "minseo.dev",
    badge: "풀스택 엔지니어",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80",
    bio: "기술로 세상을 더 편리하게 만드는 프론트엔드 개발자입니다. 오픈소스와 웹 성능 최적화에 진심입니다.",
    links: [
      {
        title: "GitHub Portfolio & OSS",
        sub: "github.com/minseo-dev · Star 120+",
        badge: "HOT",
        badgeColor: "bg-[#f04452] text-white",
        icon: "github",
      },
      {
        title: "기술 블로그 (Velog)",
        sub: "Next.js 16과 React 19 아키텍처 탐구기",
        badge: "NEW",
        badgeColor: "bg-[#3182f6] text-white",
        icon: "blog",
      },
      {
        title: "2026 프로덕트 포트폴리오",
        sub: "직접 개발한 웹 서비스 5종 인터랙티브 시연",
        badge: "추천",
        badgeColor: "bg-[#04c759] text-white",
        icon: "project",
      },
      {
        title: "커피챗 & 협업 제안 (LinkedIn)",
        sub: "새로운 기술 토크 언제든 환영해요",
        icon: "linkedin",
      },
    ],
    stats: {
      views: "4,820",
      clicks: "1,940",
      rate: "40.2%",
    },
  },
  {
    id: "designer",
    role: "디자이너 (Product Designer)",
    name: "이지원",
    handle: "jiwon.design",
    badge: "UI/UX 디자이너",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=260&q=80",
    bio: "문제를 해결하는 감각적인 인터페이스를 설계합니다. 토스 디자인 시스템(TDS) 열혈 팬입니다.",
    links: [
      {
        title: "Figma Community Kit 2026",
        sub: "12,000+ 디자이너가 복제한 디자인 시스템 키트",
        badge: "인기",
        badgeColor: "bg-[#8b5cf6] text-white",
        icon: "figma",
      },
      {
        title: "Behance Design Case Studies",
        sub: "금융 앱 리디자인 & 모바일 인터랙션 사례",
        badge: "Featured",
        badgeColor: "bg-[#3182f6] text-white",
        icon: "behance",
      },
      {
        title: "Notion 포트폴리오 웹문서",
        sub: "UX 리서치부터 프로토타입까지 전 과정 기록",
        badge: "필독",
        badgeColor: "bg-[#f59e0b] text-white",
        icon: "notion",
      },
      {
        title: "디자인 일상 & 영감 (Instagram)",
        sub: "@jiwon.design.daily",
        icon: "instagram",
      },
    ],
    stats: {
      views: "6,410",
      clicks: "3,120",
      rate: "48.6%",
    },
  },
  {
    id: "creator",
    role: "크리에이터 (Maker & Creator)",
    name: "박준혁",
    handle: "junhyuk.tech",
    badge: "테크 크리에이터",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=260&q=80",
    bio: "최신 AI 도구와 생산성 소프트웨어를 쉽고 빠르게 리뷰합니다. 구독자 3.5만 명과 함께하고 있어요.",
    links: [
      {
        title: "YouTube '준혁의 테크놀로지'",
        sub: "매주 화/금 저녁 8시 업로드 · 구독자 3.5만",
        badge: "LIVE",
        badgeColor: "bg-[#f04452] text-white",
        icon: "youtube",
      },
      {
        title: "주간 AI 트렌드 뉴스레터 (무료)",
        sub: "매주 월요일 아침 배달되는 핵심 AI 인사이트",
        badge: "NEW",
        badgeColor: "bg-[#04c759] text-white",
        icon: "newsletter",
      },
      {
        title: "1:1 온라인 멘토링 신청하기",
        sub: "커리어 전환 & 개발 입문 코칭 (선착순 마감)",
        badge: "마감임박",
        badgeColor: "bg-[#f04452] text-white",
        icon: "chat",
      },
      {
        title: "비즈니스 제휴 & 강연 문의",
        sub: "contact@junhyuk.tech",
        icon: "mail",
      },
    ],
    stats: {
      views: "12,900",
      clicks: "5,840",
      rate: "45.2%",
    },
  },
];

// FAQ 데이터
interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "정말 무료인가요? 숨겨진 유료 플랜이 있나요?",
    a: "네, 마이링크의 모든 핵심 기능(프로필 생성, 무제한 링크 추가, 실시간 인라인 편집, 클릭수 분석, 커스텀 뱃지)은 평생 100% 무료로 제공됩니다. 별도의 신용카드 등록도 전혀 필요하지 않아요.",
  },
  {
    q: "Google 계정 로그인 외에 별도의 회원가입 절차가 필요한가요?",
    a: "전혀 없습니다! 'Google로 시작하기' 버튼을 누르면 1초 만에 안전하게 인증되며, 즉시 나만의 개인 링크트리 페이지와 독립된 클라우드 저장소가 생성됩니다.",
  },
  {
    q: "내 마이링크 주소(URL)는 어떻게 구성되나요?",
    a: "기본적으로 서비스 주소 뒤에 설정하신 고유 닉네임이 붙는 형태(예: mylink.app/이름)로 제공됩니다. 언제든 프로필 편집 화면에서 자유롭게 수정하실 수 있어요.",
  },
  {
    q: "모바일 스마트폰과 PC 화면 둘 다 예쁘게 나오나요?",
    a: "물론입니다. 토스 디자인 시스템(TDS) 스타일의 반응형 디자인이 기본 적용되어 모바일에서는 한 손에 착 감기는 세련된 카드 뷰로, 데스크톱 PC에서는 여유롭고 깔끔한 레이아웃으로 완벽하게 보입니다.",
  },
  {
    q: "링크 클릭 통계와 방문자 수는 어떻게 확인하나요?",
    a: "로그인 후 상단 메뉴의 '방문자 통계' 탭을 누르면 링크별 실시간 클릭 수와 누적 조회수, 전환율을 직관적인 차트와 함께 한눈에 확인하실 수 있습니다.",
  },
];

export function LandingPage({ onSignIn, isSigningIn = false }: LandingPageProps) {
  // 인터랙티브 상태
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [phoneTheme, setPhoneTheme] = useState<"white" | "dark" | "blue">("white");
  const [activePhoneTab, setActivePhoneTab] = useState<"links" | "projects" | "about">("links");
  const [copiedLink, setCopiedLink] = useState(false);
  const [clickedLinkIndex, setClickedLinkIndex] = useState<number | null>(null);
  const [simulatedClicks, setSimulatedClicks] = useState<number>(3450);
  const [claimInput, setClaimInput] = useState<string>("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // 링크 아이콘 헬퍼 함수
  const renderLinkIcon = (type: string) => {
    switch (type) {
      case "github":
        return <GithubIcon className="w-4 h-4 text-[#191f28]" />;
      case "instagram":
        return <InstagramIcon className="w-4 h-4 text-[#e1306c]" />;
      case "linkedin":
        return <LinkedinIcon className="w-4 h-4 text-[#0a66c2]" />;
      case "blog":
        return <BookOpen className="w-4 h-4 text-[#20c997]" />;
      case "project":
        return <FolderGit2 className="w-4 h-4 text-[#3182f6]" />;
      case "youtube":
        return <Video className="w-4 h-4 text-[#f04452]" />;
      case "chat":
        return <MessageSquare className="w-4 h-4 text-[#8b5cf6]" />;
      case "mail":
        return <Mail className="w-4 h-4 text-[#4e5968]" />;
      default:
        return <Globe className="w-4 h-4 text-[#3182f6]" />;
    }
  };

  // 목업 내 링크 클릭 인터랙션
  const handleMockLinkClick = (idx: number) => {
    setClickedLinkIndex(idx);
    setSimulatedClicks((prev) => prev + 1);
    setTimeout(() => {
      setClickedLinkIndex(null);
    }, 1200);
  };

  // 목업 프로필 복사 인터랙션
  const handleCopyMockUrl = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 테마별 스타일 클래스
  const getThemeBg = () => {
    if (phoneTheme === "dark") return "bg-[#191f28] text-white";
    if (phoneTheme === "blue") return "bg-gradient-to-b from-[#1b64da] to-[#0d3b82] text-white";
    return "bg-white text-[#191f28]";
  };

  const getThemeCardBg = () => {
    if (phoneTheme === "dark") return "bg-[#252f3e] hover:bg-[#2d3a4d] text-white border-[#333d4b]";
    if (phoneTheme === "blue") return "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm";
    return "bg-[#f9fafb] hover:bg-[#f2f4f6] text-[#191f28] border-[#e5e8eb]";
  };

  const getThemeSubText = () => {
    if (phoneTheme === "dark") return "text-[#8b95a1]";
    if (phoneTheme === "blue") return "text-blue-100";
    return "text-[#6b7684]";
  };

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28] flex flex-col selection:bg-[#3182f6] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 상단 네비게이션 헤더 (Sticky Glassmorphic TDS TopBar) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 bg-white/85 backdrop-blur-md px-4 sm:px-6 border-b border-[#e5e8eb]/80 transition-all">
        <div className="max-w-[1140px] mx-auto h-full flex items-center justify-between">
          {/* 브랜드 로고 */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-tr from-[#1b64da] to-[#3182f6] flex items-center justify-center text-white text-[16px] font-black shadow-md shadow-[#3182f6]/25">
              M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[19px] font-black tracking-tight text-[#191f28]">
                MyLink
              </span>
              <span className="hidden sm:inline-block text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#e8f3ff] text-[#3182f6]">
                마이링크
              </span>
            </div>
          </div>

          {/* 데스크톱 메뉴 링크 */}
          <nav className="hidden md:flex items-center gap-7 text-[14px] font-semibold text-[#4e5968]">
            <a href="#features" className="hover:text-[#3182f6] transition-colors">
              주요 기능
            </a>
            <a href="#demo" className="hover:text-[#3182f6] transition-colors">
              미리보기
            </a>
            <a href="#personas" className="hover:text-[#3182f6] transition-colors">
              추천 프로필
            </a>
            <a href="#how-it-works" className="hover:text-[#3182f6] transition-colors">
              이용 방법
            </a>
            <a href="#faq" className="hover:text-[#3182f6] transition-colors">
              FAQ
            </a>
          </nav>

          {/* 구글 로그인 CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onSignIn}
              disabled={isSigningIn}
              className="h-10 px-4 rounded-[12px] bg-white border border-[#d1d6db] hover:border-[#3182f6] hover:bg-[#f9fafb] active:scale-[0.98] text-[#191f28] text-[13px] font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            >
              {isSigningIn ? (
                <div className="w-4 h-4 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4 shrink-0" />
              )}
              <span>{isSigningIn ? "로그인 중…" : "Google로 로그인"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. 히어로 섹션 (Hero Section) + 인터랙티브 라이브 스마트폰 목업 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 max-w-[1140px] mx-auto w-full">
        {/* 은은한 배경 글로우 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#3182f6]/10 via-[#04c759]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* 좌측 카피 & CTA (Col 7) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 상단 뱃지 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[13px] font-bold mb-6 border border-[#3182f6]/20 shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>1초 만에 완성하는 나만의 링크트리 & 포트폴리오</span>
            </div>

            {/* 메인 타이틀 */}
            <h1 className="text-[36px] sm:text-[50px] lg:text-[54px] font-black tracking-tight text-[#191f28] leading-[1.2] break-keep">
              나의 모든 링크와 작업을 <br />
              <span className="text-[#3182f6] relative inline-block">
                가장 감각적인 한 페이지
                <span className="absolute bottom-1.5 left-0 w-full h-[8px] bg-[#3182f6]/15 -z-10 rounded-full" />
              </span>
              에
            </h1>

            {/* 서브 카피 */}
            <p className="mt-5 text-[16px] sm:text-[18px] text-[#4e5968] leading-relaxed max-w-[560px] break-keep font-medium">
              흩어져 있던 GitHub, 기술 블로그, 포트폴리오, SNS를 한 곳에 모아보세요.
              복잡한 설정 없이 Google 로그인 한 번으로 나만의 퍼스널 웹페이지가 완성됩니다.
            </p>

            {/* 핵심 혜택 체크리스트 */}
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-y-2 gap-x-4 text-[13px] font-semibold text-[#333d4b]">
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#e5e8eb]">
                <CheckCircle2 className="w-4 h-4 text-[#04c759]" />
                <span>회원가입 절차 없이 1초 시작</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#e5e8eb]">
                <CheckCircle2 className="w-4 h-4 text-[#3182f6]" />
                <span>토스 디자인 시스템(TDS) 반응형</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#e5e8eb]">
                <CheckCircle2 className="w-4 h-4 text-[#8b5cf6]" />
                <span>실시간 클릭 & 방문자 통계</span>
              </div>
            </div>

            {/* 메인 액션 버튼 */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onSignIn}
                disabled={isSigningIn}
                className="w-full sm:w-auto h-14 px-8 rounded-[18px] bg-[#3182f6] hover:bg-[#1b64da] active:scale-[0.98] text-white text-[16px] font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#3182f6]/30 transition-all cursor-pointer group disabled:opacity-60"
              >
                {isSigningIn ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-5 h-5 brightness-0 invert" />
                )}
                <span>{isSigningIn ? "마이링크 생성 중…" : "Google로 무료 시작하기"}</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#demo"
                className="w-full sm:w-auto h-14 px-6 rounded-[18px] bg-white hover:bg-[#f9fafb] active:bg-[#e5e8eb] border border-[#d1d6db] text-[#333d4b] text-[15px] font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4 text-[#6b7684]" />
                <span>체험해보기</span>
              </a>
            </div>

            {/* 안심 문구 */}
            <p className="mt-3.5 text-[12px] text-[#8b95a1] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#04c759]" />
              <span>신용카드 등록 없음 · 평생 무료 · 언제든 자유롭게 수정</span>
            </p>
          </div>

          {/* 우측 인터랙티브 스마트폰 프리뷰 목업 (Col 5) */}
          <div id="demo" className="lg:col-span-5 flex flex-col items-center relative">
            {/* 목업 상단 컨트롤 바 */}
            <div className="w-full max-w-[340px] flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#4e5968]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#04c759] animate-pulse" />
                <span>실시간 라이브 체험</span>
              </div>

              {/* 스마트폰 테마 토글 버튼 */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#e5e8eb] shadow-2xs">
                <button
                  onClick={() => setPhoneTheme("white")}
                  title="라이트 모드"
                  className={`w-5 h-5 rounded-full border ${
                    phoneTheme === "white"
                      ? "border-[#3182f6] ring-2 ring-[#3182f6]/30 bg-white"
                      : "border-gray-200 bg-white"
                  }`}
                />
                <button
                  onClick={() => setPhoneTheme("blue")}
                  title="오션 블루 모드"
                  className={`w-5 h-5 rounded-full border ${
                    phoneTheme === "blue"
                      ? "border-[#3182f6] ring-2 ring-[#3182f6]/30 bg-[#3182f6]"
                      : "border-transparent bg-[#3182f6]"
                  }`}
                />
                <button
                  onClick={() => setPhoneTheme("dark")}
                  title="다크 모드"
                  className={`w-5 h-5 rounded-full border ${
                    phoneTheme === "dark"
                      ? "border-[#3182f6] ring-2 ring-[#3182f6]/30 bg-[#191f28]"
                      : "border-transparent bg-[#191f28]"
                  }`}
                />
              </div>
            </div>

            {/* 실제 스마트폰 디바이스 프레임 */}
            <div className="relative w-full max-w-[340px] rounded-[44px] p-3 bg-[#191f28] shadow-[0_25px_60px_-15px_rgba(25,31,40,0.3)] border-4 border-[#333d4b]">
              {/* 상단 다이나믹 아일랜드 & 스피커 */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1b64da]/50 border border-white/20" />
              </div>

              {/* 스마트폰 내부 스크린 */}
              <div
                className={`w-full rounded-[34px] overflow-hidden transition-colors duration-300 pt-9 pb-6 px-4 flex flex-col items-center min-h-[580px] ${getThemeBg()}`}
              >
                {/* 상단 미니 바 & 공유 버튼 */}
                <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-black/5 dark:border-white/10">
                  <span className="text-[11px] font-extrabold opacity-60">
                    @{selectedPersona.handle}
                  </span>
                  <button
                    onClick={handleCopyMockUrl}
                    className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:opacity-80 transition-opacity flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3 text-[#04c759]" />
                        <span className="text-[#04c759]">복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3" />
                        <span>공유</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 프로필 아바타 & 기본 정보 */}
                <div className="relative mt-2 mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#3182f6]/30 shadow-md">
                    <Image
                      src={selectedPersona.avatar}
                      alt={selectedPersona.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#3182f6] text-white p-1 rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="text-[17px] font-black">{selectedPersona.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3182f6]/10 text-[#3182f6]">
                    {selectedPersona.badge}
                  </span>
                </div>

                <p className={`text-[11.5px] mt-1.5 text-center leading-snug px-2 ${getThemeSubText()}`}>
                  {selectedPersona.bio}
                </p>

                {/* 실시간 통계 칩 (클릭 시 카운트 증가 재미 요소) */}
                <div
                  onClick={() => setSimulatedClicks((prev) => prev + 1)}
                  className="mt-3.5 w-full bg-black/5 dark:bg-white/10 rounded-[14px] p-2 flex items-center justify-around cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
                  title="클릭해보세요!"
                >
                  <div className="text-center">
                    <p className={`text-[9.5px] font-medium ${getThemeSubText()}`}>프로필 방문</p>
                    <p className="text-[12px] font-black">{selectedPersona.stats.views}</p>
                  </div>
                  <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10" />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <p className={`text-[9.5px] font-medium ${getThemeSubText()}`}>총 클릭수</p>
                      <span className="text-[9px] text-[#04c759] font-bold">▲</span>
                    </div>
                    <p className="text-[12px] font-black text-[#3182f6]">
                      {simulatedClicks.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10" />
                  <div className="text-center">
                    <p className={`text-[9.5px] font-medium ${getThemeSubText()}`}>클릭 전환율</p>
                    <p className="text-[12px] font-black text-[#04c759]">
                      {selectedPersona.stats.rate}
                    </p>
                  </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="mt-3.5 w-full grid grid-cols-3 gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-[12px]">
                  <button
                    onClick={() => setActivePhoneTab("links")}
                    className={`py-1 rounded-[8px] text-[11px] font-bold transition-all ${
                      activePhoneTab === "links"
                        ? "bg-white text-[#191f28] shadow-xs dark:bg-[#333d4b] dark:text-white"
                        : "opacity-60"
                    }`}
                  >
                    링크 모음
                  </button>
                  <button
                    onClick={() => setActivePhoneTab("projects")}
                    className={`py-1 rounded-[8px] text-[11px] font-bold transition-all ${
                      activePhoneTab === "projects"
                        ? "bg-white text-[#191f28] shadow-xs dark:bg-[#333d4b] dark:text-white"
                        : "opacity-60"
                    }`}
                  >
                    대표 프로젝트
                  </button>
                  <button
                    onClick={() => setActivePhoneTab("about")}
                    className={`py-1 rounded-[8px] text-[11px] font-bold transition-all ${
                      activePhoneTab === "about"
                        ? "bg-white text-[#191f28] shadow-xs dark:bg-[#333d4b] dark:text-white"
                        : "opacity-60"
                    }`}
                  >
                    소개 & 연락
                  </button>
                </div>

                {/* 탭 컨텐츠: 인터랙티브 링크 목록 */}
                <div className="mt-3 w-full flex flex-col gap-2 flex-1">
                  {activePhoneTab === "links" && (
                    <>
                      {selectedPersona.links.map((link, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleMockLinkClick(idx)}
                          className={`w-full p-2.5 rounded-[16px] border transition-all cursor-pointer flex items-center justify-between ${getThemeCardBg()} ${
                            clickedLinkIndex === idx ? "scale-[0.97] ring-2 ring-[#3182f6]" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                            <div className="w-7 h-7 rounded-[10px] bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                              {renderLinkIcon(link.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-bold truncate">
                                  {link.title}
                                </span>
                                {link.badge && (
                                  <span
                                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${link.badgeColor}`}
                                  >
                                    {link.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-[10px] truncate mt-0.5 ${getThemeSubText()}`}>
                                {link.sub}
                              </p>
                            </div>
                          </div>

                          <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                            {clickedLinkIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-[#04c759]" />
                            ) : (
                              <ArrowRight className="w-3 h-3 opacity-60" />
                            )}
                          </div>
                        </div>
                      ))}
                      {clickedLinkIndex !== null && (
                        <div className="text-center text-[10.5px] font-bold text-[#04c759] animate-bounce">
                          🎉 클릭수 집계 완료! (+1)
                        </div>
                      )}
                    </>
                  )}

                  {activePhoneTab === "projects" && (
                    <div className="w-full flex flex-col gap-2">
                      <div className={`p-3 rounded-[16px] border ${getThemeCardBg()}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold">🚀 마이링크 서비스 구축</span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#04c759] text-white">
                            완료
                          </span>
                        </div>
                        <p className={`text-[10.5px] mt-1 ${getThemeSubText()}`}>
                          Next.js 16 + React 19 기반 초고속 링크트리 플랫폼 개발
                        </p>
                      </div>
                      <div className={`p-3 rounded-[16px] border ${getThemeCardBg()}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold">⚡ 모던 UI 디자인 시스템</span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#3182f6] text-white">
                            진행중
                          </span>
                        </div>
                        <p className={`text-[10.5px] mt-1 ${getThemeSubText()}`}>
                          토스 스타일(TDS) 컴포넌트 30종 오픈소스 배포
                        </p>
                      </div>
                    </div>
                  )}

                  {activePhoneTab === "about" && (
                    <div className={`p-3.5 rounded-[18px] border text-center ${getThemeCardBg()}`}>
                      <p className="text-[12px] font-bold mb-1">언제든 연락주세요 👋</p>
                      <p className={`text-[10.5px] mb-3 ${getThemeSubText()}`}>
                        기술 공유 및 프로젝트 협업 제안을 환영합니다.
                      </p>
                      <div className="flex justify-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold">
                          TypeScript
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold">
                          Next.js
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold">
                          Tailwind
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 스마트폰 홈 인디케이터 바 */}
                <div className="w-24 h-1 bg-black/20 dark:bg-white/20 rounded-full mt-auto" />
              </div>
            </div>

            {/* 플로팅 리액션 뱃지들 */}
            <div className="hidden sm:flex absolute -left-6 top-28 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-[16px] shadow-tds-2 border border-[#e5e8eb] items-center gap-2 animate-bounce">
              <span className="text-[16px]">🔥</span>
              <div>
                <p className="text-[11px] font-bold text-[#191f28]">주간 방문자 급상승</p>
                <p className="text-[10px] font-semibold text-[#04c759]">+1,420명 (42% 증가)</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -right-6 bottom-24 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-[16px] shadow-tds-2 border border-[#e5e8eb] items-center gap-2">
              <span className="text-[16px]">⚡</span>
              <div>
                <p className="text-[11px] font-bold text-[#191f28]">실시간 인라인 편집</p>
                <p className="text-[10px] text-[#6b7684]">수정 즉시 클라우드 반영</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. 신뢰 지표 & 활성 통계 티커 (Social Proof & Metrics Strip) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-[#e5e8eb]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-[28px] sm:text-[36px] font-black text-[#191f28] tracking-tight">
                15,800<span className="text-[#3182f6]">+</span>
              </div>
              <p className="text-[13px] sm:text-[14px] text-[#6b7684] mt-1 font-semibold">
                생성된 마이링크 페이지
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-[28px] sm:text-[36px] font-black text-[#191f28] tracking-tight">
                680,000<span className="text-[#3182f6]">+</span>
              </div>
              <p className="text-[13px] sm:text-[14px] text-[#6b7684] mt-1 font-semibold">
                누적 링크 연결 수
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-[28px] sm:text-[36px] font-black text-[#191f28] tracking-tight text-[#04c759]">
                45초
              </div>
              <p className="text-[13px] sm:text-[14px] text-[#6b7684] mt-1 font-semibold">
                평균 프로필 세팅 시간
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-[28px] sm:text-[36px] font-black text-[#191f28] tracking-tight">
                99.6<span className="text-[#3182f6]">%</span>
              </div>
              <p className="text-[13px] sm:text-[14px] text-[#6b7684] mt-1 font-semibold">
                사용자 만족도 점수
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. 내 링크 주소 미리 선점해보기 (Interactive Claim Playground) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-[1140px] mx-auto w-full">
        <div className="bg-gradient-to-br from-[#1b64da] via-[#3182f6] to-[#04c759] rounded-[32px] p-8 sm:p-12 text-white shadow-tds-3 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-[700px] mx-auto text-center flex flex-col items-center">
            <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[12px] font-extrabold uppercase tracking-wider mb-4">
              Reserve Your Link
            </span>
            <h2 className="text-[26px] sm:text-[36px] font-black tracking-tight leading-snug break-keep">
              지금 원하는 마이링크 아이디를 <br className="sm:hidden" />
              미리 선점해보세요
            </h2>
            <p className="mt-3 text-[14px] sm:text-[16px] text-blue-100 font-medium max-w-[500px]">
              인스타그램 소개란, 이력서, 이메일 서명에 들어갈 나만의 단 한 줄 주소입니다.
            </p>

            {/* 주소 입력창 & 바로 시작 버튼 */}
            <div className="mt-8 w-full max-w-[560px] bg-white rounded-[22px] p-2 sm:p-2.5 shadow-xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center w-full px-3 py-2 text-[#191f28]">
                <span className="text-[15px] font-extrabold text-[#3182f6] select-none whitespace-nowrap">
                  mylink.io/@
                </span>
                <input
                  type="text"
                  value={claimInput}
                  onChange={(e) =>
                    setClaimInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                  }
                  placeholder="yourname"
                  className="w-full ml-1 text-[15px] font-bold text-[#191f28] placeholder-[#b0b8c1] bg-transparent outline-none"
                  maxLength={20}
                />
              </div>

              <button
                onClick={onSignIn}
                disabled={isSigningIn}
                className="w-full sm:w-auto h-12 px-6 rounded-[16px] bg-[#191f28] hover:bg-[#333d4b] active:scale-[0.98] text-white text-[14px] font-bold whitespace-nowrap flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer disabled:opacity-60"
              >
                <span>이 아이디로 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 실시간 피드백 뱃지 */}
            <div className="mt-3 text-[13px] font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#04c759]" />
              <span>
                {claimInput.trim() ? (
                  <>
                    <strong className="underline underline-offset-2">@{claimInput}</strong> 주소는 지금 바로 사용할 수 있어요! ✨
                  </>
                ) : (
                  "원하는 영문 아이디를 입력하고 구글 로그인으로 1초 만에 연결하세요"
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. 마이링크 벤토 그리드 특장점 (Bento Grid Features) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1140px] mx-auto w-full">
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[12px] font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>핵심 차별점</span>
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-black tracking-tight text-[#191f28] break-keep">
            복잡한 건 모두 뺐습니다. <br />
            오직 나를 돋보이게 하는 것만 남겼어요
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-[#6b7684]">
            처음 쓰는 분도 1분이면 완벽히 다루는 직관적인 경험을 약속합니다.
          </p>
        </div>

        {/* 벤토 그리드 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1: 인라인 원클릭 에디터 (대형 2열 차지) */}
          <div className="md:col-span-2 bg-white rounded-[28px] p-7 sm:p-9 shadow-tds-1 border border-[#e5e8eb] flex flex-col justify-between relative overflow-hidden group hover:border-[#3182f6]/40 transition-all">
            <div className="max-w-[480px]">
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <Pencil className="w-6 h-6" />
              </div>
              <h3 className="text-[22px] font-extrabold text-[#191f28] tracking-tight">
                관리자 페이지를 헤맬 필요 없는 실시간 인라인 편집
              </h3>
              <p className="text-[14px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
                별도의 어드민 화면으로 이동할 필요가 없습니다. 내 프로필 화면에서 텍스트나 아바타를 클릭하면 그 자리에서 즉시 수정되고, TanStack Query와 Firestore가 알아서 실시간으로 저장합니다.
              </p>
            </div>

            {/* 시각적 인라인 에디팅 시뮬레이션 UI */}
            <div className="mt-8 p-4 rounded-[18px] bg-[#f9fafb] border border-[#e5e8eb] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3182f6]/10 text-[#3182f6] flex items-center justify-center font-black">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[#191f28]">김민서</span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#e8f3ff] text-[#3182f6]">
                      클릭하여 수정
                    </span>
                  </div>
                  <p className="text-[12px] text-[#8b95a1]">프론트엔드 엔지니어</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#04c759] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  자동 저장됨
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: 실시간 분석 통계 */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 shadow-tds-1 border border-[#e5e8eb] flex flex-col justify-between group hover:border-[#3182f6]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#191f28] tracking-tight">
                실시간 링크 클릭 & 유입 통계
              </h3>
              <p className="text-[14px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
                어떤 프로젝트나 블로그 글이 가장 인기가 많은지 실시간으로 집계하고 인사이트를 제공합니다.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f2f4f6]">
              <div className="flex items-end justify-between gap-1 h-16 px-2">
                <div className="w-1/6 bg-[#e8f3ff] rounded-t-md h-[40%]" />
                <div className="w-1/6 bg-[#e8f3ff] rounded-t-md h-[60%]" />
                <div className="w-1/6 bg-[#e8f3ff] rounded-t-md h-[50%]" />
                <div className="w-1/6 bg-[#e8f3ff] rounded-t-md h-[80%]" />
                <div className="w-1/6 bg-[#3182f6] rounded-t-md h-[100%]" />
                <div className="w-1/6 bg-[#e8f3ff] rounded-t-md h-[70%]" />
              </div>
              <p className="text-[11px] font-bold text-center text-[#3182f6] mt-2">
                오늘 클릭수 +142건 기록 중 📈
              </p>
            </div>
          </div>

          {/* Bento Card 3: 톡톡 튀는 강조 배지 */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 shadow-tds-1 border border-[#e5e8eb] flex flex-col justify-between group hover:border-[#3182f6]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <Flame className="w-6 h-6 text-[#f04452]" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#191f28] tracking-tight">
                시선 강탈 커스텀 뱃지
              </h3>
              <p className="text-[14px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
                HOT, NEW, 추천, 채용중 등 나만의 상태를 톡톡 튀는 배지로 강조하여 클릭률을 극대화합니다.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-[#f2f4f6]">
              <span className="px-2.5 py-1 rounded-full bg-[#f04452] text-white text-[11px] font-black">
                🔥 HOT
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#3182f6] text-white text-[11px] font-black">
                ✨ NEW
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#04c759] text-white text-[11px] font-black">
                👍 추천
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#8b5cf6] text-white text-[11px] font-black">
                💼 채용중
              </span>
            </div>
          </div>

          {/* Bento Card 4: 완벽한 모바일 & PC 반응형 */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 shadow-tds-1 border border-[#e5e8eb] flex flex-col justify-between group hover:border-[#3182f6]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#191f28] tracking-tight">
                모든 디바이스 완벽 최적화
              </h3>
              <p className="text-[14px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
                모바일 환경의 엄지손가락 한 손 터치부터 와이드 데스크톱의 듀얼 카드 레이아웃까지 자연스럽게 적응합니다.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f2f4f6] flex items-center justify-around text-[#6b7684] text-[12px] font-bold">
              <span>📱 스마트폰</span>
              <span>•</span>
              <span>💻 노트북/PC</span>
              <span>•</span>
              <span>📋 태블릿</span>
            </div>
          </div>

          {/* Bento Card 5: 안전한 Firestore 보안 격리 */}
          <div className="bg-white rounded-[28px] p-7 sm:p-8 shadow-tds-1 border border-[#e5e8eb] flex flex-col justify-between group hover:border-[#3182f6]/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#04c759] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#191f28] tracking-tight">
                Google UID 기반 보안 격리
              </h3>
              <p className="text-[14px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
                Firebase Firestore 보안 규칙을 통해 계정별 데이터를 완벽히 격리하여 다른 사용자가 내 링크를 변조할 수 없습니다.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f2f4f6] text-[12px] font-bold text-[#04c759] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>클라우드 자동 백업 및 무결성 보장</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. 추천 페르소나 쇼케이스 (Who is MyLink for?) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="personas" className="py-16 sm:py-20 px-4 sm:px-6 max-w-[1140px] mx-auto w-full">
        <div className="text-center max-w-[620px] mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[12px] font-bold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>맞춤형 프로필 둘러보기</span>
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-[#191f28] break-keep">
            어떤 분야에서든 <br />
            나만의 스타일을 확실하게 표현하세요
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[#6b7684]">
            클릭하여 개발자, 디자이너, 크리에이터들의 프로필 구성을 미리 체험해보세요.
          </p>
        </div>

        {/* 페르소나 탭 선택 바 */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p)}
              className={`px-5 py-2.5 rounded-[16px] text-[14px] font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                selectedPersona.id === p.id
                  ? "bg-[#191f28] text-white border-[#191f28] shadow-md shadow-black/10 scale-105"
                  : "bg-white text-[#4e5968] border-[#e5e8eb] hover:bg-[#f9fafb]"
              }`}
            >
              <span>{p.role}</span>
              {selectedPersona.id === p.id && (
                <span className="w-2 h-2 rounded-full bg-[#04c759]" />
              )}
            </button>
          ))}
        </div>

        {/* 선택된 페르소나 상세 카드 (반응형 2분할) */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-tds-2 border border-[#e5e8eb]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 좌측 정보 (5열) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#3182f6]/20 shadow-md mb-4">
                <Image
                  src={selectedPersona.avatar}
                  alt={selectedPersona.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-[22px] font-black text-[#191f28]">
                  {selectedPersona.name}
                </h3>
                <span className="text-[12px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#e8f3ff] text-[#3182f6]">
                  {selectedPersona.badge}
                </span>
              </div>
              <p className="text-[13px] font-bold text-[#8b95a1] mt-0.5">
                @{selectedPersona.handle}
              </p>

              <p className="mt-4 text-[14px] text-[#4e5968] leading-relaxed break-keep font-medium">
                {selectedPersona.bio}
              </p>

              {/* 통계 요약 */}
              <div className="mt-6 w-full grid grid-cols-3 gap-2 bg-[#f9fafb] p-3 rounded-[18px] border border-[#e5e8eb] text-center">
                <div>
                  <p className="text-[11px] text-[#8b95a1] font-semibold">총 조회수</p>
                  <p className="text-[15px] font-black text-[#191f28]">{selectedPersona.stats.views}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8b95a1] font-semibold">링크 클릭</p>
                  <p className="text-[15px] font-black text-[#3182f6]">{selectedPersona.stats.clicks}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8b95a1] font-semibold">전환율</p>
                  <p className="text-[15px] font-black text-[#04c759]">{selectedPersona.stats.rate}</p>
                </div>
              </div>

              <button
                onClick={onSignIn}
                className="mt-6 w-full h-12 rounded-[14px] bg-[#3182f6] hover:bg-[#1b64da] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>이런 스타일로 내 프로필 만들기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 우측 링크 목록 프리뷰 (7열) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2f4f6]">
                <span className="text-[13px] font-bold text-[#6b7684]">
                  실제 등록된 링크 목록 ({selectedPersona.links.length}개)
                </span>
                <span className="text-[11px] font-bold text-[#3182f6]">
                  원클릭 이동 지원
                </span>
              </div>

              {selectedPersona.links.map((link, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[20px] bg-[#f9fafb] hover:bg-[#f2f4f6] border border-[#e5e8eb] flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                    <div className="w-10 h-10 rounded-[14px] bg-white border border-[#e5e8eb] flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#3182f6]/40 transition-colors">
                      {renderLinkIcon(link.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-extrabold text-[#191f28] truncate group-hover:text-[#3182f6] transition-colors">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${link.badgeColor}`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6b7684] mt-0.5 truncate font-medium">
                        {link.sub}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-[10px] bg-white border border-[#e5e8eb] flex items-center justify-center text-[#8b95a1] group-hover:text-[#3182f6] group-hover:border-[#3182f6] shrink-0 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. 간편한 3단계 시작 가이드 (How it works) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 max-w-[1140px] mx-auto w-full">
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[12px] font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>초간단 프로세스</span>
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight text-[#191f28]">
            단 3단계면 모든 준비가 끝납니다
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[#6b7684]">
            회원가입 폼을 채울 필요도, 코딩을 알 필요도 전혀 없습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-[26px] p-7 shadow-tds-1 border border-[#e5e8eb] flex flex-col relative">
            <div className="w-10 h-10 rounded-full bg-[#3182f6] text-white flex items-center justify-center text-[16px] font-black mb-5 shadow-sm">
              1
            </div>
            <h3 className="text-[18px] font-extrabold text-[#191f28]">
              Google 계정으로 1초 로그인
            </h3>
            <p className="text-[13.5px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
              복잡한 인증 없이 기존 Google 아이디로 클릭 한 번에 시작하세요. 즉시 나만의 독립된 저장소가 안전하게 할당됩니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[26px] p-7 shadow-tds-1 border border-[#e5e8eb] flex flex-col relative">
            <div className="w-10 h-10 rounded-full bg-[#3182f6] text-white flex items-center justify-center text-[16px] font-black mb-5 shadow-sm">
              2
            </div>
            <h3 className="text-[18px] font-extrabold text-[#191f28]">
              링크와 대표 프로젝트 담기
            </h3>
            <p className="text-[13.5px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
              GitHub, 블로그, SNS 링크를 추가하고 원하는 태그(HOT, 추천)를 붙이세요. 내 소개글과 아바타도 자유롭게 바꿀 수 있습니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[26px] p-7 shadow-tds-1 border border-[#e5e8eb] flex flex-col relative">
            <div className="w-10 h-10 rounded-full bg-[#04c759] text-white flex items-center justify-center text-[16px] font-black mb-5 shadow-sm">
              3
            </div>
            <h3 className="text-[18px] font-extrabold text-[#191f28]">
              나만의 URL 복사해서 공유하기
            </h3>
            <p className="text-[13.5px] text-[#6b7684] mt-2.5 leading-relaxed break-keep font-medium">
              완성된 주소를 인스타그램 바이오, 이력서, 깃허브 README, 이메일 서명에 넣어 세상에 나를 연결하세요.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. 자주 묻는 질문 아코디언 (FAQ Section) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 max-w-[800px] mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[12px] font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>궁금한 점이 있으신가요?</span>
          </div>
          <h2 className="text-[28px] sm:text-[34px] font-black tracking-tight text-[#191f28]">
            자주 묻는 질문
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-[#e5e8eb] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f9fafb] transition-colors"
                >
                  <span className="text-[15px] sm:text-[16px] font-extrabold text-[#191f28]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#6b7684] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 bg-[#e8f3ff] text-[#3182f6]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-[14px] text-[#4e5968] leading-relaxed border-t border-[#f2f4f6] font-medium break-keep">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. 하단 최종 전환 CTA 배너 (Bottom CTA) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1140px] mx-auto w-full">
        <div className="bg-[#191f28] rounded-[36px] p-8 sm:p-14 text-white text-center flex flex-col items-center relative overflow-hidden shadow-tds-3">
          {/* 블루 그라디언트 오버레이 */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3182f6]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-[12px] font-bold mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#3182f6]" />
            <span>평생 무료 · 1초 구글 로그인</span>
          </div>

          <h2 className="text-[30px] sm:text-[44px] font-black tracking-tight leading-[1.25] break-keep max-w-[700px]">
            나를 표현하는 가장 스마트한 방법, <br />
            지금 <span className="text-[#3182f6]">MyLink</span>에서 시작하세요
          </h2>

          <p className="mt-4 text-[15px] sm:text-[17px] text-[#8b95a1] max-w-[540px] leading-relaxed font-medium break-keep">
            흩어져 있는 내 작업과 소셜 채널을 단 하나의 감각적인 링크로 모아보세요.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={onSignIn}
              disabled={isSigningIn}
              className="w-full sm:w-auto h-14 px-9 rounded-[18px] bg-[#3182f6] hover:bg-[#1b64da] active:scale-[0.98] text-white text-[16px] font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#3182f6]/30 transition-all cursor-pointer group disabled:opacity-60"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5 brightness-0 invert" />
              )}
              <span>{isSigningIn ? "로그인 중…" : "Google 계정으로 시작하기"}</span>
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <p className="mt-4 text-[12px] text-[#6b7684]">
            가입비 0원 · 신용카드 불필요 · 광고 없음
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 푸터 (Footer) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-10 px-4 sm:px-6 text-[13px] text-[#8b95a1] border-t border-[#e5e8eb] bg-[#f9fafb]">
        <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[9px] bg-[#3182f6] flex items-center justify-center text-white text-[13px] font-black">
              M
            </div>
            <span className="font-extrabold text-[#191f28] text-[15px]">MyLink</span>
            <span className="text-[12px] text-[#8b95a1]">| 개인 맞춤형 링크트리 플랫폼</span>
          </div>

          <p className="text-[12px] text-[#8b95a1]">
            © {new Date().getFullYear()} MyLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
