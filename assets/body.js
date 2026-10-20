/* REBOUND — abstract anatomical mannequin (front/back), used both as heat map and as picker.
   Front view: athlete's RIGHT is on the viewer's LEFT. Back view: athlete's right is on the viewer's right. */

const Body = (() => {
  const cap = (x1, y1, x2, y2, r) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const nx = (-dy / L) * r, ny = (dx / L) * r;
    return `M${x1 + nx},${y1 + ny} L${x2 + nx},${y2 + ny} A${r},${r} 0 0 1 ${x2 - nx},${y2 - ny} L${x1 - nx},${y1 - ny} A${r},${r} 0 0 1 ${x1 + nx},${y1 + ny}Z`;
  };
  const rr = (x, y, w, h, r) => `M${x + r},${y}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(w - 2 * r)}a${r},${r} 0 0 1 ${-r},${-r}v${-(h - 2 * r)}a${r},${r} 0 0 1 ${r},${-r}Z`;
  const circ = (cx, cy, r) => `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
  const ell = (cx, cy, rx, ry) => `M${cx - rx},${cy}a${rx},${ry} 0 1 0 ${2 * rx},0a${rx},${ry} 0 1 0 ${-2 * rx},0Z`;

  // Limb geometry for the viewer-left side; mirrored at x = 120.
  const limbs = (front) => [
    ["shoulder", circ(84, 104, 15)],
    ["upperarm", cap(76, 124, 70, 182, 11)],
    ["elbow", circ(68, 196, 10)],
    ["forearm", cap(66, 212, 60, 260, 9)],
    ["hand", ell(58, 284, 10, 15)],
    front ? ["thigh_ant", cap(106, 258, 103, 334, 17)] : ["thigh_post", cap(106, 262, 103, 334, 17)],
    ["knee", circ(103, 356, 13)],
    front ? ["lowerleg", cap(103, 378, 104, 438, 11)] : ["calf", cap(103, 378, 104, 440, 12.5)],
    ["ankle", circ(104, 456, 8)],
    ["foot", front ? ell(104, 476, 10, 9) : ell(104, 474, 9, 8)],
  ];
  const mirror = (d) => d.replace(/([MLA])([^MLAZahv]*)/g, (m, cmd, args) => {
    const n = args.trim().split(/[\s,]+/).map(Number);
    if (cmd === "A") { const [rx, ry, rot, la, sw, x, y] = n; return `A${rx},${ry} ${rot} ${la} ${sw ? 0 : 1} ${240 - x},${y}`; }
    return `${cmd}${240 - n[0]},${n[1]}`;
  }).replace(/([ahv])([^MLAZahv]*)/g, (m, cmd, args) => {
    const n = args.trim().split(/[\s,]+/).map(Number);
    if (cmd === "a") { const [rx, ry, rot, la, sw, x, y] = n; return `a${rx},${ry} ${rot} ${la} ${sw ? 0 : 1} ${-x},${y}`; }
    if (cmd === "h") return `h${-n[0]}`;
    return m;
  });

  function shapes(view) {
    const front = view === "front";
    const leftSide = front ? "R" : "L", rightSide = front ? "L" : "R";
    const out = [
      { r: "head", s: "C", d: ell(120, 46, 23, 27) },
      { r: "neck", s: "C", d: cap(120, 76, 120, 90, 10) },
      { r: front ? "chest" : "thoracic", s: "C", d: rr(93, 92, 54, 58, 16) },
      { r: front ? "abdomen" : "lumbar", s: "C", d: rr(97, 154, 46, 52, 14) },
    ];
    if (front) { out.push({ r: "groin", s: leftSide, d: rr(95, 210, 23, 34, 11) }, { r: "groin", s: rightSide, d: rr(122, 210, 23, 34, 11) }); }
    else { out.push({ r: "hip", s: leftSide, d: rr(94, 210, 24, 42, 12) }, { r: "hip", s: rightSide, d: rr(122, 210, 24, 42, 12) }); }
    for (const [r, d] of limbs(front)) { out.push({ r, s: leftSide, d }, { r, s: rightSide, d: mirror(d) }); }
    return out;
  }

  const key = (r, s) => `${r}:${s}`;

  /** heat: {"ankle:R": n}; opts: {view, interactive, selected:{region,side}, max, compact} */
  function svg(view, opts = {}) {
    const { heat = {}, selected, interactive, max = Math.max(1, ...Object.values(heat)), label = true } = opts;
    const parts = shapes(view).map(({ r, s, d }) => {
      const k = key(r, s), v = heat[k] || 0, t = v / max;
      const sel = selected && selected.region === r && (selected.side === s || s === "C");
      const style = v ? `--heat:${(0.18 + t * 0.82).toFixed(3)}` : "";
      return `<path class="bm-part${v ? " hot" : ""}${sel ? " sel" : ""}${t > 0.6 ? " peak" : ""}" d="${d}" data-region="${r}" data-side="${s}" data-count="${v}" style="${style}"${interactive ? ' tabindex="0" role="button"' : ""} aria-label="${REGIONS[r]}${s !== "C" ? (s === "R" ? " sağ" : " sol") : ""}${v ? ", " + v : ""}"></path>`;
    }).join("");
    const lbl = label ? `<text x="${view === "front" ? 30 : 210}" y="494" class="bm-side">SAĞ</text><text x="${view === "front" ? 210 : 30}" y="494" class="bm-side">SOL</text>` : "";
    return `<svg class="bodymap${interactive ? " interactive" : ""}" viewBox="0 0 240 500" data-view="${view}" aria-label="${view === "front" ? "Ön" : "Arka"} görünüm">
      <defs><radialGradient id="bmglow-${view}" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="var(--blue)" stop-opacity=".10"/><stop offset="100%" stop-color="var(--blue)" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="120" cy="250" rx="118" ry="240" fill="url(#bmglow-${view})"/>
      <g class="bm-grid">${Array.from({ length: 11 }, (_, i) => `<line x1="0" x2="240" y1="${i * 50}" y2="${i * 50}"/>`).join("")}</g>
      ${parts}${lbl}</svg>`;
  }

  function heatFrom(injuries) {
    const h = {};
    for (const i of injuries) {
      const k = key(i.region, ["head", "neck", "chest", "abdomen", "thoracic", "lumbar"].includes(i.region) ? "C" : i.side);
      h[k] = (h[k] || 0) + 1;
    }
    return h;
  }

  const hasView = (region, view) => shapes(view).some((x) => x.r === region);

  return { svg, heatFrom, hasView };
})();
