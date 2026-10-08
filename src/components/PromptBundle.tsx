import { CopyPromptButton } from "./CopyPromptButton";
import type { Locale } from "@/lib/i18n";

type Props = { code: string; source?: "catalog" | "guide" | "learn" | "look"; surface?: "catalog" | "detail" | "similar"; locale?: Locale };

export function PromptBundle({ code, source = "catalog", surface = "detail", locale = "zh" }: Props) {
  return <div className="prompt-actions" aria-label={locale === "en" ? "Copy prompts" : "复制提示词"}><CopyPromptButton code={code} kind="hosiery" source={source} surface={surface} locale={locale} /><CopyPromptButton code={code} kind="full" source={source} surface={surface} locale={locale} /></div>;
}
