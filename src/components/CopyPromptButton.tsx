"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

type PromptKind = "full" | "body" | "hosiery" | "snippet";
type Props = { code: string; kind?: PromptKind; compact?: boolean; source?: "catalog" | "guide" | "learn" | "look"; surface?: "catalog" | "detail" | "similar"; locale?: Locale };

function promptUrl(code: string) {
  return `/data/copy/${code}.json`;
}

export function CopyPromptButton({ code, kind = "full", compact = false, source = "catalog", surface = "catalog", locale = "zh" }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "missing">("idle");

  async function copy() {
    try {
      const response = await fetch(promptUrl(code));
      if (!response.ok) throw new Error("missing");
      const metadata = await response.json() as { prompts?: { full?: string | null; hosiery?: string | null }; original_prompt?: string; full_body_prompt?: string; hosiery_prompt?: string; positive_prompt?: string; prompt?: string; product_prompt?: string };
      const text = kind === "body" ? metadata.prompts?.full ?? metadata.full_body_prompt : kind === "hosiery" || kind === "snippet" ? metadata.prompts?.hosiery ?? metadata.hosiery_prompt ?? metadata.product_prompt : metadata.prompts?.full ?? metadata.original_prompt ?? metadata.positive_prompt ?? metadata.prompt;
      if (!text) throw new Error("missing");
      await navigator.clipboard.writeText(text);
      trackEvent(kind === "body" ? "copy_body" : kind === "hosiery" || kind === "snippet" ? "copy_hosiery" : "copy_full", { hl_code: code, surface, source });
      setState("copied");
      window.setTimeout(() => setState("idle"), 1500);
    } catch {
      trackEvent("copy_failed", { hl_code: code, kind, surface, source });
      setState("missing");
      window.setTimeout(() => setState("idle"), 2200);
    }
  }

  const label = locale === "en"
    ? state === "copied" ? "✓ Copied" : state === "missing" ? "Prompt unavailable" : kind === "body" ? "Copy full-body" : kind === "hosiery" || kind === "snippet" ? "Copy hosiery" : "Copy full prompt"
    : state === "copied" ? "✓ 已复制" : state === "missing" ? "暂无 prompt" : kind === "body" ? "复制全身 · Full-body" : kind === "hosiery" || kind === "snippet" ? "复制丝袜 · Hosiery" : "复制整图 · Full prompt";
  return <button type="button" className={`copy-prompt-button${compact ? " compact" : ""}`} onClick={copy} disabled={state === "missing"}>{label}</button>;
}

