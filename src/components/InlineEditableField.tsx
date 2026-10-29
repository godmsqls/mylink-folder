"use client";

import React, { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";

interface InlineEditableFieldProps {
  value: string;
  onSave: (newValue: string) => void | Promise<void>;
  placeholder?: string;
  prefix?: string;
  className?: string;
  inputClassName?: string;
  isTextarea?: boolean;
  hintText?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function InlineEditableField({
  value,
  onSave,
  placeholder = "입력해 주세요",
  prefix,
  className = "",
  inputClassName = "",
  isTextarea = false,
  hintText,
  ariaLabel = "편집 가능한 텍스트",
  disabled = false,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const isCancelledRef = useRef(false);
  const isSavingRef = useRef(false);
  const isEditingRef = useRef(false);

  isEditingRef.current = isEditing;

  // 부모로부터 내려오는 value prop 변경 시 동기화
  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value);
    }
  }, [value, isEditing]);

  // 편집 모드 진입 시 자동 포커스 및 텍스트 전체 선택
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (disabled) return;
    isCancelledRef.current = false;
    isSavingRef.current = false;
    setCurrentValue(value);
    setIsEditing(true);
  };

  const commitSave = () => {
    if (isCancelledRef.current || isSavingRef.current) return;
    isSavingRef.current = true;
    setIsEditing(false);

    const trimmed = currentValue.trim();
    if (trimmed !== value.trim()) {
      onSave(trimmed);
    }

    // 다음 이벤트 루프에서 저장 락 해제
    setTimeout(() => {
      isSavingRef.current = false;
    }, 120);
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    setCurrentValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter") {
      if (isTextarea && e.shiftKey) {
        // Textarea에서 Shift+Enter는 줄바꿈 허용
        return;
      }
      e.preventDefault();
      commitSave();
    }
  };

  const handleBlur = () => {
    if (isEditingRef.current && !isCancelledRef.current) {
      commitSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative w-full">
        <div className="flex items-center gap-1 w-full">
          {prefix && (
            <span className="text-[#8b95a1] font-semibold text-[14px] select-none">
              {prefix}
            </span>
          )}
          {isTextarea ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              rows={3}
              className={`w-full rounded-[12px] border-2 border-[#3182f6] bg-white px-3 py-2 text-[#191f28] shadow-sm outline-none transition-all placeholder:text-[#8b95a1] resize-none ${inputClassName}`}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`w-full rounded-[10px] border-2 border-[#3182f6] bg-white px-2.5 py-1 text-[#191f28] shadow-sm outline-none transition-all placeholder:text-[#8b95a1] ${inputClassName}`}
            />
          )}
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#6b7684] mt-1 px-1">
          <span>{hintText || (isTextarea ? "Enter: 저장 · Shift+Enter: 줄바꿈 · ESC: 취소" : "Enter: 저장 · 포커스 해제: 저장 · ESC: 취소")}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStartEdit();
        }
      }}
      aria-label={ariaLabel}
      title="클릭하여 수정하기"
      className={`group relative inline-flex items-center gap-1.5 cursor-pointer rounded-[8px] transition-all hover:bg-black/[0.04] p-1 -m-1 ${className}`}
    >
      {prefix && <span className="select-none">{prefix}</span>}
      <span className={!value ? "text-[#8b95a1] italic" : ""}>
        {value || placeholder}
      </span>
      <Pencil className="w-3.5 h-3.5 text-[#8b95a1] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}
