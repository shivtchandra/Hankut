"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { NicknameModal } from "@/components/leaderboard/NicknameModal";
import { fetchNickname } from "@/lib/game/nickname";

/** Shown on result screens: nudges unnamed players to join the leaderboard. */
export function LeaderboardPrompt() {
  const { t } = useLocale();
  const [nickname, setNickname] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    fetchNickname().then(setNickname);
  }, []);

  return (
    <div className="lb-identity lb-prompt">
      {nickname ? (
        <span>
          {t("lbPlayingAs")} <strong>{nickname}</strong>
        </span>
      ) : (
        <button type="button" className="lb-identity-btn primary" onClick={() => setModalOpen(true)}>
          {t("lbSetName")}
        </button>
      )}
      <Link href="/leaderboard" className="lb-identity-btn">
        {t("navLeaderboard")} →
      </Link>
      <NicknameModal
        key={String(modalOpen)}
        isOpen={modalOpen}
        initialName={nickname}
        onClose={closeModal}
        onSaved={setNickname}
      />
    </div>
  );
}
