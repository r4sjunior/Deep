import { S } from "./store.js";
import { perfil, nomesTop } from "./regras.js";
import { ORDEM, PERFIS } from "../data/perfis.js";
import { CONTATO } from "../data/jornada.jsx";

const carregar = (src) =>
  new Promise((ok, erro) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = erro;
    im.src = src;
  });

function rr(cx, x, y, w, h, r) {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.arcTo(x + w, y, x + w, y + h, r);
  cx.arcTo(x + w, y + h, x, y + h, r);
  cx.arcTo(x, y + h, x, y, r);
  cx.arcTo(x, y, x + w, y, r);
  cx.closePath();
}

function cover(cx, im, x, y, w, h) {
  const s = Math.max(w / im.width, h / im.height);
  const sw = w / s, sh = h / s;
  cx.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, x, y, w, h);
}

function espacado(cx, txt, x, y, gap) {
  // texto com espaçamento entre letras, centralizado em x
  const larg = [...txt].reduce((a, c) => a + cx.measureText(c).width + gap, -gap);
  let px = x - larg / 2;
  for (const c of txt) { cx.fillText(c, px, y); px += cx.measureText(c).width + gap; }
}

/** Gera o card 1080×1920 do perfil, no visual do livro, para Stories. Devolve um Blob PNG. */
export async function gerarCard() {
  const { pct, top } = perfil();
  const P = PERFIS[top[0]];
  await Promise.all([
    document.fonts.load('500 120px "Playfair Display"'),
    document.fonts.load('italic 400 40px "Playfair Display"'),
    document.fonts.load('600 30px "Jost"'),
    document.fonts.load('400 80px "Pinyon Script"')
  ]).catch(() => {});
  const [foto, logo] = await Promise.all([carregar(P.img), carregar("img/logo.png")]);

  const W = 1080, H = 1920;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const cx = c.getContext("2d");

  // fundo: mar noturno com luz ameixa
  const g = cx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1d3a50"); g.addColorStop(0.45, "#0b1522"); g.addColorStop(1, "#2e1a29");
  cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  const rg = cx.createRadialGradient(W / 2, 760, 50, W / 2, 760, 760);
  rg.addColorStop(0, "rgba(231,197,100,.22)"); rg.addColorStop(1, "rgba(231,197,100,0)");
  cx.fillStyle = rg; cx.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) {
    cx.fillStyle = `rgba(249,232,185,${0.15 + Math.random() * 0.45})`;
    cx.beginPath(); cx.arc(Math.random() * W, Math.random() * H, 0.8 + Math.random() * 2.6, 0, 7); cx.fill();
  }

  // topo
  cx.textAlign = "left"; cx.textBaseline = "alphabetic";
  cx.fillStyle = "#e7c564"; cx.font = '600 30px "Jost"';
  espacado(cx, "MÉTODO DEEP · MEU PERFIL", W / 2, 150, 7);

  // ilustração do animal com moldura dourada
  const ix = 110, iy = 210, iw = 860, ih = 900;
  cx.save();
  cx.shadowColor = "rgba(0,0,0,.55)"; cx.shadowBlur = 60; cx.shadowOffsetY = 30;
  rr(cx, ix, iy, iw, ih, 44); cx.fillStyle = "#000"; cx.fill();
  cx.restore();
  cx.save(); rr(cx, ix, iy, iw, ih, 44); cx.clip(); cover(cx, foto, ix, iy, iw, ih);
  const fade = cx.createLinearGradient(0, iy + ih * 0.45, 0, iy + ih);
  fade.addColorStop(0, "rgba(11,21,34,0)"); fade.addColorStop(1, "rgba(11,21,34,.92)");
  cx.fillStyle = fade; cx.fillRect(ix, iy, iw, ih);
  cx.restore();
  rr(cx, ix + 16, iy + 16, iw - 32, ih - 32, 32);
  cx.strokeStyle = "rgba(249,232,185,.55)"; cx.lineWidth = 2; cx.stroke();

  // placas do livro (ameixa + ocre)
  const nome = nomesTop(top);
  cx.font = '600 92px "Playfair Display"';
  const pw = Math.min(cx.measureText(nome).width + 80, iw - 40);
  cx.fillStyle = "#5b3851"; cx.fillRect(ix - 30, iy + ih - 300, pw, 128);
  cx.fillStyle = "#f5ecd4"; cx.textAlign = "left"; cx.fillText(nome, ix + 10, iy + ih - 207, pw - 70);
  const sub = P.tags.join(" · ");
  cx.font = '400 40px "Playfair Display"';
  const sw = cx.measureText(sub).width + 70;
  cx.fillStyle = "#c4973d"; cx.fillRect(ix - 30, iy + ih - 172, sw, 74);
  cx.fillStyle = "#fff8ea"; cx.fillText(sub, ix + 10, iy + ih - 122);

  // porcentagem
  cx.textAlign = "center";
  cx.fillStyle = "#f9e8b9"; cx.font = '500 190px "Playfair Display"';
  cx.shadowColor = "rgba(231,197,100,.5)"; cx.shadowBlur = 40;
  cx.fillText(`${pct[top[0]]}%`, W / 2, 1300);
  cx.shadowBlur = 0;
  cx.fillStyle = "rgba(245,236,212,.75)"; cx.font = 'italic 400 40px "Playfair Display"';
  cx.fillText(top.length > 1 ? "perfis predominantes hoje" : "é o meu perfil predominante hoje", W / 2, 1370);

  // barras dos quatro perfis
  const ord = [...ORDEM].sort((a, b) => pct[b] - pct[a]);
  ord.forEach((k, i) => {
    const y = 1440 + i * 68;
    cx.textAlign = "left"; cx.fillStyle = "#f5ecd4"; cx.font = '500 38px "Playfair Display"';
    cx.fillText(PERFIS[k].nome, 150, y + 12);
    rr(cx, 400, y - 10, 440, 16, 8); cx.fillStyle = "rgba(245,236,212,.12)"; cx.fill();
    rr(cx, 400, y - 10, Math.max(16, (440 * pct[k]) / 100), 16, 8); cx.fillStyle = PERFIS[k].hex; cx.fill();
    cx.textAlign = "right"; cx.fillStyle = "#f9e8b9"; cx.font = '600 34px "Jost"';
    cx.fillText(`${pct[k]}%`, 935, y + 12);
  });

  // rodapé com a marca: logo, assinatura e Instagram
  const lw = 96, lh = lw * (logo.height / logo.width);
  cx.drawImage(logo, W / 2 - lw / 2, 1688, lw, lh);
  cx.textAlign = "center";
  cx.fillStyle = "#f9e8b9"; cx.font = '400 66px "Pinyon Script"';
  cx.fillText("Ita Batista", W / 2, 1688 + lh + 62);
  cx.fillStyle = "rgba(245,236,212,.75)"; cx.font = '500 26px "Jost"';
  cx.fillText(`@${CONTATO.insta}${S.nome ? "  ·  " + S.nome : ""}`, W / 2, 1688 + lh + 108);

  return new Promise((ok) => c.toBlob(ok, "image/png"));
}
