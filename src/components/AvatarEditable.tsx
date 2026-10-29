"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Check, X, Sparkles, RefreshCw } from "lucide-react";

interface AvatarEditableProps {
  photoURL: string;
  displayName: string;
  onSave: (newUrl: string) => void | Promise<void>;
  disabled?: boolean;
}

const PRESET_AVATARS = [
  {
    name: "프로페셔널",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "미니멀",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "개발자",
    url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "감성",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
  },
];

export function AvatarEditable({
  photoURL,
  displayName,
  onSave,
  disabled = false,
}: AvatarEditableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(photoURL);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputUrl(photoURL);
  }, [photoURL]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleCancel();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (disabled) return;
    setInputUrl(photoURL);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setInputUrl(photoURL);
    setIsOpen(false);
  };

  const handleSave = (customUrl?: string) => {
    const targetUrl = (customUrl ?? inputUrl).trim();
    setIsOpen(false);
    if (!targetUrl || targetUrl === photoURL) return;
    onSave(targetUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      {/* 64px 아바타 컨테이너 */}
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
        title="클릭하여 아바타 이미지 수정"
        className="group relative w-16 h-16 rounded-[20px] overflow-hidden bg-[#f2f4f6] border border-[#e5e8eb] cursor-pointer shadow-2xs hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#3182f6]"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              // 이미지 로딩 실패 시 기본 대체
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#3182f6] text-white font-bold text-[20px]">
            {displayName[0] || "U"}
          </div>
        )}

        {/* 호버 시 나타나는 편집 오버레이 */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
          <Camera className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">수정</span>
        </div>
      </div>

      {/* 인라인 아바타 편집 팝오버 창 */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[290px] p-3.5 bg-white rounded-[18px] shadow-tds-toast border border-[#e5e8eb] animate-tds-fade">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-[#191f28] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#3182f6]" />
              아바타 이미지 변경
            </span>
            <button
              onClick={handleCancel}
              className="w-5 h-5 flex items-center justify-center text-[#8b95a1] hover:text-[#191f28] rounded-full hover:bg-[#f2f4f6]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold text-[#6b7684] block mb-1">
                이미지 URL 입력 (Enter: 저장 · ESC: 취소)
              </label>
              <input
                ref={inputRef}
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/photo.jpg"
                className="w-full h-8 px-2.5 rounded-[8px] border border-[#e5e8eb] focus:border-[#3182f6] focus:ring-2 focus:ring-[#3182f6]/20 text-[12px] text-[#191f28] outline-none"
              />
            </div>

            {/* 빠른 추천 프리셋 아바타 */}
            <div>
              <span className="text-[11px] font-semibold text-[#8b95a1] block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#3182f6]" />
                추천 프리셋
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSave(preset.url)}
                    className="group/preset relative flex flex-col items-center gap-1 p-1 rounded-[10px] hover:bg-[#f2f4f6] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-[10px] overflow-hidden border border-[#e5e8eb] group-hover/preset:border-[#3182f6]">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-[#6b7684] group-hover/preset:text-[#191f28] truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-[#f2f4f6]">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-7 rounded-[8px] bg-[#f2f4f6] hover:bg-[#e5e8eb] text-[#4e5968] text-[12px] font-semibold transition-colors"
              >
                취소 (ESC)
              </button>
              <button
                type="button"
                onClick={() => handleSave()}
                className="flex-1 h-7 rounded-[8px] bg-[#3182f6] hover:bg-[#1b64da] text-white text-[12px] font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                저장 (Enter)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
