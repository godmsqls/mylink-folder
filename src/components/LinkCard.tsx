"use client";

import { useState } from "react";
import { ChevronRight, Pencil, Trash2, Link2, Sparkles, Hash, X, Check, AlertTriangle } from "lucide-react";
import { LinkItem } from "@/data/profile";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/SocialIcons";
import { updateLink, deleteLink } from "@/lib/firestore";

// ────────────────────────────────────────────────────────────
// 공유 상수 (AddLinkDialog와 동일)
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// 아이콘 렌더러
// ────────────────────────────────────────────────────────────
function renderIcon(iconName?: string) {
  switch (iconName) {
    case "github":    return <GithubIcon className="w-5 h-5 text-[#333d4b]" />;
    case "linkedin":  return <LinkedinIcon className="w-5 h-5 text-[#333d4b]" />;
    case "instagram": return <InstagramIcon className="w-5 h-5 text-[#333d4b]" />;
    default:          return <span className="text-[18px]">📝</span>;
  }
}

// ────────────────────────────────────────────────────────────
// 삭제 확인 모달
// ────────────────────────────────────────────────────────────
interface DeleteModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

function DeleteModal({ title, onConfirm, onCancel, deleting }: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* 딤 배경 */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* 모달 카드 */}
      <div className="relative w-full max-w-[340px] bg-white rounded-[24px] shadow-2xl border border-[#e5e8eb] overflow-hidden animate-tds-fade">
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#f04452]" />
            </div>
            <h2 className="text-[17px] font-bold text-[#191f28]">정말 삭제하시겠습니까?</h2>
          </div>

          {/* 링크 이름 */}
          <div className="px-3 py-2.5 rounded-[12px] bg-[#f9fafb] border border-[#e5e8eb] mb-3">
            <p className="text-[14px] font-semibold text-[#191f28] truncate">{title}</p>
          </div>

          {/* 경고 문구 */}
          <p className="text-[13px] font-semibold text-[#f04452] text-center">
            이 작업은 되돌릴 수 없습니다
          </p>
        </div>

        {/* 버튼 푸터 */}
        <div className="px-6 py-4 bg-[#f9fafb] border-t border-[#f2f4f6] flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 h-11 rounded-[12px] border border-[#e5e8eb] bg-white text-[14px] font-semibold text-[#4e5968] hover:bg-[#f2f4f6] transition-colors cursor-pointer disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 h-11 rounded-[12px] bg-[#f04452] text-white text-[14px] font-bold hover:bg-[#d63843] active:bg-[#c0333e] transition-colors cursor-pointer disabled:opacity-60"
          >
            {deleting ? "삭제 중…" : "삭제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 인라인 편집 폼
// ────────────────────────────────────────────────────────────
interface InlineEditFormProps {
  link: LinkItem;
  userId?: string;
  onSave: (updated: LinkItem) => void;
  onCancel: () => void;
}

function InlineEditForm({ link, userId, onSave, onCancel }: InlineEditFormProps) {
  const [form, setForm] = useState({
    type: link.type,
    title: link.title,
    subtitle: link.subtitle ?? "",
    url: link.url ?? "",
    iconName: link.iconName ?? "link",
    badgeText: link.badgeText ?? "",
  });
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

    const updated: LinkItem = {
      ...link,
      type: form.type,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      url: form.type !== "header" ? form.url.trim() : undefined,
      iconName: form.type !== "header" ? form.iconName : undefined,
      badgeText: form.badgeText || undefined,
    };

    setSaving(true);
    try {
      if (userId) {
        await updateLink(userId, link.id, updated);
      }
      onSave(updated);
    } catch (err) {
      console.error("링크 수정 실패:", err);
      setErrors({ submit: "수정 중 오류가 발생했어요. 다시 시도해 주세요." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="my-2 rounded-[16px] border border-[#3182f6] bg-[#f8faff] shadow-sm overflow-hidden"
    >
      <div className="px-4 py-4 space-y-4">

        {/* 링크 종류 */}
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-[#4e5968]">링크 종류</label>
          <div className="grid grid-cols-3 gap-1.5">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: opt.value, badgeText: "" }))}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-[10px] border text-[11px] font-semibold transition-all cursor-pointer ${
                  form.type === opt.value
                    ? "border-[#3182f6] bg-[#e8f3ff] text-[#3182f6]"
                    : "border-[#e5e8eb] text-[#6b7684] hover:border-[#b0b8c1] bg-white"
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className="space-y-1">
          <label className="text-[12px] font-semibold text-[#4e5968]">
            제목 <span className="text-[#f04452]">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder={form.type === "header" ? "📂 소셜 채널" : "GitHub"}
            className={`w-full h-10 px-3 rounded-[10px] border text-[13px] text-[#191f28] placeholder:text-[#b0b8c1] outline-none transition-colors ${
              errors.title
                ? "border-[#f04452] bg-red-50"
                : "border-[#e5e8eb] bg-white focus:border-[#3182f6]"
            }`}
          />
          {errors.title && <p className="text-[11px] text-[#f04452]">{errors.title}</p>}
        </div>

        {/* header 타입이 아닐 때만 */}
        {form.type !== "header" && (
          <>
            {/* 서브텍스트 */}
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#4e5968]">
                서브텍스트
                <span className="ml-1 text-[10px] font-medium text-[#b0b8c1]">(선택)</span>
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="@username · 부연 설명"
                className="w-full h-10 px-3 rounded-[10px] border border-[#e5e8eb] bg-white text-[13px] text-[#191f28] placeholder:text-[#b0b8c1] outline-none focus:border-[#3182f6] transition-colors"
              />
            </div>

            {/* URL */}
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#4e5968]">
                URL <span className="text-[#f04452]">*</span>
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://example.com"
                className={`w-full h-10 px-3 rounded-[10px] border text-[13px] text-[#191f28] placeholder:text-[#b0b8c1] outline-none transition-colors ${
                  errors.url
                    ? "border-[#f04452] bg-red-50"
                    : "border-[#e5e8eb] bg-white focus:border-[#3182f6]"
                }`}
              />
              {errors.url && <p className="text-[11px] text-[#f04452]">{errors.url}</p>}
            </div>

            {/* 아이콘 */}
            <div className="space-y-1">
              <label className="text-[12px] font-semibold text-[#4e5968]">아이콘</label>
              <div className="grid grid-cols-3 gap-1.5">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, iconName: opt.value }))}
                    className={`py-1.5 px-2 rounded-[8px] border text-[11px] font-semibold transition-all cursor-pointer ${
                      form.iconName === opt.value
                        ? "border-[#3182f6] bg-[#e8f3ff] text-[#3182f6]"
                        : "border-[#e5e8eb] text-[#6b7684] hover:border-[#b0b8c1] bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 배지 (highlight 타입만) */}
            {form.type === "highlight" && (
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-[#4e5968]">
                  배지
                  <span className="ml-1 text-[10px] font-medium text-[#b0b8c1]">(선택)</span>
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {BADGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, badgeText: opt.value }))}
                      className={`py-1 px-2.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
                        form.badgeText === opt.value
                          ? "border-[#3182f6] bg-[#e8f3ff] text-[#3182f6]"
                          : "border-[#e5e8eb] text-[#6b7684] hover:border-[#b0b8c1] bg-white"
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

        {errors.submit && (
          <p className="text-[12px] text-[#f04452] text-center">{errors.submit}</p>
        )}
      </div>

      {/* 폼 액션 버튼 */}
      <div className="px-4 py-3 bg-white border-t border-[#e5e8eb] flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-1 h-9 px-4 rounded-[10px] border border-[#e5e8eb] bg-white text-[13px] font-semibold text-[#4e5968] hover:bg-[#f2f4f6] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5" />
          취소
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1 h-9 rounded-[10px] bg-[#3182f6] text-white text-[13px] font-bold hover:bg-[#1b64da] transition-colors cursor-pointer disabled:opacity-60"
        >
          <Check className="w-3.5 h-3.5" />
          {saving ? "저장 중…" : "저장하기"}
        </button>
      </div>
    </form>
  );
}

// ────────────────────────────────────────────────────────────
// LinkCard
// ────────────────────────────────────────────────────────────
interface LinkCardProps {
  link: LinkItem;
  userId?: string;
  onUpdate?: (updated: LinkItem) => void;
  onDelete?: (id: string) => void;
}

export function LinkCard({ link, userId, onUpdate, onDelete }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!link.isActive) return null;

  // ── 수정 저장 완료
  const handleSave = (updated: LinkItem) => {
    setIsEditing(false);
    onUpdate?.(updated);
  };

  // ── 삭제 실행
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      if (userId) {
        await deleteLink(userId, link.id);
      }
      setShowDeleteModal(false);
      onDelete?.(link.id);
    } catch (err) {
      console.error("링크 삭제 실패:", err);
      setDeleting(false);
    }
  };

  // ── 공통 액션 버튼 바
  const ActionButtons = ({ dark = false }: { dark?: boolean }) => (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); }}
        aria-label="수정"
        className={`w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors cursor-pointer ${
          dark
            ? "text-white/80 hover:bg-white/20 active:bg-white/30"
            : "text-[#8b95a1] hover:bg-[#e5e8eb] hover:text-[#4e5968] active:bg-[#d1d6db]"
        }`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDeleteModal(true); }}
        aria-label="삭제"
        className={`w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors cursor-pointer ${
          dark
            ? "text-white/80 hover:bg-white/20 active:bg-white/30"
            : "text-[#8b95a1] hover:bg-red-50 hover:text-[#f04452] active:bg-red-100"
        }`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // ══════════════════════════════════════════
  // 인라인 편집 중일 때
  // ══════════════════════════════════════════
  if (isEditing) {
    return (
      <>
        <InlineEditForm
          link={link}
          userId={userId}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
        {showDeleteModal && (
          <DeleteModal
            title={link.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteModal(false)}
            deleting={deleting}
          />
        )}
      </>
    );
  }

  // ══════════════════════════════════════════
  // header 타입
  // ══════════════════════════════════════════
  if (link.type === "header") {
    return (
      <>
        <div className="pt-5 pb-2 px-1 flex items-center justify-between">
          <h4 className="text-[14px] font-bold text-[#4e5968]">{link.title}</h4>
          <ActionButtons />
        </div>
        {showDeleteModal && (
          <DeleteModal
            title={link.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteModal(false)}
            deleting={deleting}
          />
        )}
      </>
    );
  }

  // ══════════════════════════════════════════
  // highlight 타입
  // ══════════════════════════════════════════
  if (link.type === "highlight") {
    return (
      <>
        <div className="relative flex items-center justify-between p-4 my-2 rounded-[16px] border border-[#e5e8eb] shadow-tds-1 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50 pointer-events-none" />

          {/* 링크 영역 */}
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="relative flex items-center gap-3.5 z-10 flex-1 min-w-0 transition-transform active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-[12px] bg-white border border-[#e5e8eb] flex items-center justify-center flex-shrink-0 shadow-sm">
              {renderIcon(link.iconName)}
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[#191f28] truncate">{link.title}</p>
              {link.subtitle && (
                <p className="text-[12px] text-[#4e5968] mt-0.5 truncate">{link.subtitle}</p>
              )}
            </div>
          </a>

          {/* 오른쪽 영역: 배지 + 화살표 + 버튼 */}
          <div className="relative z-10 flex items-center gap-1.5 ml-2 flex-shrink-0">
            {link.badgeText && (
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#f04452] text-[11px] font-bold tracking-wide">
                {link.badgeText}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-[#b0b8c1]" />
            <ActionButtons />
          </div>

          {/* Glow animation */}
          <div className="absolute inset-0 bg-white/40 animate-pulse pointer-events-none" />
        </div>

        {showDeleteModal && (
          <DeleteModal
            title={link.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteModal(false)}
            deleting={deleting}
          />
        )}
      </>
    );
  }

  // ══════════════════════════════════════════
  // 일반 link 타입
  // ══════════════════════════════════════════
  return (
    <>
      <div className="flex items-center justify-between hover:bg-[#f9fafb] active:bg-[#f2f4f6] rounded-[16px] transition-colors group pr-1">
        {/* 링크 본문 */}
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3.5 flex-1 min-w-0 p-3.5"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#f2f4f6] group-hover:bg-white border border-transparent group-hover:border-[#e5e8eb] flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
            {renderIcon(link.iconName)}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#191f28] truncate">{link.title}</p>
            {link.subtitle && (
              <p className="text-[12px] text-[#8b95a1] truncate">{link.subtitle}</p>
            )}
          </div>
        </a>

        {/* 오른쪽: 화살표 + 버튼 */}
        <div className="flex items-center gap-1 pr-1 flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-[#b0b8c1] group-hover:text-[#191f28]" />
          <ActionButtons />
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          title={link.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}
    </>
  );
}
