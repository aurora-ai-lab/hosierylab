"use client";

import { useEffect } from "react";

export function SilkAmbient() {
  useEffect(() => {
    let frame = 0;
    let idleTimer = 0;
    const root = document.documentElement;
    const wake = () => {
      root.classList.remove("is-idle");
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => root.classList.add("is-idle"), 20000);
    };
    const move = (event: MouseEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty("--light-x", `${event.clientX}px`);
        root.style.setProperty("--light-y", `${event.clientY}px`);
        frame = 0;
      });
      wake();
    };
    const activity = () => wake();
    const visibility = () => root.classList.toggle("is-tab-hidden", document.visibilityState !== "visible");
    root.style.setProperty("--light-x", `${window.innerWidth * .28}px`);
    root.style.setProperty("--light-y", `${window.innerHeight * .22}px`);
    wake();
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("pointerdown", activity, { passive: true });
    window.addEventListener("scroll", activity, { passive: true });
    window.addEventListener("keydown", activity, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(idleTimer); window.removeEventListener("mousemove", move); window.removeEventListener("pointerdown", activity); window.removeEventListener("scroll", activity); window.removeEventListener("keydown", activity); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div className="silk-ambient" aria-hidden="true"><i /><i /><i /></div>;
}
