"use client";

import { useState, useTransition } from "react";
import { createDrama } from "@/app/admin/dramas/actions";

export function CreateDramaForm() {
  const [pending, startTransition] = useTransition();
  const [titleKr, setTitleKr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [year, setYear] = useState("");
  const [network, setNetwork] = useState("");
  const [msg, setMsg] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await createDrama({
          titleKr,
          titleEn,
          year: year ? Number(year) : null,
          network: network || null,
          genres: [],
          aliases: [titleKr, titleEn].filter(Boolean),
          status: "draft",
        });
        setTitleKr("");
        setTitleEn("");
        setYear("");
        setNetwork("");
        setMsg("Drama saved.");
      } catch (error) {
        setMsg(error instanceof Error ? error.message : "Save failed");
      }
    });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="field">
        <label>Title (KR)</label>
        <input value={titleKr} onChange={(e) => setTitleKr(e.target.value)} required />
      </div>
      <div className="field">
        <label>Title (EN)</label>
        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
      </div>
      <div className="field">
        <label>Year</label>
        <input value={year} onChange={(e) => setYear(e.target.value)} />
      </div>
      <div className="field">
        <label>Network / OTT</label>
        <input value={network} onChange={(e) => setNetwork(e.target.value)} />
      </div>
      <div className="full">
        <button className="primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save drama"}
        </button>
        {msg && <p className="game-notice">{msg}</p>}
      </div>
    </form>
  );
}
