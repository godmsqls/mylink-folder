"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  ExternalLink,
  Edit3,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface ProfileDropdownProps {
  displayName: string;
  email?: string | null;
  photoURL?: string | null;
  onSignOut: () => Promise<void> | void;
}

export function ProfileDropdown({
  displayName,
  email,
  photoURL,
  onSignOut,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ESC 키 누르면 닫기
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const profilePageUrl = `/${encodeURIComponent(displayName)}`;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 트리거 버튼 (아바타 + displayName + 드롭다운 아이콘) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="사용자 프로필 메뉴"
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-[12px] bg-white border border-[#e5e8eb] shadow-2xs hover:bg-[#f9fafb] active:bg-[#f2f4f6] transition-all cursor-pointer group"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-[#3182f6] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {displayName[0] || "유"}
          </div>
        )}
        <span className="text-[13px] font-semibold text-[#191f28] max-w-[90px] sm:max-w-[130px] truncate">
          {displayName}님
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8b95a1] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#3182f6]" : "group-hover:text-[#4e5968]"
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 (TDS 스타일) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-[20px] shadow-tds-1 border border-[#e5e8eb] py-2 z-50 animate-tds-fade overflow-hidden">
          {/* 프로필 정보 요약 */}
          <div className="px-4 py-3 border-b border-[#f2f4f6] bg-[#f9fafb]">
            <div className="flex items-center gap-2.5">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#e5e8eb]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#3182f6] text-white text-[14px] font-bold flex items-center justify-center shrink-0">
                  {displayName[0] || "유"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-[#191f28] truncate">
                  {displayName}
                </p>
                {email && (
                  <p className="text-[11px] text-[#8b95a1] truncate">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* 메뉴 아이템 목록 */}
          <div className="p-1.5 space-y-0.5">
            {/* 개인별 공개 페이지 이동 (핵심 요구사항) */}
            <Link
              href={profilePageUrl}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[13px] font-semibold text-[#191f28] hover:bg-[#e8f3ff] hover:text-[#3182f6] transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-[8px] bg-[#e8f3ff] text-[#3182f6] flex items-center justify-center shrink-0">
                  <UserIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight">내 마이링크 방문</span>
                  <span className="text-[10px] text-[#8b95a1] group-hover:text-[#3182f6]/70 truncate block">
                    /{displayName}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#8b95a1] group-hover:text-[#3182f6] shrink-0" />
            </Link>

            {/* 홈 / 에디터 관리 페이지 이동 */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[13px] font-semibold text-[#4e5968] hover:bg-[#f2f4f6] hover:text-[#191f28] transition-colors"
            >
              <div className="w-7 h-7 rounded-[8px] bg-[#f2f4f6] text-[#4e5968] flex items-center justify-center shrink-0">
                <Edit3 className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">마이링크 편집기</span>
                <span className="text-[10px] text-[#8b95a1] block">
                  프로필 & 링크 관리
                </span>
              </div>
            </Link>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-[#f2f4f6] my-1" />

          {/* 로그아웃 버튼 */}
          <div className="p-1.5 pt-0.5">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await onSignOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[13px] font-medium text-[#f04452] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-[8px] bg-red-50 text-[#f04452] flex items-center justify-center shrink-0">
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
