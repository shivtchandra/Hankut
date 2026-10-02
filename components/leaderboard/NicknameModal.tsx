"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { IconClose } from "@/components/icons/Icons";
import { saveNickname } from "@/lib/game/nickname";

type Props = {
  isOpen: boolean;
  initialName?: string | null;
  onClose: () => void;
  onSaved: (nickname: string) => void;
};

export function NicknameModal({ isOpen, initialName, onClose, onSaved }: Props) {
  const { t } = useLocale();
  const [name, setName] = useState(initialName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Parents remount via `key` on open, so state starts fresh from initialName.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    const result = await saveNickname(name.trim());
    setSaving(false);
    if (result.ok) {
      onSaved(result.nickname);
      onClose();
      return;
    }
    setError(
      result.error === "name_taken"
        ? t("lbNameTaken")
        : result.error === "invalid_name"
          ? t("lbNameInvalid")
          : "Network error",
    );
  }

  return (
    <div
      className="how-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nickname-modal-title"
    >
      <div className="how-modal-content nickname-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="how-modal-close-btn" onClick={onClose} aria-label="Close">
          <IconClose size={20} />
        </button>

        <div className="how-modal-header">
          <span className="how-modal-eyebrow">LEADERBOARD</span>
          <h2 id="nickname-modal-title" className="how-modal-title">
            {t("lbNameTitle")}
          </h2>
          <p className="how-modal-sub">{t("lbNameHint")}</p>
        </div>

        <form className="nickname-form" onSubmit={handleSubmit}>
          <input
            className="nickname-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="nickname-save" disabled={saving || name.trim().length < 2}>
            {t("lbSave")}
          </button>
        </form>
        {error && <p className="nickname-error">{error}</p>}
      </div>
    </div>
  );
}
