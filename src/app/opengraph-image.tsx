import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MyLink – 나의 모든 링크를 하나의 감각적인 페이지에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f2f4f6 0%, #e8f3ff 50%, #f2f4f6 100%)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Segoe UI", sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 장식 원형 블롭 */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(49,130,246,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(4,199,89,0.1) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* 메인 컨텐츠 카드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
          }}
        >
          {/* 로고 & 브랜드명 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, #1b64da 0%, #3182f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 32,
                fontWeight: 900,
                boxShadow: "0 8px 24px rgba(49,130,246,0.3)",
              }}
            >
              M
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  color: "#191f28",
                  letterSpacing: -1,
                }}
              >
                MyLink
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#3182f6",
                  marginTop: -4,
                }}
              >
                마이링크
              </span>
            </div>
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#191f28",
                letterSpacing: -1.5,
                lineHeight: 1.2,
              }}
            >
              나의 모든 링크를
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#3182f6",
                letterSpacing: -1.5,
                lineHeight: 1.2,
              }}
            >
              가장 감각적인 한 페이지에
            </span>
          </div>

          {/* 서브 카피 */}
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#6b7684",
              marginTop: 20,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            GitHub · 블로그 · 포트폴리오 · SNS를 하나로 모으세요
          </span>

          {/* 하단 뱃지 그룹 */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 20,
                background: "white",
                border: "1px solid #e5e8eb",
                fontSize: 14,
                fontWeight: 700,
                color: "#333d4b",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              ✨ 1초 무료 시작
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 20,
                background: "white",
                border: "1px solid #e5e8eb",
                fontSize: 14,
                fontWeight: 700,
                color: "#333d4b",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              📊 실시간 통계
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 20,
                background: "white",
                border: "1px solid #e5e8eb",
                fontSize: 14,
                fontWeight: 700,
                color: "#333d4b",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              📱 완벽 반응형
            </div>
          </div>
        </div>

        {/* 하단 URL 표시 */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 15,
            fontWeight: 600,
            color: "#8b95a1",
          }}
        >
          mylink.io
        </div>
      </div>
    ),
    { ...size }
  );
}
