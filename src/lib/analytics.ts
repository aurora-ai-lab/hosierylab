export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  const payload = Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));
  const plausible = (window as Window & { plausible?: (event: string, options?: { props?: AnalyticsProps }) => void }).plausible;
  if (plausible) plausible(name, { props: payload });
  window.dispatchEvent(new CustomEvent("hosierylab:analytics", { detail: { name, props: payload } }));
}
