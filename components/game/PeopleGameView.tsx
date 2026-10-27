"use client";

import { useMemo, useRef, useState } from "react";
import { matchesAlias, normalize } from "@/lib/game/normalization";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import {
  IconLock,
  IconPeople,
  IconUnlock,
  IconSkipForward,
  IconShare,
  IconSearch,
} from "@/components/icons/Icons";
import {
  buildInviteShare,
  buildScoreShare,
  buildChallengeShare,
  shareOrCopy,
} from "@/lib/game/share";
import { seoulToday } from "@/lib/game/dates";
import type { Drama, PeoplePayload } from "@/types/game";
import { PEOPLE_CATALOG, findPersonInCatalog } from "@/lib/game/people-catalog";

type Props = {
  payload: PeoplePayload;
  dramas?: Drama[];
  gameDate?: string;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function PeopleGameView({ payload, dramas = [], gameDate, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const frames = payload.frames;
  const [frame, setFrame] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const startTimeRef = useRef<number>(Date.now());

  const currentSrc = frames[frame] || frames[0];
  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const activeDate = gameDate || seoulToday();

  const displayTitle = locale === "en" && payload.nameEn ? payload.nameEn : payload.nameKr;
  const subTitle = locale === "en" ? payload.nameKr : payload.nameEn;

  const searchCandidates = useMemo(() => {
    const list: {
      primary: string;
      secondary: string;
      cleanVal: string;
      searchKeys: string[];
      isPerson: boolean;
    }[] = [];
    const seen = new Set<string>();

    const add = (
      p: string,
      s: string,
      v: string,
      searchKeys: string[],
      isPerson: boolean
    ) => {
      const key = v.toLowerCase().trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      list.push({ primary: p, secondary: s, cleanVal: v, searchKeys, isPerson });
    };

    // 1. Target person (secret answer)
    const targetPrimary = locale === "en" ? (payload.nameEn || payload.nameKr) : (payload.nameKr || payload.nameEn);
    const targetSub = locale === "en" ? payload.nameKr : payload.nameEn;
    const targetLabel = locale === "en" ? "Person" : "인물";
    add(
      targetPrimary,
      targetSub ? `${targetSub} · ${targetLabel}` : targetLabel,
      targetPrimary,
      [payload.nameKr, payload.nameEn, ...payload.aliases].filter(Boolean),
      true
    );

    // 2. Comprehensive Korean actors & actresses catalog (140+ top stars)
    PEOPLE_CATALOG.forEach((person) => {
      const isActress = person.role === "actress";
      const primary = locale === "en" ? person.nameEn : person.nameKr;
      const sub = locale === "en" ? person.nameKr : person.nameEn;
      const roleLabel =
        locale === "en"
          ? isActress
            ? "Actress"
            : "Actor"
          : isActress
          ? "배우 (여)"
          : "배우 (남)";
      const works = person.famousWorks?.length ? ` (${person.famousWorks.slice(0, 2).join(", ")})` : "";
      const secondary = `${sub} · ${roleLabel}${works}`;
      const searchKeys = [
        person.nameEn,
        person.nameKr,
        ...(person.aliases || []),
        ...(person.famousWorks || []),
      ];
      add(primary, secondary, primary, searchKeys, true);
    });

    // 3. Dramas (if player searches a drama)
    dramas.forEach((d) => {
      const p = locale === "en" ? d.titleEn : d.titleKr;
      const s = locale === "en" ? d.titleKr : d.titleEn;
      const dramaLabel = locale === "en" ? "Drama" : "드라마";
      add(
        p,
        s ? `${s} (${dramaLabel})` : dramaLabel,
        p,
        [d.titleEn, d.titleKr].filter(Boolean),
        false
      );
    });

    return list;
  }, [payload, dramas, locale]);

  const suggestions = useMemo(() => {
    const clean = guess.trim();
    if (!clean) return [];
    const q = normalize(clean);
    if (!q) return [];

    const matched = searchCandidates.filter((item) => {
      if (normalize(item.cleanVal).includes(q)) return true;
      if (normalize(item.primary).includes(q)) return true;
      return item.searchKeys.some((k) => {
        const kn = normalize(k);
        if (q.length <= 2) {
          return kn === q || kn.startsWith(q) || k.toLowerCase().split(/\s+/).some((w) => w.startsWith(clean.toLowerCase()));
        }
        return kn.includes(q);
      });
    });

    // Sort to prioritize:
    // 1. Starts with query on primary name / cleanVal
    // 2. Starts with query on any search key (alias/Korean/English)
    // 3. Person before drama
    // 4. Alphabetical / Hangul
    matched.sort((a, b) => {
      const aNorm = normalize(a.cleanVal);
      const bNorm = normalize(b.cleanVal);
      const aPrimaryStarts = aNorm.startsWith(q);
      const bPrimaryStarts = bNorm.startsWith(q);

      if (aPrimaryStarts && !bPrimaryStarts) return -1;
      if (!aPrimaryStarts && bPrimaryStarts) return 1;

      const aAnyStarts = a.searchKeys.some((k) => normalize(k).startsWith(q));
      const bAnyStarts = b.searchKeys.some((k) => normalize(k).startsWith(q));
      if (aAnyStarts && !bAnyStarts) return -1;
      if (!aAnyStarts && bAnyStarts) return 1;

      if (a.isPerson && !b.isPerson) return -1;
      if (!a.isPerson && b.isPerson) return 1;

      return a.primary.localeCompare(b.primary);
    });

    return matched.slice(0, 8);
  }, [guess, searchCandidates]);

  function checkAnswer(clean: string): boolean {
    if (matchesAlias(clean, payload.aliases)) return true;
    if (payload.nameKr && matchesAlias(clean, [payload.nameKr])) return true;
    if (payload.nameEn && matchesAlias(clean, [payload.nameEn])) return true;

    // Cross-check catalog aliases
    const catalogMatch = findPersonInCatalog(clean);
    if (catalogMatch) {
      if (payload.nameKr && matchesAlias(catalogMatch.nameKr, [payload.nameKr])) return true;
      if (payload.nameEn && matchesAlias(catalogMatch.nameEn, [payload.nameEn])) return true;
      if (matchesAlias(catalogMatch.nameKr, payload.aliases)) return true;
      if (matchesAlias(catalogMatch.nameEn, payload.aliases)) return true;
      for (const a of catalogMatch.aliases || []) {
        if (matchesAlias(a, payload.aliases)) return true;
      }
    }
    return false;
  }

  function submitGuess(value = guess) {
    if (finished) return;
    const clean = value.trim();
    if (!clean) return;

    const isCorrect = checkAnswer(clean);
    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (isCorrect) {
      setSolved(true);
      setNotice(t("correct"));
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    if (nextAttempts.length < 5) {
      setFrame((f) => Math.min(f + 1, frames.length - 1));
      setNotice(locale === "ko" ? "틀렸습니다! 이미지가 조금 더 밝혀집니다." : "Incorrect! The image reveals slightly more.");
    } else {
      setNotice(locale === "ko" ? `아쉽네요. 정답은 "${payload.nameKr}" 입니다.` : `Game over. The answer was "${displayTitle}".`);
      onFail?.();
    }
  }

  function skipReveal() {
    if (finished) return;
    const skipLabel = locale === "ko" ? "건너뜀" : "Skipped";
    const nextAttempts = [...attempts, skipLabel];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (nextAttempts.length < 5) {
      setFrame((f) => Math.min(f + 1, frames.length - 1));
      setNotice(locale === "ko" ? "건너뛰었습니다! 이미지가 조금 더 밝혀집니다." : "Skipped! The image reveals slightly more.");
    } else {
      setNotice(locale === "ko" ? `아쉽네요. 정답은 "${payload.nameKr}" 입니다.` : `Game over. The answer was "${displayTitle}".`);
      onFail?.();
    }
  }

  function useClue(clueId: string) {
    if (!usedClues.includes(clueId)) {
      setUsedClues((prev) => [...prev, clueId]);
    }
  }

  async function handleShareGame() {
    const shareData = buildInviteShare({ locale, brand: t("brandName"), gameDate: activeDate, todayDate: seoulToday() });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("shareGameCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  async function handleShareResult() {
    const score = solved ? Math.max(25 - (attempts.length - 1) * 5, 5) : 0;
    const shareData = buildScoreShare({ locale, brand: t("brandName"), gameDate: activeDate, todayDate: seoulToday(), solved, attempts: attempts.length, score });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("shareCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  async function handleShareChallenge() {
    const shareData = buildChallengeShare({ locale, brand: t("brandName"), gameDate: activeDate, todayDate: seoulToday(), solved, attempts: attempts.length });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("challengeCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  return (
    <div className="game-shell">
      <div className="people-wrap">
        <div className="scene people-scene">
          <img
            key={frame}
            className="scene-frame-img"
            src={currentSrc}
            alt="Person reveal frame"
            fetchPriority={frame === 0 ? "high" : "auto"}
            loading="eager"
            decoding="async"
          />
          <div className="scene-grain" aria-hidden />
          <div className="scene-vignette" aria-hidden />
          <div className="scene-hud">
            <span>
              <IconPeople size={14} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
              {locale === "ko" ? `인물 단계 ${frame + 1} / 5` : `Person step ${frame + 1} / 5`}
            </span>
            <span>{payload.category}</span>
          </div>
        </div>
      </div>

      <div className="guess-panel">
        <div className="console-topbar">
          <div className="console-header-row">
            <span className="console-eyebrow">{t("peopleTitle")}</span>

            <div className="console-meta-actions">
              <button
                type="button"
                className="scene-share-btn"
                onClick={handleShareGame}
                title={t("shareGame")}
              >
                <IconShare size={12} />
                <span>{t("shareGame")}</span>
              </button>
            </div>
          </div>

          <h2 className="console-title">{t("whatPeople")}</h2>
        </div>

        {!finished && (
          <div className="unified-play-box">
            <div className="unified-input-wrap">
              <IconSearch size={18} className="unified-search-icon" />
              <input
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  setSuggestIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSuggestIndex((i) => (i >= suggestions.length - 1 ? 0 : i + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSuggestIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
                  } else if (e.key === "Enter") {
                    if (suggestIndex >= 0 && suggestions[suggestIndex]) {
                      submitGuess(suggestions[suggestIndex].cleanVal);
                    } else {
                      submitGuess();
                    }
                  } else if (e.key === "Escape") {
                    setSuggestIndex(-1);
                  }
                }}
                placeholder={t("peoplePlaceholder")}
                autoComplete="off"
              />
              {guess && (
                <button
                  type="button"
                  className="unified-clear-btn"
                  onClick={() => {
                    setGuess("");
                    setSuggestIndex(-1);
                  }}
                  aria-label="Clear input"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                className="unified-submit-btn"
                onClick={() => submitGuess()}
                disabled={!guess.trim()}
              >
                {t("guess")}
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="suggestions" role="listbox">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    role="option"
                    aria-selected={index === suggestIndex}
                    className={index === suggestIndex ? "active" : ""}
                    onClick={() => submitGuess(item.cleanVal)}
                  >
                    <strong>{item.primary}</strong>
                    <span>{item.secondary}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="unified-action-row">
              <button
                type="button"
                className="unified-skip-btn"
                onClick={skipReveal}
                disabled={attempts.length >= 5}
              >
                <IconSkipForward size={14} />
                <span>{locale === "ko" ? "넘기기 (+1 단계)" : "Skip (+1 reveal)"}</span>
              </button>

              <div
                className="attempt-dots-track"
                role="status"
                aria-label={`Attempt ${attempts.length + 1} of 5`}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const att = attempts[i];
                  const isCurrent = i === attempts.length && !finished;
                  const isCorrect = att && solved && i === attempts.length - 1;
                  const isSkipped = att === "Skipped" || att === "건너뜀";
                  return (
                    <span
                      key={i}
                      className={`attempt-dot ${
                        att
                          ? isCorrect
                            ? "correct"
                            : isSkipped
                              ? "skipped"
                              : "wrong"
                          : isCurrent
                            ? "current"
                            : "empty"
                      }`}
                      title={att ? `${i + 1}: ${att}` : `Step ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {notice && <div className="game-notice">{notice}</div>}
        {shareNotice && <div className="game-notice" style={{ background: "#FEF3C7", color: "#92400E" }}>{shareNotice}</div>}

        <div className="clue-row">
          {payload.clues.map((clue) => {
            const unlocked = attempts.length >= clue.unlockAfterAttempt;
            const used = usedClues.includes(clue.id);
            return (
              <button
                key={clue.id}
                type="button"
                className={`clue ${used ? "revealed" : ""} ${unlocked ? "unlocked" : ""}`}
                disabled={!unlocked || used}
                onClick={() => useClue(clue.id)}
              >
                <div className="clue-header">
                  <span>{localizeClueLabel(clue.label, locale)}</span>
                  {used ? <IconUnlock size={14} /> : <IconLock size={14} />}
                </div>
                <strong>
                  {used ? clue.value : unlocked ? (locale === "ko" ? "힌트 열기" : "Reveal hint") : (locale === "ko" ? "잠김" : "Locked")}
                </strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
            <h3>{displayTitle}</h3>
            <p>{subTitle} ({payload.category})</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                className="result-share-btn"
                style={{ background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                onClick={handleShareResult}
              >
                <IconShare size={15} /> {t("shareResult")}
              </button>
              <button
                type="button"
                className="result-share-btn"
                style={{ background: "var(--paper-soft)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 8, padding: "10px 14px", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                onClick={handleShareChallenge}
              >
                ⚔️ {t("challengeFriend")}
              </button>
            </div>
          </div>
        )}

        <div className="attempts">
          {attempts.map((item, idx) => (
            <div className="attempt" key={idx}>
              <span>{String(idx + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
