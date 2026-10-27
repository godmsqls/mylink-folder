"use client";

import Image from "next/image";
import {
  Sparkles,
  Link2,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { GoogleIcon, GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";
import { PROFILE_DATA } from "@/data/profile";

interface LandingPageProps {
  onSignIn: () => void;
  isSigningIn?: boolean;
}

export function LandingPage({ onSignIn, isSigningIn = false }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28] flex flex-col selection:bg-[#3182f6] selection:text-white">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 상단 네비게이션 헤더 (TDS TopBar) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-md px-5 border-b border-[#e5e8eb]/70">
        <div className="max-w-[1080px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[11px] bg-[#3182f6] flex items-center justify-center text-white text-[15px] font-black shadow-sm">
              M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] font-extrabold tracking-tight text-[#191f28]">
                MyLink
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e8f3ff] text-[#3182f6]">
                마이링크
              </span>
            </div>
          </div>

          <button
            onClick={onSignIn}
            disabled={isSigningIn}
            className="h-10 px-4 rounded-[12px] bg-white border border-[#e5e8eb] hover:bg-[#f2f4f6] active:bg-[#e5e8eb] text-[#191f28] text-[13px] font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Google로 로그인</span>
          </button>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. 히어로 섹션 (Hero Section) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 px-5 max-w-[1080px] mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-[760px] mx-auto">
          {/* 상단 뱃지 */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-full bg-[#e8f3ff] text-[#3182f6] text-[13px] font-bold mb-6 animate-tds-fade">
            <Sparkles className="w-3.5 h-3.5" />
            <span>개인 맞춤형 링크트리 & 포트폴리오</span>
          </div>

          {/* 메인 헤드라인 */}
          <h1 className="text-[34px] sm:text-[50px] font-extrabold tracking-tight text-[#191f28] leading-[1.25] break-keep">
            나의 모든 링크와 프로젝트를 <br />
            <span className="text-[#3182f6]">하나의 감각적인 페이지</span>에
          </h1>

          {/* 서브 설명 문구 */}
          <p className="mt-5 text-[16px] sm:text-[18px] text-[#4e5968] leading-relaxed max-w-[620px] break-keep">
            흩어져 있던 소셜 채널, 블로그, 포트폴리오를 가장 직관적으로 보여주세요.
            Google 계정으로 로그인하면 나만의 개인 프로필과 실시간 링크 관리 페이지를 바로 이용할 수 있어요.
          </p>

          {/* 메인 CTA 버튼 */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onSignIn}
              disabled={isSigningIn}
              className="w-full sm:w-auto h-13 px-8 rounded-[16px] bg-[#3182f6] hover:bg-[#1b64da] active:scale-[0.99] text-white text-[16px] font-bold flex items-center justify-center gap-2.5 shadow-tds-2 transition-all cursor-pointer"
            >
              <GoogleIcon className="w-4.5 h-4.5 brightness-0 invert" />
              <span>Google로 시작하기</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          {/* 로그인 안내 서브 텍스트 */}
          <p className="mt-3 text-[12px] text-[#8b95a1] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3182f6]" />
            <span>별도 회원가입 없이 Google 계정으로 1초 만에 안전하게 시작</span>
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 로그인 후 사용할 수 있는 기능 소개 (Feature Cards) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-5 max-w-[1080px] mx-auto w-full">
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <h2 className="text-[26px] sm:text-[34px] font-bold tracking-tight text-[#191f28]">
            로그인하면 어떤 기능을 <br className="sm:hidden" />
            이용할 수 있나요?
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[#6b7684]">
            MyLink는 누구나 쉽고 직관적으로 관리할 수 있는 개인 링크 환경을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 기능 1 */}
          <div className="bg-white p-7 rounded-[24px] shadow-tds-1 border border-[#e5e8eb]/70 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-[#191f28]">
                나만의 독립된 클라우드 저장소
              </h3>
              <p className="text-[13px] text-[#6b7684] mt-2.5 leading-relaxed break-keep">
                Google 계정의 UID를 기반으로 Firestore 개인 경로에 데이터를 저장하여 타인과 섞이지 않고 안전하게 관리됩니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f2f4f6] text-[12px] font-bold text-[#3182f6] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>실시간 동기화 지원</span>
            </div>
          </div>

          {/* 기능 2 */}
          <div className="bg-white p-7 rounded-[24px] shadow-tds-1 border border-[#e5e8eb]/70 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-[#191f28]">
                무제한 링크 추가 & 실시간 편집
              </h3>
              <p className="text-[13px] text-[#6b7684] mt-2.5 leading-relaxed break-keep">
                일반 링크, 강조 배지 링크(HOT, NEW, 추천), 카테고리 헤더까지 원하는 만큼 등록하고, 인라인 에디터로 언제든 내용을 바로 수정할 수 있어요.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f2f4f6] text-[12px] font-bold text-[#3182f6] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>원클릭 추가/수정/삭제</span>
            </div>
          </div>

          {/* 기능 3 */}
          <div className="bg-white p-7 rounded-[24px] shadow-tds-1 border border-[#e5e8eb]/70 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-[16px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-[#191f28]">
                포트폴리오 & 프로젝트 통합 전시
              </h3>
              <p className="text-[13px] text-[#6b7684] mt-2.5 leading-relaxed break-keep">
                단순 링크 나열을 넘어 대표 프로젝트와 기술 스택까지 탭을 전환하며 체계적으로 정리하여 채용 담당자와 방문자에게 어필할 수 있습니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f2f4f6] text-[12px] font-bold text-[#3182f6] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>반응형 2단 분할 뷰</span>
            </div>
          </div>
        </div>
      </section>

      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 푸터 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 text-center text-[12px] text-[#8b95a1] border-t border-[#e5e8eb] bg-[#f9fafb]">
        <p className="font-medium text-[#4e5968]">© {new Date().getFullYear()} MyLink. All rights reserved.</p>
        <p className="text-[11px] text-[#b0b8c1] mt-1">모던 링크트리 플랫폼</p>
      </footer>
    </div>
  );
}
