import { useEffect, useRef, useState } from "react";
import { ui, reduz } from "../lib/ui.jsx";

/**
 * Fundo vivo: mar em canvas (raios de luz e partículas subindo) que escurece
 * conforme a profundidade, mais a ilustração da fase desfocada por cima.
 */
export default function Oceano() {
  const cv = useRef(null);
  const alvo = useRef(0);
  const { cena } = ui.use();
  const [img, setImg] = useState(null);
  const [on, setOn] = useState(false);

  useEffect(() => { alvo.current = Math.max(0, Math.min(1, cena.prof)); }, [cena.prof]);

  useEffect(() => {
    if (img === cena.img) return;
    setOn(false);
    const t = setTimeout(() => { setImg(cena.img); setOn(true); }, 250);
    return () => clearTimeout(t);
  }, [cena.img]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const c = cv.current, cx = c.getContext("2d");
    let W = 0, H = 0, d = alvo.current, run = true, raf = 0;
    const P = Array.from({ length: 46 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.8,
      s: 0.00008 + Math.random() * 0.00025, p: Math.random() * 6
    }));
    const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
    const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;
    const TOP0 = [38, 72, 94], TOP1 = [10, 20, 34], BOT0 = [11, 24, 38], BOT1 = [3, 6, 12];

    function size() {
      const r = Math.min(2, devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      c.width = W * r; c.height = H * r;
      cx.setTransform(r, 0, 0, r, 0, 0);
    }
    function draw(t) {
      d += (alvo.current - d) * (reduz ? 1 : 0.025);
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, rgb(mix(TOP0, TOP1, d)));
      g.addColorStop(1, rgb(mix(BOT0, BOT1, d)));
      cx.fillStyle = g;
      cx.fillRect(0, 0, W, H);
      cx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 6; i++) {
        const x = W * (0.1 + i * 0.17) + Math.sin(t * 0.00025 + i * 1.7) * 40, w = 50 + (i % 3) * 30;
        const a = (0.05 - 0.035 * d) * (0.6 + 0.4 * Math.sin(t * 0.0006 + i));
        const rg = cx.createLinearGradient(0, 0, 0, H * 0.85);
        rg.addColorStop(0, `rgba(249,232,185,${a})`);
        rg.addColorStop(1, "rgba(249,232,185,0)");
        cx.fillStyle = rg;
        cx.beginPath();
        cx.moveTo(x - w * 0.3, 0);
        cx.lineTo(x + w * 0.3, 0);
        cx.lineTo(x + w * 1.6 + Math.sin(t * 0.0003 + i) * 60, H * 0.85);
        cx.lineTo(x - w * 1.2, H * 0.85);
        cx.closePath();
        cx.fill();
      }
      for (const p of P) {
        p.y -= p.s * 16;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        const x = (p.x + Math.sin(t * 0.0004 + p.p) * 0.01) * W, y = p.y * H;
        const a = 0.25 + 0.35 * Math.sin(t * 0.002 + p.p) ** 2;
        cx.fillStyle = `rgba(249,232,185,${a * (0.5 + d * 0.6)})`;
        cx.beginPath();
        cx.arc(x, y, p.r, 0, 7);
        cx.fill();
      }
      cx.globalCompositeOperation = "source-over";
    }
    const loop = (t) => { if (!run) return; draw(t); raf = requestAnimationFrame(loop); };
    const onResize = () => { size(); if (reduz) draw(0); };
    const onVis = () => {
      const was = run;
      run = !document.hidden;
      if (run && !was && !reduz) raf = requestAnimationFrame(loop);
    };
    size();
    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    let unsub = () => {};
    if (reduz) { draw(0); unsub = ui.subscribe(() => draw(0)); }
    else raf = requestAnimationFrame(loop);
    return () => {
      run = false;
      cancelAnimationFrame(raf);
      unsub();
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <canvas id="sea" ref={cv} aria-hidden="true" />
      <div id="scene" aria-hidden="true" className={on ? "on" : ""} style={img ? { backgroundImage: `url("${img}")` } : undefined} />
      <div id="grain" aria-hidden="true" />
    </>
  );
}
