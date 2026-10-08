"use client";

import { useEffect, useRef } from "react";

type GalleryMode = "denier" | "finish";

type Props = {
  mode: GalleryMode;
  label: string;
};

type PaletteRecord = {
  den: number;
  hex: string;
  fin_code: string;
  label: string;
  secondary: string;
};

const DENIER_RECORDS: PaletteRecord[] = [5, 10, 15, 20, 40, 80, 100, 200].map((den) => ({
  den,
  hex: "#1A1718",
  fin_code: "semi_matte",
  label: `${den}D`,
  secondary: "α",
}));

const FINISH_RECORDS: PaletteRecord[] = [
  ["哑光", "matte"],
  ["柔光", "semi_matte"],
  ["缎光", "satin"],
  ["亮光", "glossy"],
  ["高光", "high_shine"],
  ["湿感", "wet_look"],
  ["闪光", "shimmer"],
].map(([label, fin_code]) => ({
  den: 20,
  hex: "#2A2829",
  fin_code,
  label,
  secondary: fin_code,
}));

const FIN: Record<string, [number, number]> = {
  matte: [0, 0.3],
  semi_matte: [0.08, 0.34],
  satin: [0.18, 0.26],
  glossy: [0.3, 0.15],
  high_shine: [0.48, 0.08],
  wet_look: [0.65, 0.05],
  shimmer: [0.12, 0.3],
};

const hex2rgb = (hex: string) => {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
};

const alphaD = (denier: number) => 0.18 + 0.78 * (1 - Math.exp(-denier / 32));

const legWidth = (t: number) => {
  const knots = [[0, 1], [0.18, 0.9], [0.42, 0.62], [0.5, 0.58], [0.62, 0.66], [0.72, 0.6], [0.9, 0.36], [1, 0.3]];
  for (let index = 1; index < knots.length; index += 1) {
    if (t <= knots[index][0]) {
      const [a, aw] = knots[index - 1];
      const [b, bw] = knots[index];
      const u = (t - a) / (b - a);
      const smooth = u * u * (3 - 2 * u);
      return aw + (bw - aw) * smooth;
    }
  }
  return 0.3;
};

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

function drawLeg(canvas: HTMLCanvasElement, record: PaletteRecord, keyX: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  const width = 64;
  const height = 240;
  const W = Math.round(width * dpr);
  const H = Math.round(height * dpr);
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }
  const image = ctx.createImageData(W, H);
  const pixels = image.data;
  const skin = hex2rgb("#D4A28A");
  const hose = hex2rgb(record.hex);
  const alpha = alphaD(record.den);
  const [sheenIntensity, sheenWidth] = FIN[record.fin_code] || FIN.matte;
  const key = [1, 0.886, 0.761];
  const rim = [0.906, 0.639, 0.627];
  const maxHalfWidth = W * 0.42;
  const center = W / 2;

  for (let y = 0; y < H; y += 1) {
    const t = y / (H - 1);
    const halfWidth = Math.max(1, maxHalfWidth * legWidth(t));
    for (let x = 0; x < W; x += 1) {
      const index = (y * W + x) * 4;
      const nx = (x - center) / halfWidth;
      if (Math.abs(nx) > 1) {
        pixels[index + 3] = 0;
        continue;
      }
      const nz = Math.sqrt(1 - nx * nx);
      const diffuse = Math.max(0, nx * -0.55 + nz * 0.83) * 0.82 + 0.18;
      const rimLight = Math.pow(Math.max(0, nx), 6) * 0.55;
      let color = [0, 1, 2].map((channel) => (skin[channel] / 255) * diffuse * key[channel]);
      const coverage = 1 - Math.pow(1 - alpha, 1 / Math.max(nz, 0.15));
      const hoseColor = [0, 1, 2].map((channel) => (hose[channel] / 255) * diffuse * key[channel]);
      color = color.map((value, channel) => value * (1 - coverage) + hoseColor[channel] * coverage);
      if (sheenIntensity > 0) {
        const sheen = Math.exp(-Math.pow((nx - keyX) / sheenWidth, 2)) * sheenIntensity * (0.55 + 0.45 * coverage);
        let glow = sheen;
        if (record.fin_code === "high_shine") glow += Math.exp(-Math.pow((nx - keyX - 0.35) / 0.06, 2)) * sheenIntensity * 0.35;
        if (record.fin_code === "wet_look") glow += Math.pow(1 - nz, 4) * 0.35;
        if (record.fin_code === "shimmer" && hash(x, y) > 0.985) glow += 0.7 * Math.max(0, 1 - Math.abs(nx - keyX));
        color = color.map((value) => value + glow);
      }
      color = color.map((value, channel) => value + rimLight * rim[channel] * 0.6);
      const vertical = 0.92 + 0.08 * Math.cos(t * Math.PI * 0.9);
      pixels[index] = Math.min(255, color[0] * vertical * 255);
      pixels[index + 1] = Math.min(255, color[1] * vertical * 255);
      pixels[index + 2] = Math.min(255, color[2] * vertical * 255);
      pixels[index + 3] = Math.min(255, (1 - Math.abs(nx)) * halfWidth * 255 * 1.2);
    }
  }
  ctx.putImageData(image, 0, 0);
}

export function AnimatedGallery({ mode, label }: Props) {
  const records = mode === "denier" ? DENIER_RECORDS : FINISH_RECORDS;
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const pointerX = useRef(-0.35);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let lastDraw = -1;
    const render = (time: number) => {
      if (reducedMotion || lastDraw < 0 || time - lastDraw > 55) {
        const automaticLight = -0.6 + (Math.sin(time * 0.00045) + 1) * 0.42;
        const keyX = pointerX.current === -0.35 ? automaticLight : pointerX.current;
        canvasRefs.current.forEach((canvas, index) => { if (canvas) drawLeg(canvas, records[index], keyX); });
        lastDraw = time;
      }
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [records]);

  return (
    <div
      className="palette-gallery"
      role="img"
      aria-label={label}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.current = -0.65 + ((event.clientX - rect.left) / rect.width) * 0.75;
      }}
      onPointerLeave={() => { pointerX.current = -0.35; }}
    >
      {records.map((record, index) => (
        <div className="palette-leg" key={`${mode}-${record.label}`}>
          <canvas ref={(canvas) => { canvasRefs.current[index] = canvas; }} aria-hidden="true" />
          <div className="palette-plinth" />
          <strong>{record.label}</strong>
          <span>{mode === "denier" ? `${record.secondary} ${alphaD(record.den).toFixed(2)}` : record.secondary}</span>
        </div>
      ))}
    </div>
  );
}
