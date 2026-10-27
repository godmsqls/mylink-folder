"use client";

import { useState } from "react";
import { Plus, Link2, Sparkles, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { LinkItem } from "@/data/profile";
import { addLink } from "@/lib/firestore";

interface AddLinkDialogProps {
  userId: string;
  onAdd: (link: LinkItem) => void;
}

const ICON_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "book-open", label: "블로그 / 문서" },
  { value: "sparkles", label: "스파클 ✨" },
  { value: "link", label: "기본 링크 🔗" },
];

const BADGE_OPTIONS = [
  { value: "", label: "없음" },
  { value: "HOT", label: "🔥 HOT" },
  { value: "NEW", label: "🆕 NEW" },
  { value: "추천", label: "⭐ 추천" },
];

const TYPE_OPTIONS: { value: LinkItem["type"]; label: string; icon: React.ReactNode }[] = [
  { value: "link", label: "일반 링크", icon: <Link2 className="w-4 h-4" /> },
  { value: "highlight", label: "강조 링크", icon: <Sparkles className="w-4 h-4" /> },
  { value: "header", label: "카테고리 구분선", icon: <Hash className="w-4 h-4" /> },
];

const DEFAULT_FORM = {
  type: "link" as LinkItem["type"],
  title: "",
  subtitle: "",
  url: "",
  iconName: "link",
  badgeText: "",
};

export function AddLinkDialog({ userId, onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "제목을 입력해 주세요.";
    if (form.type !== "header" && !form.url.trim()) next.url = "URL을 입력해 주세요.";
    if (
      form.type !== "header" &&
      form.url.trim() &&
      !/^https?:\/\/.+/.test(form.url.trim())
    ) {
      next.url = "http:// 또는 https:// 로 시작하는 URL을 입력해 주세요.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = Date.now();
    const newLink: LinkItem = {
      id: `link-${now}`,
      type: form.type,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      url: form.type !== "header" ? form.url.trim() : undefined,
      iconName: form.type !== "header" ? form.iconName : undefined,
      badgeText: form.badgeText || undefined,
      isActive: true,
      order: now,
      createdAt: now,
    };

    setSaving(true);
    try {
      const firestoreId = await addLink(userId, newLink);
      // Firestore가 발급한 ID로 교체하여 상위에 전달
      onAdd({ ...newLink, id: firestoreId });
      setForm(DEFAULT_FORM);
      setErrors({});
      setOpen(false);
    } catch (err) {
      console.error("링크 저장 실패:", err);
      setErrors({ submit: "저장 중 오류가 발생했어요. 다시 시도해 주세요." });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setForm(DEFAULT_FORM);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className="flex items-center gap-2 w-full px-4 py-3 rounded-[14px] border-2 border-dashed border-[#e5e8eb] text-[14px] font-semibold text-[#8b95a1] hover:border-[#3182f6] hover:text-[#3182f6] hover:bg-[#e8f3ff] transition-all duration-150 cursor-pointer justify-center mt-2"
      >
        <Plus className="w-4 h-4" />
        링크 추가하기
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-[20px] border border-[#e5e8eb]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#f2f4f6]">
          <DialogTitle className="text-[18px] font-bold text-[#191f28]">
            링크 추가
          </DialogTitle>
          <p className="text-[13px] text-[#8b95a1] mt-0.5">
            링크 모음에 새 항목을 추가해요.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">

            {/* 타입 선택 */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#4e5968]">
                링크 종류
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: opt.value, badgeText: "" }))}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-[12px] border text-[12px] font-semibold transition-all cursor-pointer ${
                      form.type === opt.value
                        ? "border-[#3182f6] bg-[#e8f3ff] text-[#3182f6]"
                        : "border-[#e5e8eb] text-[#6b7684] hover:border-[#b0b8c1]"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#4e5968]">
                제목 <span className="text-[#f04452]">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={
                  form.type === "header"
                    ? "📂 소셜 채널"
                    : "GitHub"
                }
                className={`w-full h-11 px-3.5 rounded-[12px] border text-[14px] text-[#191f28] placeholder:text-[#b0b8c1] outline-none transition-colors ${
                  errors.title
                    ? "border-[#f04452] bg-red-50 focus:border-[#f04452]"
                    : "border-[#e5e8eb] bg-[#f9fafb] focus:border-[#3182f6] focus:bg-white"
                }`}
              />
              {errors.title && (
                <p className="text-[12px] text-[#f04452]">{errors.title}</p>
              )}
            </div>

            {/* 서브텍스트 + URL (header 타입이 아닐 때만) */}
            {form.type !== "header" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#4e5968]">
                    서브텍스트
                    <span className="ml-1 text-[11px] font-medium text-[#b0b8c1]">(선택)</span>
                  </label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    placeholder="@username · 부연 설명"
                    className="w-full h-11 px-3.5 rounded-[12px] border border-[#e5e8eb] bg-[#f9fafb] text-[14px] text-[#191f28] placeholder:text-[#b0b8c1] outline-none focus:border-[#3182f6] focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#4e5968]">
                    URL <span className="text-[#f04452]">*</span>
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://example.com"
                    className={`w-full h-11 px-3.5 rounded-[12px] border text-[14px] text-[#191f28] placeholder:text-[#b0b8c1] outline-none transition-colors ${
                      errors.url
                        ? "border-[#f04452] bg-red-50 focus:border-[#f04452]"
                        : "border-[#e5e8eb] bg-[#f9fafb] focus:border-[#3182f6] focus:bg-white"
                    }`}
                  />
                  {errors.url && (
                    <p className="text-[12px] text-[#f04452]">{errors.url}</p>
                  )}
                </div>

                {/* 아이콘 선택 */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[#4e5968]">아이콘</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ICON_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, iconName: opt.value }))}
                        className={`py-2 px-2 rounded-[10px] border text-[12px] font-semibold transition-all cursor-pointer ${
                          form.iconName === opt.value
                            ? "border-[#3182f6] bg-[#e8f3ff] text-[#3182f6]"
                            : "border-[#e5e8eb] text-[#6b7684] hover:border-[#b0b8c1]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 배지 (highlight 타입일 때만) */}
                {form.type === "highlight" && (
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[#4e5968]">
                      배지
                      <span className="ml-1 text-[11px] font-medium text-[#b0b8c1]">(선택)</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {BADGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, badgeText: opt.value }))}
                          className={`py-1.5 px-3 rounded-full border text-[12px] font-semibold transition-all cursor-pointer ${
                            form.badgeText === opt.value
                              ? "border-[#3182f6] bg-[#e8f3ff] text-[#3182f6]"
                              : "border-[#e5e8eb] text-[#6b7684] hover:border-[#b0b8c1]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 푸터 버튼 */}
          <DialogFooter className="px-6 py-4 bg-[#f9fafb] border-t border-[#f2f4f6] flex-row gap-2 rounded-b-[20px] -mx-0 -mb-0">
            {errors.submit && (
              <p className="w-full text-[12px] text-[#f04452] text-center mb-1">{errors.submit}</p>
            )}
            <DialogClose
              type="button"
              disabled={saving}
              className="flex-1 h-11 rounded-[12px] border border-[#e5e8eb] bg-white text-[14px] font-semibold text-[#4e5968] hover:bg-[#f2f4f6] transition-colors cursor-pointer disabled:opacity-50"
            >
              취소
            </DialogClose>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-[12px] bg-[#3182f6] text-white text-[14px] font-bold hover:bg-[#1b64da] active:bg-[#1555bd] transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? "저장 중…" : "추가하기"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
