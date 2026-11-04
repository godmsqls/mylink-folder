import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f2f4f6] flex flex-col items-center justify-center p-6 text-[#191f28]">
      <div className="w-full max-w-[420px] bg-white rounded-[28px] p-8 shadow-tds-1 border border-[#e5e8eb] text-center flex flex-col items-center">
        {/* 아이콘 */}
        <div className="w-16 h-16 rounded-[22px] bg-red-50 text-[#f04452] flex items-center justify-center mb-5 shadow-inner">
          <AlertCircle className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* 404 텍스트 */}
        <span className="text-[12px] font-bold tracking-wider uppercase text-[#3182f6] px-2.5 py-1 rounded-full bg-[#e8f3ff] mb-2">
          404 Not Found
        </span>
        <h1 className="text-[22px] font-bold text-[#191f28] mb-2">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-[14px] text-[#6b7684] leading-relaxed mb-6">
          요청하신 사용자의 마이링크가 존재하지 않거나,<br />
          표시 이름이 변경되었을 수 있습니다.
        </p>

        {/* 액션 버튼 */}
        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full h-12 rounded-[14px] bg-[#3182f6] hover:bg-[#1b64da] active:bg-[#1553b7] text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
