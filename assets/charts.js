/* REBOUND — dependency-free SVG charts. Animations are CSS-driven (transform/opacity/dashoffset only). */

const Charts = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n, d = 0) => Number(n).toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

  function ring(value, { size = 148, stroke = 10, label = "", sub = "" } = {}) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, value)));
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <defs><linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--blue-2)"/><stop offset="1" stop-color="var(--blue)"/></linearGradient></defs>
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line-2)" stroke-width="${stroke}"/>
        <circle class="ring-val" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#ringg)" stroke-width="${stroke}" stroke-linecap="round"
          stroke-dasharray="${c}" stroke-dashoffset="${c}" style="--off:${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      </svg>
      <div class="ring-label"><b class="tnum" data-count="${Math.round(value * 100)}" data-suffix="%">0%</b><span>${esc(label)}</span>${sub ? `<em>${esc(sub)}</em>` : ""}</div>
    </div>`;
  }

  /** series: [{label, values:[a,b], tip}], keys: [{label, cls}] */
  function stacked(series, keys, { h = 180 } = {}) {
    const max = Math.max(1, ...series.map((s) => s.values.reduce((a, b) => a + b, 0)));
    const nice = Math.ceil(max / 2) * 2;
    const grid = [0, 0.5, 1].map((t) => `<div class="sb-grid" style="bottom:${t * 100}%"><span class="tnum">${Math.round(nice * t)}</span></div>`).join("");
    const cols = series.map((s, i) => {
      let acc = 0;
      const segs = s.values.map((v, k) => {
        const seg = `<i class="sb-seg ${keys[k].cls}" style="height:${(v / nice) * 100}%;bottom:${(acc / nice) * 100}%"></i>`;
        acc += v; return v ? seg : "";
      }).join("");
      return `<div class="sb-col" style="--d:${i * 28}ms" data-tip="${esc(s.tip)}"><div class="sb-bar">${segs}</div><span class="sb-x">${esc(s.label)}</span></div>`;
    }).join("");
    return `<div class="stacked" style="height:${h}px"><div class="sb-plot">${grid}<div class="sb-cols">${cols}</div></div></div>`;
  }

  function donut(items, { size = 150, stroke = 18, center = "", centerSub = "" } = {}) {
    const total = items.reduce((s, x) => s + x.value, 0) || 1;
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, gap = 3;
    let acc = 0;
    const arcs = items.map((x, i) => {
      const len = (x.value / total) * c;
      const a = `<circle class="donut-seg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${x.color}" stroke-width="${stroke}"
        stroke-dasharray="${Math.max(0, len - gap)} ${c}" stroke-dashoffset="${-acc}" style="--d:${i * 90}ms" data-tip="${esc(x.label)}: ${x.value} (${Math.round((x.value / total) * 100)}%)"
        transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
      acc += len; return a;
    }).join("");
    const legend = items.map((x) => `<li><i style="background:${x.color}"></i><span>${esc(x.label)}</span><b class="tnum">${x.value}</b></li>`).join("");
    return `<div class="donut"><div class="donut-fig" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}">${arcs}</svg>
      <div class="donut-c"><b class="tnum">${esc(center)}</b><span>${esc(centerSub)}</span></div></div><ul class="legend">${legend}</ul></div>`;
  }

  function hbars(items, { unit = "" } = {}) {
    const max = Math.max(1, ...items.map((x) => x.value));
    return `<ul class="hbars">${items.map((x, i) => `<li data-tip="${esc(x.tip || x.label + ": " + x.value + unit)}">
      <span class="hb-l">${esc(x.label)}</span>
      <span class="hb-track"><i style="--w:${(x.value / max) * 100}%;--d:${i * 50}ms"${x.alt ? ' class="alt"' : ""}></i></span>
      <b class="tnum">${fmt(x.value)}${unit}</b></li>`).join("")}</ul>`;
  }

  function spark(values, { w = 120, h = 36 } = {}) {
    const max = Math.max(1, ...values), step = w / Math.max(1, values.length - 1);
    const pts = values.map((v, i) => [i * step, h - 4 - (v / max) * (h - 8)]);
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none">
      <path d="${d}L${w},${h}L0,${h}Z" class="spark-area"/><path d="${d}" class="spark-line" pathLength="1"/></svg>`;
  }

  /** rows: [{player, injuries:[...]}], range {start,end} */
  function gantt(rows, range, { onName } = {}) {
    const total = Math.max(1, diffDays(range.start, range.end));
    const months = [];
    let d = parse(range.start); d.setDate(1);
    while (iso(d) <= range.end) {
      const s = iso(d) < range.start ? range.start : iso(d);
      months.push({ left: (diffDays(range.start, s) / total) * 100, label: d.toLocaleDateString("tr-TR", { month: "short" }) });
      d.setMonth(d.getMonth() + 1);
    }
    const todayPct = (diffDays(range.start, todayISO) / total) * 100;
    const head = `<div class="gt-row gt-head"><div class="gt-name"></div><div class="gt-track">${months.map((m) => `<span class="gt-m" style="left:${m.left}%">${m.label}</span>`).join("")}</div></div>`;
    const body = rows.map((r, ri) => `<div class="gt-row" style="--d:${ri * 22}ms">
      <button class="gt-name" data-player="${r.player.id}"><span class="gt-no mono">${r.player.no}</span>${esc(r.player.name)}</button>
      <div class="gt-track">${months.map((m) => `<i class="gt-vl" style="left:${m.left}%"></i>`).join("")}
        ${todayPct > 0 && todayPct < 100 ? `<i class="gt-today" style="left:${todayPct}%"></i>` : ""}
        ${r.injuries.map((i) => {
          const s = i.date < range.start ? range.start : i.date;
          const eRaw = i.rtpDate || todayISO; const e = eRaw > range.end ? range.end : eRaw;
          const left = (diffDays(range.start, s) / total) * 100;
          const width = Math.max(0.6, (Math.max(1, diffDays(s, e)) / total) * 100);
          const sev = SEVERITY(M.days(i), i.timeLoss);
          return `<button class="gt-bar sev${sev.id}${M.active(i) ? " live" : ""}" style="left:${left}%;width:${width}%" data-injury="${i.id}"
            data-tip="${esc((i.diagnosis || "Değerlendirme bekliyor") + " · " + M.days(i) + " gün")}"></button>`;
        }).join("")}
      </div></div>`).join("");
    return `<div class="gantt">${head}${body}</div>`;
  }

  return { ring, stacked, donut, hbars, spark, gantt, esc, fmt };
})();
