"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

export function SplashIntro() {
  const [shown, setShown] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("hl-intro")) { setShown(false); return; }
    window.sessionStorage.setItem("hl-intro", "1");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced || document.documentElement.dataset.motion === "static" ? 0 : document.documentElement.dataset.motion === "simple" ? 1200 : 2600;
    if (!duration) { setShown(false); return; }
    const dismiss = () => { setExiting(true); window.setTimeout(() => setShown(false), 240); };
    const timer = window.setTimeout(dismiss, duration);
    window.addEventListener("scroll", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    window.addEventListener("keydown", dismiss, { once: true });
    document.addEventListener("pointerdown", dismiss, { capture: true, once: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", dismiss); window.removeEventListener("touchstart", dismiss); window.removeEventListener("keydown", dismiss); document.removeEventListener("pointerdown", dismiss, true); };
  }, []);

  if (!shown) return null;
  return <div className={`splash-intro${exiting ? " is-exiting" : ""}`} aria-hidden="true">
    <div className="splash-veil" />
    <div className="splash-stage">
      <div className="splash-vignette" />
      <div className="splash-thread" />
      <svg className="splash-leg-svg" viewBox="0 0 300 900" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <defs>
          <linearGradient id="splash-fabric" x1="0" x2="1"><stop offset="0" stopColor="#0d090c" stopOpacity=".82" /><stop offset=".5" stopColor="#8f7770" stopOpacity=".45" /><stop offset="1" stopColor="#120d10" stopOpacity=".88" /></linearGradient>
          <linearGradient id="splash-sheen-gradient" x1="0" x2="1"><stop offset="0" stopColor="#fff4e6" stopOpacity="0" /><stop offset=".5" stopColor="#fff4e6" stopOpacity=".52" /><stop offset="1" stopColor="#fff4e6" stopOpacity="0" /></linearGradient>
          <pattern id="splash-knit" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0L5 5M5 0L0 5" stroke="#fff4e6" strokeOpacity=".09" strokeWidth=".45" /></pattern>
          <clipPath id="splash-leg-clip"><path d="M119 67C112 140 117 216 129 291C137 340 128 379 119 422C108 477 105 536 116 600C125 650 143 691 151 726C158 759 152 792 137 817C125 838 104 851 81 858C63 864 47 859 41 848C35 837 46 827 64 816L105 785C116 775 119 759 114 734L87 608C74 545 69 480 79 414C86 360 101 321 100 274C98 204 92 136 94 72Z" /></clipPath>
        </defs>
        <path className="splash-leg-fill" d="M119 67C112 140 117 216 129 291C137 340 128 379 119 422C108 477 105 536 116 600C125 650 143 691 151 726C158 759 152 792 137 817C125 838 104 851 81 858C63 864 47 859 41 848C35 837 46 827 64 816L105 785C116 775 119 759 114 734L87 608C74 545 69 480 79 414C86 360 101 321 100 274C98 204 92 136 94 72Z" />
        <g clipPath="url(#splash-leg-clip)"><rect className="splash-fabric" x="35" y="50" width="140" height="830" fill="url(#splash-fabric)" /><rect className="splash-knit" x="35" y="50" width="140" height="830" fill="url(#splash-knit)" /><rect className="splash-roll-edge" x="35" y="50" width="140" height="9" /></g>
        <path className="splash-rim-glow" pathLength="1" d="M119 67C112 140 117 216 129 291C137 340 128 379 119 422C108 477 105 536 116 600C125 650 143 691 151 726C158 759 152 792 137 817" />
        <path className="splash-rim" pathLength="1" d="M119 67C112 140 117 216 129 291C137 340 128 379 119 422C108 477 105 536 116 600C125 650 143 691 151 726C158 759 152 792 137 817" />
        <path className="splash-seam" pathLength="1" d="M94 72C92 136 98 204 100 274C101 321 86 360 79 414C69 480 74 545 87 608L114 734C119 759 116 775 105 785L64 816" />
        <path className="splash-stitches" d="M94 72C92 136 98 204 100 274C101 321 86 360 79 414C69 480 74 545 87 608L114 734C119 759 116 775 105 785L64 816" />
        <rect className="splash-sheen" x="80" y="60" width="26" height="820" fill="url(#splash-sheen-gradient)" clipPath="url(#splash-leg-clip)" />
      </svg>
      <div className="splash-lace" />
      <div className="splash-sheen-trace" />
      <div className="splash-denier" aria-hidden="true"><span>5D</span><span>10D</span><span>15D</span><span>20D</span></div>
    </div>
    <div className="splash-scrim" />
    <button aria-hidden="false" type="button" onClick={() => { setExiting(true); window.setTimeout(() => setShown(false), 240); }}>跳过</button>
  </div>;
}
