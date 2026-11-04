"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  MousePointerClick,
  Layers,
  Award,
  TrendingUp,
  ExternalLink,
  Share2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useLinkquery } from "@/hooks/useLinks";
import { useProfileQuery } from "@/hooks/useProfile";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PROFILE_DATA } from "@/data/profile";

// 차트 색상 팔레트 (TDS 친화적 색상)
const CHART_COLORS = [
  "#3182f6", // 토스 블루
  "#04c759", // 그린
  "#f04452", // 레드
  "#ff9e00", // 오렌지
  "#8e44ad", // 퍼플
  "#00b4d8", // 스카이
  "#6b7684", // 그레이
];

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  // 비로그인 시 홈("/")으로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  // 프로필 & 링크 목록 조회
  const { data: profile } = useProfileQuery(user);
  const { data: rawLinks = [], isLoading: linksLoading } = useLinkquery(user?.uid);

  const currentDisplayName =
    profile?.displayName || user?.displayName || PROFILE_DATA.name;
  const currentAvatar =
    profile?.photoURL || user?.photoURL || PROFILE_DATA.avatarImage;
  const currentEmail = profile?.email || user?.email || PROFILE_DATA.email;

  // header 타입을 제외한 실제 클릭 가능한 링크 목록
  const clickableLinks = useMemo(() => {
    return rawLinks.filter((l) => l.type !== "header");
  }, [rawLinks]);

  // 총 클릭수 (모든 링크 합산)
  const totalClicks = useMemo(() => {
    return clickableLinks.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  }, [clickableLinks]);

  // 최다 클릭 링크 (TOP 링크)
  const sortedByClicks = useMemo(() => {
    return [...clickableLinks].sort(
      (a, b) => (b.clickCount || 0) - (a.clickCount || 0)
    );
  }, [clickableLinks]);

  const topLink = sortedByClicks[0];
  const topClicks = topLink?.clickCount || 0;

  // 평균 클릭수
  const avgClicks = useMemo(() => {
    if (clickableLinks.length === 0) return 0;
    return (totalClicks / clickableLinks.length).toFixed(1);
  }, [totalClicks, clickableLinks]);

  // 막대 차트 데이터 (클릭수 내림차순 상위 8개)
  const barChartData = useMemo(() => {
    return sortedByClicks.slice(0, 8).map((link, idx) => ({
      name:
        link.title.length > 10
          ? `${link.title.slice(0, 10)}…`
          : link.title,
      fullTitle: link.title,
      clicks: link.clickCount || 0,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }));
  }, [sortedByClicks]);

  // shadcn ChartConfig
  const barChartConfig: ChartConfig = {
    clicks: {
      label: "클릭 수",
      color: "#3182f6",
    },
  };

  // 파이/도넛 차트 데이터 (상위 5개 + 기타)
  const donutChartData = useMemo(() => {
    if (totalClicks === 0) return [];

    const top5 = sortedByClicks.slice(0, 5);
    const otherClicks = sortedByClicks
      .slice(5)
      .reduce((sum, l) => sum + (l.clickCount || 0), 0);

    const data = top5
      .filter((l) => (l.clickCount || 0) > 0)
      .map((link, idx) => ({
        name: link.title,
        value: link.clickCount || 0,
        fill: CHART_COLORS[idx % CHART_COLORS.length],
      }));

    if (otherClicks > 0) {
      data.push({
        name: "기타 링크",
        value: otherClicks,
        fill: "#b0b8c1",
      });
    }

    return data;
  }, [sortedByClicks, totalClicks]);

  const donutChartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      clicks: {
        label: "클릭 수",
      },
    };
    donutChartData.forEach((item, idx) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });
    return config;
  }, [donutChartData]);

  // 공유 링크 복사 핸들러
  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/${encodeURIComponent(
        currentDisplayName
      )}`;
      navigator.clipboard.writeText(shareUrl);
      alert("개인 프로필 링크를 복사했어요!");
    }
  };

  // 1. 인증 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-[20px] bg-white shadow-tds-1 flex items-center justify-center border border-[#e5e8eb] mb-4">
          <div className="w-6 h-6 border-3 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[14px] font-bold text-[#191f28]">
          통계 데이터를 준비하는 중…
        </p>
        <p className="text-[12px] text-[#8b95a1] mt-1">잠시만 기다려 주세요</p>
      </div>
    );
  }

  // 2. 비로그인 상태 (리다이렉트 처리 중)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#f04452] flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-[15px] font-bold text-[#191f28]">
          로그인이 필요한 페이지입니다
        </p>
        <p className="text-[12px] text-[#8b95a1] mt-1 mb-4">
          메인 화면으로 이동합니다…
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-[12px] bg-[#3182f6] text-white text-[13px] font-bold"
        >
          메인으로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28]">
      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between border-b border-[#e5e8eb]/60 lg:max-w-[1024px] lg:mx-auto lg:w-full lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:px-8 lg:pt-6 lg:pb-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-[#4e5968] hover:bg-[#e5e8eb] active:bg-[#d1d6db] transition-colors bg-white shadow-2xs border border-[#e5e8eb]/60"
            title="에디터 홈으로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[17px] sm:text-[18px] font-bold text-[#191f28]">
              통계 대시보드
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[8px] bg-[#e8f3ff] text-[#3182f6] text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              실시간 분석
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 프로필 드롭다운 */}
          <ProfileDropdown
            displayName={currentDisplayName}
            email={currentEmail}
            photoURL={currentAvatar}
            onSignOut={signOut}
          />

          {/* 공유 버튼 */}
          <button
            onClick={handleShareProfile}
            aria-label="프로필 링크 복사"
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#4e5968] hover:bg-[#e5e8eb] active:bg-[#d1d6db] transition-colors cursor-pointer bg-white shadow-2xs shrink-0 border border-[#e5e8eb]/60"
            title="내 마이링크 주소 복사"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 메인 통계 콘텐츠 */}
      <main className="w-full max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6">
        
        {/* 헤더 안내 영역 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#191f28] tracking-tight">
              {currentDisplayName}님의 링크 성과
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#8b95a1] mt-0.5">
              방문자들이 관심을 보인 링크와 실시간 클릭 추이를 한눈에 확인하세요.
            </p>
          </div>
          <Link
            href={`/${encodeURIComponent(currentDisplayName)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 rounded-[12px] bg-white border border-[#e5e8eb] text-[13px] font-bold text-[#3182f6] hover:bg-[#e8f3ff] hover:border-[#3182f6]/30 transition-all shadow-2xs group"
          >
            <span>내 마이링크 열기</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── [핵심 요구사항] 총 클릭수 및 주요 지표 요약 카드 (Stat Cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* 1. 총 클릭수 (가장 중요하게 강조) */}
          <Card className="border-2 border-[#3182f6]/20 bg-gradient-to-br from-white to-[#f4f8ff] shadow-tds-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#3182f6]/5 rounded-bl-full pointer-events-none" />
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px] font-bold text-[#3182f6]">
                  총 클릭수 (모든 링크 합산)
                </CardDescription>
                <div className="w-8 h-8 rounded-[10px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-[28px] sm:text-[32px] font-extrabold text-[#191f28] mt-1 tracking-tight">
                {linksLoading ? "…" : totalClicks.toLocaleString()}
                <span className="text-[18px] sm:text-[20px] font-bold text-[#4e5968] ml-1">
                  회
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[11px] text-[#8b95a1]">
                등록된 전체 {clickableLinks.length}개 링크 누적치
              </p>
            </CardContent>
          </Card>

          {/* 2. 최다 클릭 링크 */}
          <Card className="bg-white shadow-tds-1">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px] font-semibold text-[#6b7684]">
                  최고 인기 링크
                </CardDescription>
                <div className="w-8 h-8 rounded-[10px] bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-[20px] sm:text-[22px] font-bold text-[#191f28] mt-1 truncate">
                {linksLoading ? "…" : topLink ? topLink.title : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[11px] text-[#8b95a1] truncate">
                {topClicks > 0
                  ? `누적 ${topClicks.toLocaleString()}회 클릭 달성`
                  : "아직 클릭 기록이 없습니다"}
              </p>
            </CardContent>
          </Card>

          {/* 3. 링크당 평균 클릭수 */}
          <Card className="bg-white shadow-tds-1">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px] font-semibold text-[#6b7684]">
                  평균 링크 클릭
                </CardDescription>
                <div className="w-8 h-8 rounded-[10px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-[28px] sm:text-[32px] font-extrabold text-[#191f28] mt-1 tracking-tight">
                {linksLoading ? "…" : avgClicks}
                <span className="text-[18px] sm:text-[20px] font-bold text-[#4e5968] ml-1">
                  회
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[11px] text-[#8b95a1]">
                링크 1개당 평균 방문 빈도
              </p>
            </CardContent>
          </Card>

          {/* 4. 활성 링크 수 */}
          <Card className="bg-white shadow-tds-1">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[13px] font-semibold text-[#6b7684]">
                  운영 중인 링크
                </CardDescription>
                <div className="w-8 h-8 rounded-[10px] bg-slate-100 text-[#4e5968] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <CardTitle className="text-[28px] sm:text-[32px] font-extrabold text-[#191f28] mt-1 tracking-tight">
                {linksLoading
                  ? "…"
                  : clickableLinks.filter((l) => l.isActive).length}
                <span className="text-[18px] sm:text-[20px] font-bold text-[#4e5968] ml-1">
                  개
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-[11px] text-[#8b95a1]">
                전체 {rawLinks.length}개 항목 중 공개 중
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── [shadcn 차트 컴포넌트 섹션] ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 바 차트: 링크별 클릭수 비교 (2열 차지) */}
          <Card className="lg:col-span-2 bg-white shadow-tds-1">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[17px] font-bold text-[#191f28]">
                    링크별 누적 클릭수 비교
                  </CardTitle>
                  <CardDescription className="text-[12px] text-[#8b95a1] mt-0.5">
                    방문자 반응이 가장 높은 상위 링크 현황
                  </CardDescription>
                </div>
                <span className="text-[11px] font-semibold text-[#3182f6] px-2 py-0.5 bg-[#e8f3ff] rounded-md">
                  TOP 8
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              {clickableLinks.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <Layers className="w-8 h-8 text-[#b0b8c1] mb-2" />
                  <p className="text-[14px] font-semibold text-[#4e5968]">
                    등록된 링크가 없습니다
                  </p>
                  <p className="text-[12px] text-[#8b95a1] mt-0.5">
                    마이링크 편집기에서 새 링크를 추가해 보세요.
                  </p>
                </div>
              ) : totalClicks === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <MousePointerClick className="w-8 h-8 text-[#3182f6] mb-2 animate-bounce" />
                  <p className="text-[14px] font-bold text-[#191f28]">
                    아직 클릭 데이터가 없습니다
                  </p>
                  <p className="text-[12px] text-[#8b95a1] mt-0.5 mb-3">
                    프로필 링크를 SNS에 공유하고 첫 번째 클릭을 받아보세요!
                  </p>
                  <button
                    onClick={handleShareProfile}
                    className="px-3 py-1.5 rounded-[10px] bg-[#e8f3ff] text-[#3182f6] text-[12px] font-bold hover:bg-[#d9ecff] transition-colors"
                  >
                    내 프로필 링크 복사
                  </button>
                </div>
              ) : (
                <ChartContainer
                  config={barChartConfig}
                  className="w-full aspect-[16/9] max-h-[300px]"
                >
                  <BarChart
                    data={barChartData}
                    margin={{ top: 12, right: 12, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="#f2f4f6"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={{ stroke: "#e5e8eb" }}
                      tickMargin={8}
                      fontSize={11}
                      tick={{ fill: "#6b7684" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={11}
                      tick={{ fill: "#8b95a1" }}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(49, 130, 246, 0.06)" }}
                      content={
                        <ChartTooltipContent
                          labelKey="fullTitle"
                          formatter={(value) => (
                            <span className="font-bold text-[#3182f6]">
                              {Number(value).toLocaleString()}회 클릭
                            </span>
                          )}
                        />
                      }
                    />
                    <Bar
                      dataKey="clicks"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* 도넛 차트: 링크 클릭 점유율 (1열 차지) */}
          <Card className="bg-white shadow-tds-1 flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[17px] font-bold text-[#191f28]">
                클릭 점유율
              </CardTitle>
              <CardDescription className="text-[12px] text-[#8b95a1] mt-0.5">
                전체 클릭 대비 링크별 비율
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 flex-1 flex flex-col items-center justify-center">
              {totalClicks === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#e5e8eb] flex items-center justify-center mb-2">
                    <span className="text-[12px] text-[#8b95a1] font-bold">0%</span>
                  </div>
                  <p className="text-[13px] text-[#8b95a1]">
                    클릭 발생 시 점유율이 표시됩니다
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <ChartContainer
                    config={donutChartConfig}
                    className="aspect-square max-h-[220px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => (
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold">{name}:</span>
                                <span className="font-bold text-[#3182f6]">
                                  {Number(value).toLocaleString()}회 (
                                  {((Number(value) / totalClicks) * 100).toFixed(
                                    1
                                  )}
                                  %)
                                </span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Pie
                        data={donutChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {donutChartData.map((entry, index) => (
                          <Cell
                            key={`donut-cell-${index}`}
                            fill={entry.fill}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  {/* 점유율 상위 범례 리스트 */}
                  <div className="w-full mt-3 space-y-1.5">
                    {donutChartData.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[12px]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="truncate text-[#4e5968] font-medium">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-bold text-[#191f28] shrink-0 ml-2">
                          {((item.value / totalClicks) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── [상세 데이터 테이블 섹션] 링크별 클릭 통계 순위표 ── */}
        <Card className="bg-white shadow-tds-1">
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[17px] font-bold text-[#191f28]">
                  전체 링크 클릭 순위
                </CardTitle>
                <CardDescription className="text-[12px] text-[#8b95a1] mt-0.5">
                  각 링크의 누적 클릭수와 전체 대비 점유율 상세 내역
                </CardDescription>
              </div>
              <span className="text-[12px] font-semibold text-[#8b95a1]">
                총 {clickableLinks.length}개 링크
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {clickableLinks.length === 0 ? (
              <div className="py-12 text-center text-[#8b95a1] text-[13px]">
                등록된 링크가 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-[#f2f4f6] overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-[11px] font-semibold text-[#8b95a1] border-b border-[#f2f4f6]">
                      <th className="py-2.5 px-3 w-12 text-center">순위</th>
                      <th className="py-2.5 px-3">링크 제목</th>
                      <th className="py-2.5 px-3 hidden sm:table-cell">URL</th>
                      <th className="py-2.5 px-3 text-right">클릭수</th>
                      <th className="py-2.5 px-3 text-right w-24">점유율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f4f6]">
                    {sortedByClicks.map((link, idx) => {
                      const clicks = link.clickCount || 0;
                      const percentage =
                        totalClicks > 0
                          ? ((clicks / totalClicks) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <tr
                          key={link.id}
                          className="hover:bg-[#f9fafb] transition-colors"
                        >
                          <td className="py-3 px-3 text-center">
                            {idx === 0 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                                1
                              </span>
                            ) : idx === 1 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                                2
                              </span>
                            ) : idx === 2 ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold">
                                3
                              </span>
                            ) : (
                              <span className="text-[12px] font-medium text-[#8b95a1]">
                                {idx + 1}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#191f28] flex items-center gap-1.5">
                              <span className="truncate max-w-[160px] sm:max-w-[240px]">
                                {link.title}
                              </span>
                              {link.type === "highlight" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e8f3ff] text-[#3182f6]">
                                  강조
                                </span>
                              )}
                              {!link.isActive && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#f2f4f6] text-[#8b95a1]">
                                  비활성
                                </span>
                              )}
                            </div>
                            {link.subtitle && (
                              <p className="text-[11px] text-[#8b95a1] truncate max-w-[200px]">
                                {link.subtitle}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 hidden sm:table-cell">
                            {link.url ? (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[12px] text-[#8b95a1] hover:text-[#3182f6] truncate max-w-[200px] block transition-colors"
                              >
                                {link.url}
                              </a>
                            ) : (
                              <span className="text-[11px] text-[#b0b8c1]">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="font-bold text-[#191f28]">
                              {clicks.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-[#8b95a1] ml-0.5">
                              회
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-12 h-1.5 bg-[#f2f4f6] rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="h-full bg-[#3182f6] rounded-full"
                                  style={{ width: `${Math.min(100, Number(percentage))}%` }}
                                />
                              </div>
                              <span className="font-medium text-[#4e5968] text-[12px] tabular-nums">
                                {percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
