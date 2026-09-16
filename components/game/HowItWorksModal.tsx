"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { IconClose } from "@/components/icons/Icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function HowItWorksModal({ isOpen, onClose }: Props) {
  const { t } = useLocale();

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="how-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-modal-title"
    >
      <div
        className="how-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="how-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <IconClose size={20} />
        </button>

        <div className="how-modal-header">
          <span className="how-modal-eyebrow">DRAMACUT RULES</span>
          <h2 id="how-modal-title" className="how-modal-title">
            {t("howItWorksTitle")}
          </h2>
          <p className="how-modal-sub">{t("howItWorksSubtitle")}</p>
        </div>

        <div className="how-steps-list">
          <div className="how-step-card">
            <div className="how-step-num">01</div>
            <div className="how-step-body">
              <h3>{t("howItWorksRule1Title")}</h3>
              <p>{t("howItWorksRule1Desc")}</p>
            </div>
          </div>

          <div className="how-step-card">
            <div className="how-step-num">02</div>
            <div className="how-step-body">
              <h3>{t("howItWorksRule2Title")}</h3>
              <p>{t("howItWorksRule2Desc")}</p>
            </div>
          </div>

          <div className="how-step-card">
            <div className="how-step-num">03</div>
            <div className="how-step-body">
              <h3>{t("howItWorksRule3Title")}</h3>
              <p>{t("howItWorksRule3Desc")}</p>
            </div>
          </div>
        </div>

        <div className="how-scoring-section">
          <span className="how-scoring-title">POINTS PER ATTEMPT</span>
          <div className="how-scoring-pills">
            <div className="how-score-pill best">
              <span className="cut-num">Cut 1</span>
              <span className="pts-val">25 {t("howItWorksPts")}</span>
            </div>
            <div className="how-score-pill">
              <span className="cut-num">Cut 2</span>
              <span className="pts-val">20 {t("howItWorksPts")}</span>
            </div>
            <div className="how-score-pill">
              <span className="cut-num">Cut 3</span>
              <span className="pts-val">15 {t("howItWorksPts")}</span>
            </div>
            <div className="how-score-pill">
              <span className="cut-num">Cut 4</span>
              <span className="pts-val">10 {t("howItWorksPts")}</span>
            </div>
            <div className="how-score-pill">
              <span className="cut-num">Cut 5</span>
              <span className="pts-val">5 {t("howItWorksPts")}</span>
            </div>
          </div>
        </div>

        <div className="how-modal-footer">
          <button
            type="button"
            className="how-modal-action-btn"
            onClick={onClose}
          >
            {t("howItWorksClose")}
          </button>
        </div>
      </div>
    </div>
  );
}
