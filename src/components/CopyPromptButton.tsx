"use client";

import { useState } from "react";

type Props = { code: string; kind?: "full" | "snippet"; compact?: boolean };

function promptUrl(code: string) {
  return `/archive/metadata/${code}-product-v1.json`;
}

export function CopyPromptButton({ code, kind = "full", compact = false }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "missing">("idle");

  async function copy() {
    try {
      const response = await fetch(promptUrl(code));
      if (!response.ok) throw new Error("missing");
      const metadata = await response.json() as { positive_prompt?: string; prompt?: string; product_prompt?: string };
      const text = kind === "snippet" ? metadata.product_prompt : metadata.positive_prompt ?? metadata.prompt;
      if (!text) throw new Error("missing");
      await navigator.clipboard.writeText(text);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("missing");
      window.setTimeout(() => setState("idle"), 2200);
    }
  }

  const label = state === "copied" ? "✓ 已复制" : state === "missing" ? "暂无 prompt" : kind === "snippet" ? "复制丝袜" : "复制整图";
  return <button type="button" className={`copy-prompt-button${compact ? " compact" : ""}`} onClick={copy} disabled={state === "missing"}>{label}</button>;
}
