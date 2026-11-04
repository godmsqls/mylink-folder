import { ImageResponse } from "next/og";
import {
  getUserIdByDisplayName,
  getUserProfile,
  fetchLinks,
} from "@/lib/firestore";
import { PROFILE_DATA } from "@/data/profile";

export const runtime = "nodejs";
export const alt = "MyLink 개인 프로필";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const resolved = await params;
  const rawDisplayName = resolved?.displayName || "";
  const decodedDisplayName = decodeURIComponent(rawDisplayName).trim() || "User";

  // 기본값 설정 (Firestore 실패 시 안전한 Fallback)
  let name = decodedDisplayName;
  let username = decodedDisplayName.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  let bio = "나의 모든 링크와 프로젝트를 하나의 감각적인 페이지에";
  let photoURL = "";
  let linkCount = 3;
  let linkTitles = ["GitHub", "기술 블로그", "포트폴리오"];

  try {
    const userId = await getUserIdByDisplayName(decodedDisplayName);
    if (userId) {
      const [profile, links] = await Promise.all([
        getUserProfile(userId),
        fetchLinks(userId),
      ]);

      if (profile) {
        if (profile.displayName) name = profile.displayName;
        if (profile.username) username = profile.username;
        if (profile.bio) bio = profile.bio;
        if (profile.photoURL) photoURL = profile.photoURL;
      }

      if (links && links.length > 0) {
        linkCount = links.length;
        const activeLinks = links.filter(
          (l) => l.isActive && l.type !== "header"
        );
        if (activeLinks.length > 0) {
          linkTitles = activeLinks.slice(0, 3).map((l) => l.title);
        }
      }
    } else if (
      decodedDisplayName === PROFILE_DATA.name ||
      decodedDisplayName.toLowerCase() === "eunbin"
    ) {
      // 기본 데모 프로필 데이터 대응
      name = PROFILE_DATA.name;
      bio = PROFILE_DATA.bio;
      photoURL = PROFILE_DATA.avatarImage;
      linkCount = PROFILE_DATA.links.length;
      linkTitles = ["GitHub", "Velog", "LinkedIn"];
    }
  } catch (e) {
    console.warn("OG image Firestore fetch error:", e);
  }

  // 글자 수 제한
  const displayBio = bio.length > 60 ? bio.slice(0, 58) + "…" : bio;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          background: "#ffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Segoe UI", sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 상단 장식 그라디언트 바 (TDS Blue & Mint Point) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background:
              "linear-gradient(90deg, #1b64da 0%, #3182f6 50%, #04c759 100%)",
            display: "flex",
          }}
        />

        {/* 배경 은은한 소프트 글로우 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -60,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: "rgba(49, 130, 246, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: 240,
            background: "rgba(4, 199, 89, 0.05)",
            display: "flex",
          }}
        />

        {/* ── 좌측 영역 (700px): 프로필 상세 & 링크 칩들 ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 50px 60px 72px",
            zIndex: 10,
          }}
        >
          {/* 상단 로고 & 브랜딩 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background:
                  "linear-gradient(135deg, #1b64da 0%, #3182f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 900,
                boxShadow: "0 6px 16px rgba(49, 130, 246, 0.28)",
              }}
            >
              M
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#191f28",
                  letterSpacing: -0.5,
                }}
              >
                MyLink
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#3182f6",
                  background: "#e8f3ff",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                마이링크 프로필
              </span>
            </div>
          </div>

          {/* 중앙 사용자 정보 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            {/* 이름 */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  color: "#191f28",
                  letterSpacing: -1.5,
                  lineHeight: 1.15,
                }}
              >
                {name}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: "#3182f6",
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 900,
                  marginTop: 6,
                }}
              >
                ✓
              </div>
            </div>

            {/* 사용자명 (@username) */}
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#3182f6",
                marginTop: -4,
              }}
            >
              @{username}
            </span>

            {/* 소개글 (Bio) */}
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "#4e5968",
                lineHeight: 1.5,
                marginTop: 6,
                maxWidth: 580,
              }}
            >
              {displayBio}
            </p>

            {/* 주요 링크 칩 목록 */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 14,
              }}
            >
              {linkTitles.map((title, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 14,
                    background: "#f2f4f6",
                    border: "1px solid #e5e8eb",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#333d4b",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: i === 0 ? "#3182f6" : "#8b95a1",
                      display: "flex",
                    }}
                  />
                  <span>{title}</span>
                </div>
              ))}
              {linkCount > 3 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 14px",
                    borderRadius: 14,
                    background: "#e8f3ff",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#3182f6",
                  }}
                >
                  +{linkCount - 3}개 더보기
                </div>
              )}
            </div>
          </div>

          {/* 하단 URL 안내 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 15,
              fontWeight: 700,
              color: "#8b95a1",
            }}
          >
            <span>🔗</span>
            <span style={{ color: "#3182f6" }}>mylink.io/{decodedDisplayName}</span>
            <span>·</span>
            <span>지금 방문하여 더 많은 링크 확인하기</span>
          </div>
        </div>

        {/* ── 우측 영역 (440px): 토스 스타일 스마트 카드 프리뷰 ── */}
        <div
          style={{
            width: 440,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 60px 50px 0",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: 36,
              background: "#f9fafb",
              border: "1.5px solid #e5e8eb",
              boxShadow:
                "0 20px 40px rgba(25, 31, 40, 0.08), 0 2px 8px rgba(25, 31, 40, 0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 30px",
            }}
          >
            {/* 아바타 이미지 or 이니셜 */}
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                background: "#ffffff",
                padding: 6,
                boxShadow: "0 8px 24px rgba(49, 130, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              {photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoURL}
                  alt={name}
                  width={138}
                  height={138}
                  style={{
                    width: 138,
                    height: 138,
                    borderRadius: 69,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 138,
                    height: 138,
                    borderRadius: 69,
                    background:
                      "linear-gradient(135deg, #3182f6 0%, #1b64da 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 56,
                    fontWeight: 900,
                    color: "#ffffff",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* 카드 내 이름 & 뱃지 */}
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#191f28",
                letterSpacing: -0.5,
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#3182f6",
                marginTop: 4,
              }}
            >
              @{username}
            </span>

            {/* 카드 내 스탯 칩 */}
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid #e5e8eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8b95a1",
                  }}
                >
                  등록된 링크
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#191f28",
                    marginTop: 2,
                  }}
                >
                  {linkCount}개
                </span>
              </div>
              <div
                style={{
                  width: 1,
                  height: 36,
                  background: "#e5e8eb",
                  display: "flex",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8b95a1",
                  }}
                >
                  프로필 상태
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#04c759",
                    marginTop: 2,
                  }}
                >
                  공개중
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
