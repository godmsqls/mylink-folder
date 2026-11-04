import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MyLink 방문자 통계 – 링크 클릭 & 유입 분석";
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
        {/* 배경 블롭 */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(49,130,246,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(4,199,89,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* 로고 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(135deg, #1b64da 0%, #3182f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 26,
              fontWeight: 900,
              boxShadow: "0 6px 20px rgba(49,130,246,0.25)",
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "#191f28",
              letterSpacing: -0.5,
            }}
          >
            MyLink
          </span>
        </div>

        {/* 타이틀 */}
        <span
          style={{
            fontSize: 46,
            fontWeight: 900,
            color: "#191f28",
            letterSpacing: -1.5,
            lineHeight: 1.2,
          }}
        >
          방문자 통계 & 인사이트
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#6b7684",
            marginTop: 16,
          }}
        >
          링크별 클릭 수, 유입 추이, 전환율을 한눈에
        </span>

        {/* 통계 목업 바 차트 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            marginTop: 40,
            height: 100,
            padding: "0 20px",
          }}
        >
          {[38, 55, 42, 70, 90, 65, 80].map((h, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: h,
                borderRadius: 8,
                background:
                  h === 90
                    ? "linear-gradient(180deg, #3182f6 0%, #1b64da 100%)"
                    : "#e8f3ff",
                display: "flex",
              }}
            />
          ))}
        </div>

        {/* 하단 통계 칩 */}
        <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 24px",
              borderRadius: 16,
              background: "white",
              border: "1px solid #e5e8eb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#8b95a1" }}>
              총 조회
            </span>
            <span
              style={{ fontSize: 22, fontWeight: 900, color: "#191f28" }}
            >
              4,820
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 24px",
              borderRadius: 16,
              background: "white",
              border: "1px solid #e5e8eb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#8b95a1" }}>
              클릭수
            </span>
            <span
              style={{ fontSize: 22, fontWeight: 900, color: "#3182f6" }}
            >
              1,940
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 24px",
              borderRadius: 16,
              background: "white",
              border: "1px solid #e5e8eb",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#8b95a1" }}>
              전환율
            </span>
            <span
              style={{ fontSize: 22, fontWeight: 900, color: "#04c759" }}
            >
              40.2%
            </span>
          </div>
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: 26,
            display: "flex",
            fontSize: 14,
            fontWeight: 600,
            color: "#8b95a1",
          }}
        >
          mylink.io/stats
        </div>
      </div>
    ),
    { ...size }
  );
}
