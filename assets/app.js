/* PITCHSIDE — application */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = Charts.esc, fmt = Charts.fmt;
  const root = $("#root");

  /* ───────── Icons ───────── */
  const ic = (p, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    logo: ic('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2.6"/>', 20),
    pitch: ic('<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M12 5v14M2.5 9.5h3v5h-3M21.5 9.5h-3v5h3"/><circle cx="12" cy="12" r="2.2"/>'),
    whistle: ic('<path d="M3 11.5a5.5 5.5 0 1 0 11 0V9h7V6H8.5A5.5 5.5 0 0 0 3 11.5z"/><circle cx="8.5" cy="11.5" r="1.4"/>'),
    cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="2"/>'),
    qr: ic('<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 18.5h1.5M18.5 14v1.5"/>'),
    download: ic('<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/>', 16),
    print: ic('<path d="M7 9V4h10v5M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2"/><rect x="7" y="14" width="10" height="6" rx="1"/>', 16),
    link: ic('<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>', 16),
    muscle: ic('<path d="M4 15c2-6 6-9 9-9 2 0 3 1 3 2.5S14.5 11 13 11c3 0 7 1 7 4.5S16 21 11 21c-4 0-7-2-7-6z"/>'),
    grid: ic('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
    users: ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>'),
    list: ic('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>'),
    board: ic('<rect x="3" y="3.5" width="5" height="17" rx="1.5"/><rect x="10" y="3.5" width="5" height="11" rx="1.5"/><rect x="17" y="3.5" width="4" height="14" rx="1.5"/>'),
    inbox: ic('<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19v-6z"/>'),
    clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    search: ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 16),
    sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', 16),
    moon: ic('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', 16),
    out: ic('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/>', 16),
    x: ic('<path d="M6 6l12 12M18 6 6 18"/>', 16),
    check: ic('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 14),
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>', 20),
    person: ic('<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7m0 0-3 6m3-6 3 6M6 10.5l6-1.5 6 1.5"/>'),
    steth: ic('<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>'),
    hand: ic('<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4m0-5.5a1.5 1.5 0 0 1 3 0V10m0-4a1.5 1.5 0 0 1 3 0v5m0-2.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2.1L7 14"/>'),
    shield: ic('<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>'),
    lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 12),
    edit: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>', 16),
    trash: ic('<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>', 16),
    note: ic('<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/>', 14),
    bolt: ic('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>', 16),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', 14),
  };

  /* ───────── State ───────── */
  const S = {
    session: null, view: null, season: "all", bodyFilter: "all",
    log: { q: "", region: "", activity: "", status: "", sort: "date", asc: false },
  };
  try { S.session = JSON.parse(sessionStorage.getItem("pitchside.session")); } catch {}
  const auth = () => S.session ? { role: S.session.role, pin: S.session.pin || "", code: S.session.code || "", token: S.session.token || "", sess: S.session.sess || "" } : {};
  const REMEMBER = "pitchside.remember", REMEMBER_DAYS = 30;
  const forget = () => { try { localStorage.removeItem(REMEMBER); } catch {} };
  const role = () => S.session?.role;
  const can = (k) => !!PERMS[role()]?.[k];
  const range = () => S.season === "all" ? null : SEASONS.find((s) => s.id === S.season);
  const me = () => S.session?.playerId ? Store.player(S.session.playerId) : null;
  const who = () => role() === "athlete" ? me()?.name : ROLES[role()].name;
  const clinical = () => can("clinical");

  const TR_MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const fd = (s) => { if (!s) return "—"; const d = parse(s); return `${d.getDate()} ${TR_MONTHS[d.getMonth()]}`; };
  const fdl = (s) => { if (!s) return "—"; const d = parse(s); return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const rel = (s) => { const n = diffDays(s, todayISO); return n <= 0 ? "bugün" : n === 1 ? "dün" : n < 7 ? `${n} gün önce` : fd(s); };
  const sideTR = (s) => s === "R" ? "Sağ" : s === "L" ? "Sol" : "";
  const regionTR = (i) => `${sideTR(i.side) ? sideTR(i.side) + " " : ""}${REGIONS[i.region] || i.region}`.replace(/^(Sağ|Sol) (\S)/, (m, a, b) => `${a} ${b.toLocaleLowerCase("tr")}`);
  const stageOf = (id) => STAGES.find((s) => s.id === id) || STAGES[0];
  const initials = (n) => String(n || "").replace(/^(Dr|Fzt|Uzm|Prof|Doç)\.?\s+/i, "").split(/\s+/).map((x) => x[0] || "").slice(0, 2).join("").toLocaleUpperCase("tr");
  const posTR = (p) => POSITIONS[p.pos]?.label || p.pos || "";
  const pmeta = (p, ...extra) => [posTR(p), p.height ? p.height + " cm" : "", p.age ? p.age + " yaş" : "", ...extra].filter(Boolean).join(" · ");
  const mkNote = (text) => ({ id: "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: todayISO, by: who(), role: role(), text });
  const statusTR = { available: "Hazır", limited: "Kısıtlı", out: "Oynayamaz" };
  const progress = (i) => {
    if (!M.active(i)) return 1;
    if (!i.expectedDays) return ({ reported: .05, acute: .15, rehab: .45, rtt: .8 })[i.stage] || .1;
    return Math.min(.97, M.days(i) / i.expectedDays);
  };
  const eta = (i) => i.expectedDays ? addDays(i.date, i.expectedDays) : null;

  /* ───────── UI primitives ───────── */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.innerHTML = `<i>${I.check}</i>${esc(msg)}`;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 2600);
  }
  const seg = (name, opts, cur) => `<div class="seg" data-seg="${name}"><span class="seg-thumb"></span>${opts.map(([v, l]) => `<button data-v="${v}" class="${v === cur ? "on" : ""}">${l}</button>`).join("")}</div>`;
  function syncSegs(scope = document) {
    $$(".seg", scope).forEach((s) => {
      const on = $("button.on", s), th = $(".seg-thumb", s);
      if (on && th) { th.style.left = on.offsetLeft + "px"; th.style.width = on.offsetWidth + "px"; }
    });
  }
  function animateIn(scope = document) {
    requestAnimationFrame(() => {
      syncSegs(scope);
      $$(".ring", scope).forEach((r) => requestAnimationFrame(() => r.classList.add("go")));
      $$("[data-count]", scope).forEach((el) => {
        const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "", t0 = performance.now(), dur = 1300;
        const step = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(to * e, dec) + suf; if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    });
  }
  let vtActive = false;
  const transition = (fn) => {
    // Hidden tabs defer view-transition callbacks until they are shown — render immediately instead.
    if (!document.startViewTransition || vtActive || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return fn();
    vtActive = true;
    const vt = document.startViewTransition(fn);
    vt.ready.catch(() => {});
    vt.finished.catch(() => {}).then(() => { vtActive = false; });
  };

  // Tooltip
  const tip = $("#tip");
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-tip], .bm-part[data-count]");
    if (!t) return;
    const txt = t.dataset.tip || t.getAttribute("aria-label");
    if (!txt) return;
    tip.textContent = txt; tip.classList.add("on");
  });
  document.addEventListener("pointermove", (e) => {
    if (!tip.classList.contains("on")) return;
    const x = Math.min(innerWidth - tip.offsetWidth - 12, e.clientX + 14), y = e.clientY - tip.offsetHeight - 12;
    tip.style.left = x + "px"; tip.style.top = (y < 8 ? e.clientY + 18 : y) + "px";
  }, { passive: true });
  document.addEventListener("pointerout", (e) => { if (e.target.closest("[data-tip], .bm-part")) tip.classList.remove("on"); });

  // Pointer-tracked tilt + glare (roster + gate cards)
  let tiltRaf = 0;
  document.addEventListener("pointermove", (e) => {
    const c = e.target.closest(".pcard, .role-card");
    if (!c || tiltRaf) return;
    tiltRaf = requestAnimationFrame(() => {
      tiltRaf = 0;
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
      if (c.classList.contains("pcard")) c.style.transform = `rotateY(${(px - .5) * 10}deg) rotateX(${(.5 - py) * 8}deg) translateZ(0)`;
    });
  }, { passive: true });
  document.addEventListener("pointerout", (e) => { const c = e.target.closest(".pcard"); if (c && !c.contains(e.relatedTarget)) c.style.transform = ""; });

  /* ───────── Drawer ───────── */
  let drawerCtx = null;
  function openDrawer(html, ctx = {}) {
    closeDrawer(true);
    const scrim = document.createElement("div"); scrim.className = "scrim";
    const d = document.createElement("aside"); d.className = "drawer"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
    d.innerHTML = html;
    document.body.append(scrim, d);
    drawerCtx = { el: d, scrim, ...ctx };
    scrim.addEventListener("click", () => closeDrawer());
    requestAnimationFrame(() => { scrim.classList.add("on"); d.classList.add("on"); animateIn(d); });
    return d;
  }
  function closeDrawer(instant) {
    if (!drawerCtx) return;
    const { el, scrim } = drawerCtx; drawerCtx = null;
    if (instant) { el.remove(); scrim.remove(); return; }
    el.classList.remove("on"); scrim.classList.remove("on");
    setTimeout(() => { el.remove(); scrim.remove(); }, 600);
  }
  const drawerHead = (title, extra = "") => `<div class="drawer-h"><span class="tag">${title}</span><span class="grow"></span>${extra}<button class="icon-btn" data-act="close" aria-label="Kapat">${I.x}</button></div>`;

  /* ───────── Gate ───────── */
  function renderGate(sel = null) {
    const cards = [
      ["athlete", "L1 · SPORCU", "Sporcu", "Hissettiği anda bildirir. Bölge, ağrı, oyun anı — 30 saniye.", I.person],
      ["physio", "L2 · FİZYOTERAPİST", "Fizyoterapist", "Değerlendirir, kaydeder, rehabilitasyonu yönetir.", I.hand],
      ["coach", "L3 · TEKNİK EKİP", "Teknik Ekip", "Yalnızca kadro uygunluğu ve tahmini dönüş. Tanı görmez.", I.whistle],
      ["doctor", "L4 · HEKİM", "Takım Hekimi", "Tanıyı onaylar, oyuna dönüşe son kararı verir. Tüm yetki.", I.steth],
    ];
    const demo = !Store.live;
    root.innerHTML = `<section class="gate"><div class="gate-inner">
      <a class="gate-brand" href="index.html"><span class="logo" style="margin:0">${I.logo}</span>Pitchside</a>
      <div class="eyebrow reveal"><span class="live"></span>${esc(CONFIG.TEAM)} · Sakatlık gözetim sistemi</div>
      <h1 class="reveal" style="--d:60ms">Kim olarak<br><span>giriş yapıyorsun?</span></h1>
      <p class="lead reveal" style="--d:120ms">Dört katman, tek gerçeklik. Her rol yalnızca kendi yetkisindeki veriyi görür ve değiştirir.</p>
      <div class="roles">${cards.map(([id, layer, h, p, icon], k) => `
        <button class="role-card reveal${sel === id ? " on" : ""}" data-role="${id}" style="--d:${180 + k * 70}ms">
          <span class="rc-glare"></span><span class="rc-layer">${layer}</span><span class="rc-ico">${icon}</span>
          <h3>${h}</h3><p>${p}</p></button>`).join("")}</div>
      <form class="gate-auth" id="auth">${sel ? authFields(sel, demo) : ""}</form>
      <div class="gate-foot"><span>${demo ? "Demo modu — veriler bu tarayıcıda saklanır." : "Canlı mod — bağlantı şifreli, PIN sunucuda doğrulanır."}</span><span>IOC 2020 · futbol konsensüsü (Fuller / Waldén)</span><span>KVKK uyumlu erişim katmanları</span></div>
    </div></section>`;
    const f = $("#auth input, #auth select"); if (f) setTimeout(() => f.focus(), 50);
  }
  function authFields(r, demo) {
    if (r === "athlete") {
      if (demo) return `<label class="field"><span>Oyuncu (demo)</span><select class="input" name="player">${Store.activePlayers().map((p) => `<option value="${p.id}">#${p.no} · ${esc(p.name)}</option>`).join("")}</select></label>
        <button class="btn btn-primary btn-lg" style="align-self:flex-end">Devam ${I.arrow}</button>`;
      return `<label class="field"><span>Kişisel kodun</span><input class="input mono" name="code" autocomplete="off" placeholder="ör. DOG7" required></label><button class="btn btn-primary btn-lg" style="align-self:flex-end">Devam ${I.arrow}</button>`;
    }
    const optional = demo || r === "doctor";
    return `<label class="field"><span>${ROLES[r].label} PIN</span><input class="input mono" type="password" name="pin" inputmode="numeric" autocomplete="current-password" placeholder="${demo ? "Demo: boş bırakılabilir" : r === "doctor" ? "PIN tanımlıysa yaz" : "••••"}" ${optional ? "" : "required"}></label>
      <button class="btn btn-primary btn-lg" style="align-self:flex-end">Giriş ${I.arrow}</button>
      <label class="remember"><input type="checkbox" name="remember" checked><span>Bu cihazı ${REMEMBER_DAYS} gün hatırla</span></label>`;
  }
  async function login(r, form) {
    const fd_ = new FormData(form);
    const sess = { role: r, pin: fd_.get("pin") || "", code: (fd_.get("code") || "").toUpperCase().trim() };
    if (r === "athlete") {
      if (!Store.live) sess.playerId = fd_.get("player");
      else {
        S.session = sess;
        try { await Store.load(auth()); } catch (e) { S.session = null; toast(e.message === "locked" ? "Çok fazla hatalı deneme — 10 dk sonra tekrar deneyin" : "Kod doğrulanamadı"); return; }
        sess.playerId = Store.db.players.find((p) => p.code === sess.code)?.id;
      }
    } else if (Store.live) {
      S.session = sess;
      try { await Store.load({ ...auth(), remember: !!fd_.get("remember") }); } catch (e) { S.session = null; toast(e.message === "locked" ? "Çok fazla hatalı deneme — 10 dk sonra tekrar deneyin" : "PIN hatalı"); return; }
    }
    // "Remember this device": the server signs a 30-day session token; the PIN itself is never stored.
    if (r !== "athlete" && fd_.get("remember")) {
      if (Store.live && Store.sess) { sess.sess = Store.sess; sess.pin = ""; }
      try { localStorage.setItem(REMEMBER, JSON.stringify({ role: r, sess: sess.sess || "", exp: Date.now() + REMEMBER_DAYS * 864e5 })); } catch {}
    }
    S.session = sess;
    try { sessionStorage.setItem("pitchside.session", JSON.stringify(sess)); } catch {}
    transition(() => startApp());
  }
  function logout() {
    S.session = null; forget(); try { sessionStorage.removeItem("pitchside.session"); } catch {}
    if (new URLSearchParams(location.search).has("k")) history.replaceState(null, "", location.pathname);
    transition(() => renderGate());
  }

  /* ───────── Shell ───────── */
  const NAV = {
    doctor: [["overview", "Genel bakış", I.grid], ["roster", "Kadro", I.users], ["matches", "Maçlar", I.cal], ["log", "Sakatlık kaydı", I.list], ["board", "Rehabilitasyon", I.board], ["inbox", "Onay kutusu", I.inbox], ["exposure", "Maruziyet", I.clock], ["qr", "QR kodları", I.qr]],
    physio: [["overview", "Genel bakış", I.grid], ["roster", "Kadro", I.users], ["matches", "Maçlar", I.cal], ["log", "Sakatlık kaydı", I.list], ["board", "Rehabilitasyon", I.board], ["inbox", "Gelen bildirimler", I.inbox]],
    coach: [["squad", "Kadro uygunluğu", I.pitch], ["matches", "Maçlar", I.cal]],
    athlete: [["me", "Durumum", I.person]],
  };
  const TITLES = { overview: "Genel bakış", roster: "Kadro", log: "Sakatlık kaydı", board: "Rehabilitasyon", inbox: "Onay kutusu", exposure: "Maruziyet", me: "Durumum", squad: "Kadro uygunluğu", matches: "Maçlar", qr: "QR kodları" };
  const HOME = { doctor: "overview", physio: "overview", coach: "squad", athlete: "me" };

  function inboxCount() {
    const d = Store.db.injuries;
    if (role() === "doctor") return d.filter((i) => i.stage === "reported" || (M.active(i) && !i.diagnosed) || i.stage === "rtt").length;
    return d.filter((i) => i.stage === "reported").length;
  }

  function startApp() {
    const r = role();
    if (r === "reporter") return renderReporter();
    if (!S.seasonPicked) S.season = currentSeasonId();
    const nav = NAV[r];
    const u = r === "athlete" ? { name: me()?.name || "Sporcu", label: [me()?.no !== "" ? "#" + me()?.no : "", me() ? posTR(me()) : ""].filter(Boolean).join(" · "), initials: initials(me()?.name || "S") } : { ...ROLES[r], initials: initials(ROLES[r].name) };
    const dark = document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.innerHTML = `<div class="shell">
      <nav class="side" aria-label="Ana menü">
        <a class="logo" href="index.html" aria-label="Pitchside">${I.logo}</a>
        ${nav.map(([id, l, icon]) => `<button class="nav-btn" data-nav="${id}" data-label="${l}" aria-label="${l}">${icon}${id === "inbox" ? '<span class="dot" hidden></span>' : ""}</button>`).join("")}
        ${r !== "athlete" && can("add") ? `<button class="nav-btn" data-act="new" data-label="Yeni sakatlık" aria-label="Yeni sakatlık">${I.plus}</button>` : ""}
        <span class="spacer"></span>
        <button class="nav-btn" data-act="theme" data-label="Tema" aria-label="Tema">${dark ? I.sun : I.moon}</button>
        <button class="nav-btn" data-act="logout" data-label="Çıkış" aria-label="Çıkış">${I.out}</button>
      </nav>
      <div class="main">
        <header class="top">
          <h2 id="title"></h2><span class="crumb">· ${esc(CONFIG.TEAM)}</span><span class="grow"></span>
          ${clinical() ? `<button class="kbd-search" data-act="cmdk">${I.search}<span>Oyuncu, tanı, işlem ara</span><kbd>⌘K</kbd></button>` : ""}
          <div class="user-chip"><span class="avatar">${esc(u.initials)}</span><div><b>${esc(u.name)}</b><small>${esc(u.label)}</small></div></div>
        </header>
        <main class="page" id="page"></main>
      </div></div>
      ${!Store.live ? `<div class="demo-bar"><span>Demo verisi</span><button class="btn btn-ghost" data-act="reset">Sıfırla</button></div>` : ""}
      ${Store.live && r === "doctor" && Store.db.meta?.openDoctor ? `<div class="open-bar">${I.lock}<span><b>Hekim PIN'i tanımlı değil.</b> Bu adresi bilen herkes hekim olarak girebilir. Kadro ve sakatlık girmeden önce e-tabloda <b>Pitchside ▸ PIN'leri ayarla</b>.</span></div>` : ""}`;
    const h = location.hash.slice(1);
    go(r === "athlete" ? "me" : (h && TITLES[h] && nav.some((n) => n[0] === h) ? h : HOME[r]), true);
  }

  function go(view, instant) {
    S.view = view;
    if (role() !== "athlete") history.replaceState(null, "", "#" + view);
    const run = () => { renderView(); window.scrollTo({ top: 0 }); };
    instant ? run() : transition(run);
  }
  function renderView() {
    if (!$("#page")) return; // a hashchange can land before the shell has rendered
    $$(".nav-btn[data-nav]").forEach((b) => b.classList.toggle("on", b.dataset.nav === S.view));
    const n = inboxCount(), dot = $(".nav-btn[data-nav=inbox] .dot");
    if (dot) { dot.hidden = !n; dot.textContent = n; }
    $("#title").textContent = S.view === "inbox" && role() === "physio" ? "Gelen bildirimler" : TITLES[S.view];
    const page = $("#page");
    page.innerHTML = VIEWS[S.view]();
    animateIn(page);
  }
  Store.on(() => { if (S.session && $("#page")) renderView(); });

  const seasonSeg = () => seg("season", [...[...SEASONS].sort((a, b) => b.start.localeCompare(a.start)).slice(0, 3).map((x) => [x.id, x.label]), ["all", "Tümü"]], S.season);
  const head = (eyebrow, title, sub, right = "") => `<div class="page-head"><div><div class="eyebrow reveal"><span class="live"></span>${eyebrow}</div>
    <h1 class="reveal" style="--d:40ms">${title}</h1>${sub ? `<p class="reveal" style="--d:80ms">${sub}</p>` : ""}</div><div class="reveal" style="--d:100ms;display:flex;gap:10px;align-items:center;flex-wrap:wrap">${right}</div></div>`;


  /* ───────── Views ───────── */
  const VIEWS = {};

  /* ───────── Pitch: squad depth on a 4-3-3 ───────── */
  const NEED = { GK: 1, DF: 4, MF: 3, FW: 3 };
  function squadState() {
    const db = Store.db;
    return Store.activePlayers().map((p) => {
      const inj = db.injuries.filter((i) => i.playerId === p.id && M.active(i)).sort((a, b) => b.date.localeCompare(a.date))[0];
      return { p, st: M.status(p.id, db.injuries), inj, line: POSITIONS[p.pos]?.line || "MF" };
    });
  }
  function availTip(x) {
    if (x.st === "available") return `#${x.p.no} ${x.p.name} · Hazır`;
    const i = x.inj, when = i && i.stage !== "reported" && eta(i) ? " · dönüş ~" + fd(eta(i)) : i?.stage === "reported" ? " · değerlendirme bekliyor" : "";
    return `#${x.p.no} ${x.p.name} · ${statusTR[x.st]}${i ? " · " + (clinical() && i.diagnosis ? i.diagnosis : regionTR(i)) : ""}${when}`;
  }
  function pitchCard(delay = 0) {
    const sq = squadState(), order = { available: 0, limited: 1, out: 2 };
    const byPos = {};
    for (const x of sq) (byPos[POSITIONS[x.p.pos] ? x.p.pos : "CM"] ||= []).push(x);
    const lines = Object.keys(LINES).map((l) => {
      const arr = sq.filter((x) => x.line === l), ok = arr.filter((x) => x.st === "available").length;
      return { l, ok, n: arr.length, short: ok < NEED[l] };
    });
    const xiOK = lines.every((x) => !x.short);
    const nodes = Object.entries(POSITIONS).map(([code, pos], k) => {
      const arr = (byPos[code] || []).sort((a, b) => order[a.st] - order[b.st] || a.p.no - b.p.no);
      if (!arr.length) return "";
      return `<div class="pn" style="left:${pos.y}%;top:${100 - pos.x}%;--d:${200 + k * 45}ms"><span class="pn-l">${code}</span>
        ${arr.map((x) => `<button class="pchip ${x.st}" data-player="${x.p.id}" data-tip="${esc(availTip(x))}"><i class="sdot ${x.st}"></i><b>${x.p.no}</b>${esc(x.p.name.split(" ").slice(-1)[0])}</button>`).join("")}</div>`;
    }).join("");
    return `<div class="card pitch-card span-12 reveal" style="--d:${delay}ms">
      <div class="card-h"><h3>Kadro derinliği</h3><span class="sub">4-3-3 · pozisyona göre uygunluk</span><span class="grow"></span>
        <span class="xi ${xiOK ? "ok" : "short"}">${xiOK ? I.check + " İlk 11 kurulabilir" : "⚠︎ " + lines.filter((x) => x.short).map((x) => LINES[x.l]).join(", ") + " hattında eksik"}</span></div>
      <div class="pitch-lines">${lines.map((x) => `<div class="${x.short ? "short" : ""}"><span>${LINES[x.l]}</span><b class="tnum">${x.ok}<small>/${x.n}</small></b><span class="pl-bar"><i style="--w:${x.n ? (x.ok / x.n) * 100 : 0}%"></i></span></div>`).join("")}</div>
      <div class="pitch-scroll"><div class="pitch">
        <svg class="pitch-svg" viewBox="0 0 1050 680" preserveAspectRatio="none" aria-hidden="true">
          <defs><radialGradient id="pglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#4d7fff" stop-opacity=".22"/><stop offset="1" stop-color="#4d7fff" stop-opacity="0"/></radialGradient></defs>
          ${Array.from({ length: 10 }, (_, k) => `<rect x="${k * 105}" y="0" width="105" height="680" fill="#fff" opacity="${k % 2 ? 0.018 : 0}"/>`).join("")}
          <ellipse cx="525" cy="340" rx="300" ry="260" fill="url(#pglow)"/>
          <g fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2">
            <rect x="24" y="24" width="1002" height="632" rx="4"/><path d="M525 24v632"/><circle cx="525" cy="340" r="92"/>
            <rect x="24" y="138" width="165" height="404"/><rect x="24" y="248" width="55" height="184"/>
            <rect x="861" y="138" width="165" height="404"/><rect x="971" y="248" width="55" height="184"/>
            <path d="M189 266a92 92 0 0 1 0 148M861 266a92 92 0 0 0 0 148"/>
          </g>
          <g fill="rgba(255,255,255,.3)"><circle cx="525" cy="340" r="4"/><circle cx="134" cy="340" r="3"/><circle cx="916" cy="340" r="3"/></g>
        </svg>
        <span class="pitch-dir">HÜCUM YÖNÜ →</span>
        ${nodes}
      </div></div>
    </div>`;
  }

  VIEWS.squad = () => {
    const sq = squadState(), s = M.summary(Store.db, range());
    const off = sq.filter((x) => x.st !== "available").sort((a, b) => (a.st === "out" ? 0 : 1) - (b.st === "out" ? 0 : 1));
    return head("Teknik ekip görünümü · " + fdl(todayISO), `Kim hazır, <span>kim değil.</span>`, `${s.counts.available} hazır · ${s.counts.limited} kısıtlı · ${s.counts.out} oynayamaz — tanı ve klinik notlar sağlık ekibinde kalır.`) + `
    <div class="grid g-12">
      ${pitchCard(60)}
      <div class="card span-5 reveal" style="--d:140ms">
        <div class="avail">${Charts.ring(s.availability, { label: "Hazır", size: 156 })}
          <div><h2>${s.counts.available} / ${sq.length} oyuncu<br>bugün hazır.</h2>
          <div class="stat-row"><div><b class="tnum">${s.counts.available}</b><span><i class="sdot available"></i>Hazır</span></div>
            <div><b class="tnum">${s.counts.limited}</b><span><i class="sdot limited"></i>Kısıtlı</span></div>
            <div><b class="tnum">${s.counts.out}</b><span><i class="sdot out"></i>Oynayamaz</span></div></div></div></div>
      </div>
      <div class="card span-7 reveal" style="--d:180ms">
        <div class="card-h"><h3>Uygun olmayanlar</h3><span class="sub">tahmini dönüş sağlık ekibinin öngörüsüdür</span></div>
        <div class="out-list" style="border:0;margin:0;padding:0">${off.map((x) => `<button class="out-item" data-player="${x.p.id}"><span class="no">${x.p.no}</span><i class="sdot ${x.st}"></i>
          <span class="grow"><b style="font-weight:550">${esc(x.p.name)}</b> <em>· ${esc(posTR(x.p))} · ${esc(x.inj ? regionTR(x.inj) : "")}</em></span>
          <em class="mono">${x.inj && x.inj.stage !== "reported" && eta(x.inj) ? "~" + fd(eta(x.inj)) : x.inj?.stage === "reported" ? "değerlendiriliyor" : statusTR[x.st]}</em></button>`).join("") || `<div class="empty" style="padding:12px 0">Tüm kadro hazır.</div>`}</div>
        <p class="lock-note">${I.lock} Kısıtlı = antrenmana dönmüş ya da kısmi katılım; maç kararı hekim onayıyla netleşir.</p>
      </div>
    </div>`;
  };



  /* ───────── QR helpers (generated in the browser — tokens never leave for a third-party QR service) ───────── */
  const appBase = () => location.origin + location.pathname.replace(/[^/]*$/, "") + "app.html";
  const reporterLink = (t) => `${appBase()}?k=${encodeURIComponent(t.token)}`;
  const athleteLink = (p) => `${appBase()}?c=${encodeURIComponent(p.code)}`;
  function qrMatrix(text) {
    if (!window.qrcode) return null;
    const q = qrcode(0, "M"); q.addData(text); q.make();
    const n = q.getModuleCount(), rows = [];
    for (let r = 0; r < n; r++) { const row = []; for (let c = 0; c < n; c++) row.push(q.isDark(r, c)); rows.push(row); }
    return rows;
  }
  function qrSvg(text, size = 148) {
    const mx = qrMatrix(text);
    if (!mx) return `<div class="qr-miss">QR kütüphanesi yüklenemedi</div>`;
    const n = mx.length, q = 2; let d = "";
    mx.forEach((row, r) => row.forEach((on, c) => { if (on) d += `M${c + q} ${r + q}h1v1h-1z`; }));
    return `<svg class="qr" viewBox="0 0 ${n + 2 * q} ${n + 2 * q}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="QR kodu"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#0a0a0b"/></svg>`;
  }
  function qrPng(text, title, sub, file) {
    const mx = qrMatrix(text); if (!mx) return toast("QR kütüphanesi yüklenemedi");
    const W = 720, H = 900, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const g = cv.getContext("2d"), n = mx.length, cell = Math.floor(560 / n), ox = (W - cell * n) / 2, oy = 80;
    g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); g.fillStyle = "#0a0a0b";
    mx.forEach((row, r) => row.forEach((on, c) => { if (on) g.fillRect(ox + c * cell, oy + r * cell, cell, cell); }));
    g.textAlign = "center"; g.font = "600 40px Geist, -apple-system, sans-serif"; g.fillText(title, W / 2, oy + cell * n + 90);
    g.font = "400 26px Geist, -apple-system, sans-serif"; g.fillStyle = "#5c5c62"; g.fillText(sub, W / 2, oy + cell * n + 135);
    g.font = "500 20px 'Geist Mono', monospace"; g.fillStyle = "#2563ff"; g.fillText("PITCHSIDE · " + CONFIG.TEAM.toLocaleUpperCase("tr"), W / 2, 50);
    cv.toBlob((b) => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = file; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); });
  }
  function qrPrint(cards, heading) {
    const w = open("", "_blank"); if (!w) return toast("Açılır pencere engellendi");
    w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(heading)}</title><style>
      body{font-family:-apple-system,"Geist",sans-serif;margin:24px;color:#0a0a0b}h1{font-size:18px;margin:0 0 18px}
      .g{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.c{border:1px solid #ddd;border-radius:14px;padding:14px;text-align:center;break-inside:avoid}
      .c b{display:block;font-size:15px;margin-top:8px}.c span{font-size:12px;color:#666}.c svg{width:100%;height:auto;max-width:180px}
      @media print{body{margin:10mm}}</style></head><body><h1>${esc(heading)}</h1><div class="g">${cards.map((c) => `<div class="c">${qrSvg(c.link, 180)}<b>${esc(c.title)}</b><span>${esc(c.sub)}</span></div>`).join("")}</div>
      <script>setTimeout(()=>print(),300)<\/script></body></html>`);
    w.document.close();
  }

  /* ───────── Matches: fixtures, squad sheets, availability ───────── */
  const compPill = (c) => `<span class="pill ${c === "league" ? "" : c === "europe" ? "ink" : "outline"}">${COMPETITIONS[c] || c}</span>`;
  function availBars(perMatch, rec) {
    if (!perMatch.length) return `<div class="empty">Bu dönemde maç yok.</div>`;
    return `<div class="mbars-wrap"><div class="mbars-y"><span>100%</span><span>75%</span><span>50%</span></div><div class="mbars">${perMatch.map((x, k) => {
      const d = rec[x.m.id], cong = d !== null && d !== undefined && d <= CONGESTION_DAYS;
      const h = Math.max(0, (x.avail - 0.5) / 0.5) * 100;
      return `<i class="${cong ? "cong" : ""}" data-match="${x.m.id}" style="--h:${h}%;--d:${k * 12}ms" data-tip="${esc(`${fd(x.m.date)} · ${x.m.opponent} (${COMPETITIONS[x.m.comp]}) — uygunluk %${Math.round(x.avail * 100)} · ${x.injured} sakat${x.ill ? " · " + x.ill + " hasta" : ""}${d !== null && d !== undefined ? " · " + d + " gün toparlanma" : ""}`)}"></i>`;
    }).join("")}</div></div>`;
  }
  function congestionCard(db, r, delay) {
    const c = M.congestion(db, r), ratio = c.long.inc ? c.short.inc / c.long.inc : 0;
    return `<div class="card span-4 reveal" style="--d:${delay}ms">
      <div class="card-h"><h3>Maç yoğunluğu</h3><span class="sub">maç sakatlığı / 1000 maç saati</span></div>
      <div class="cong-grid"><div><span class="tag">≤${CONGESTION_DAYS} gün toparlanma</span><b class="tnum">${fmt(c.short.inc, 1)}</b><em>${c.short.m} maç · ${c.short.n} sakatlık</em></div>
        <div><span class="tag">≥6 gün toparlanma</span><b class="tnum">${fmt(c.long.inc, 1)}</b><em>${c.long.m} maç · ${c.long.n} sakatlık</em></div></div>
      <p class="lock-note" style="margin-top:14px">${I.info} ${ratio ? `Oran ${fmt(ratio, 2)}. ` : ""}UEFA verisinde ≤4 gün toparlanmalı lig maçlarında kas sakatlığı riski %32 daha yüksek bulundu (Bengtsson 2013).</p>
    </div>`;
  }

  VIEWS.matches = () => {
    const db = Store.db, r = range(), rec = M.recovery(db), edit = !!MATCH_EDIT[role()];
    const played = M.matches(db, r), av = M.matchAvailability(db, r), byId = Object.fromEntries(av.perMatch.map((x) => [x.m.id, x]));
    const upcoming = (db.matches || []).filter((m) => m.date > todayISO).sort((a, b) => a.date.localeCompare(b.date));
    const congested = played.filter((m) => rec[m.id] !== null && rec[m.id] <= CONGESTION_DAYS).length;
    const rows = Store.activePlayers().map((p) => ({ p, st: M.playerStats(db, p.id, r) })).sort((a, b) => b.st.minutes - a.st.minutes);
    const missed = rows.reduce((a, x) => a + x.st.injury, 0), ill = rows.reduce((a, x) => a + x.st.illness, 0);
    const sheet = (m) => (db.appearances || []).some((a) => a.matchId === m.id && APP_STATUS[a.status]?.played);
    const mrow = (m) => { const x = byId[m.id], d = rec[m.id], cong = d !== null && d !== undefined && d <= CONGESTION_DAYS; return `<tr data-match="${m.id}">
      <td class="mono" style="white-space:nowrap">${fd(m.date)} <span style="color:var(--muted)">${m.date.slice(2, 4)}</span></td>
      <td><b style="font-weight:550">${esc(m.opponent || "—")}</b> <span style="color:var(--muted);font-size:12px">${VENUES[m.venue] || ""}</span></td>
      <td>${compPill(m.comp)}</td><td class="mono">${esc(m.score || "")}</td>
      <td>${d === null || d === undefined ? `<span style="color:var(--muted)">—</span>` : `<span class="pill ${cong ? "limited" : ""}">${d} gün</span>`}</td>
      <td>${x ? `<span class="av-cell"><span class="prog"><i style="--w:${x.avail * 100}%"></i></span><span class="mono">${Math.round(x.avail * 100)}%</span></span>` : "—"}</td>
      <td class="tnum">${x ? x.injured : "—"}</td>
      <td>${m.date > todayISO ? `<span class="pill outline">Planlandı</span>` : sheet(m) ? `<span class="pill">${I.check} Kadro</span>` : `<span class="pill outline">Kadro yok</span>`}</td></tr>`; };
    return head(`Maçlar · ${played.length} oynandı`, `Maç <span>katılımı.</span>`, "Kim kaç maç oynadı, kim kaçırdı. Maç kadrosundaki bireysel dakikalar gerçek maç maruziyetidir; sakat oyuncular aktif kayıtlardan otomatik dolar.",
      seasonSeg() + (edit ? `<button class="btn btn-primary" data-act="newmatch">${I.plus} Yeni maç</button>` : "")) + `
    <div class="grid g-12">
      <div class="card kpi span-3 reveal"><span class="k-l">Maç</span><span class="k-v tnum"><span data-count="${played.length}">0</span></span><span class="k-s">${congested} maç ≤${CONGESTION_DAYS} gün toparlanmayla${upcoming.length ? " · " + upcoming.length + " planlı" : ""}</span></div>
      <div class="card kpi span-3 reveal" style="--d:40ms"><span class="k-l">Maç uygunluğu <span class="info" data-tip="Her maçta kadronun sakat ya da hasta olmayan yüzdesi, maçların ortalaması (Hägglund 2013 · UEFA ortalaması %86).">i</span></span><span class="k-v tnum"><span data-count="${av.mean * 100}" data-dec="1">0</span><small>%</small></span><span class="k-s">sakatlık + hastalık dışı</span></div>
      <div class="card kpi span-3 reveal" style="--d:80ms"><span class="k-l">Sakatlıkla kaçırılan</span><span class="k-v tnum"><span data-count="${missed}">0</span><small>oyuncu-maç</small></span><span class="k-s">${ill} hastalık · maç başına ${fmt(played.length ? missed / played.length : 0, 1)}</span></div>
      <div class="card kpi span-3 reveal" style="--d:120ms"><span class="k-l">Maç maruziyeti</span><span class="k-v tnum"><span data-count="${M.exposure(db, r).game}">0</span><small>oyuncu-saat</small></span><span class="k-s">bireysel dakikalardan</span></div>
      <div class="card span-8 reveal" style="--d:160ms"><div class="card-h"><h3>Maç bazında uygunluk</h3><span class="sub">her çubuk bir maç</span><span class="grow"></span>
        <div class="keys"><span><i style="background:var(--blue)"></i>Normal</span><span><i style="background:var(--limited)"></i>≤${CONGESTION_DAYS} gün toparlanma</span></div></div>${availBars(av.perMatch, rec)}</div>
      ${congestionCard(db, r, 200)}
      ${upcoming.length ? `<div class="card span-12 reveal" style="--d:220ms"><div class="card-h"><h3>Yaklaşan</h3></div><div class="table-wrap"><table class="tbl"><tbody>${upcoming.map(mrow).join("")}</tbody></table></div></div>` : ""}
      <div class="card span-12 reveal" style="--d:240ms"><div class="card-h"><h3>Fikstür</h3><span class="sub">satıra tıkla: maç kadrosu ve dakikalar</span></div>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>Tarih</th><th>Rakip</th><th>Organizasyon</th><th>Skor</th><th>Toparlanma</th><th>Uygunluk</th><th>Sakat</th><th>Kadro</th></tr></thead>
        <tbody>${played.slice().reverse().map(mrow).join("")}</tbody></table>${played.length ? "" : `<div class="empty">Henüz maç yok.${edit ? " “Yeni maç” ile başlayın." : ""}</div>`}</div></div>
      <div class="card span-12 reveal" style="--d:280ms"><div class="card-h"><h3>Oyuncu katılımı</h3><span class="sub">${played.length} maç üzerinden</span></div>
        <div class="table-wrap"><table class="tbl"><thead><tr><th>Oyuncu</th><th>Maç</th><th>İlk 11</th><th>Yedek</th><th>Dakika</th><th>Sakat</th><th>Hasta</th><th>Diğer</th><th>Uygunluk</th></tr></thead>
        <tbody>${rows.map(({ p, st }) => `<tr data-player="${p.id}"><td><span class="pl"><span class="avatar">${p.no}</span>${esc(p.name)} <span style="color:var(--muted);font-size:12px">${esc(p.pos || "")}</span></span></td>
          <td class="tnum">${st.played}</td><td class="tnum">${st.starts}</td><td class="tnum">${st.subs}</td><td class="tnum mono">${fmt(st.minutes)}</td>
          <td class="tnum">${st.injury ? `<b style="color:var(--out)">${st.injury}</b>` : 0}</td><td class="tnum">${st.illness}</td><td class="tnum">${st.other}</td>
          <td><span class="av-cell"><span class="prog"><i style="--w:${st.availability * 100}%"></i></span><span class="mono">${Math.round(st.availability * 100)}%</span></span></td></tr>`).join("")}</tbody></table></div></div>
    </div>`;
  };

  // Default squad status for a new match sheet: injured if a time-loss injury covers that date.
  const defaultApp = (p, date) => Store.db.injuries.some((i) => i.playerId === p.id && M.missed(i, { matches: [{ date }] })) ? { status: "injured", minutes: 0 } : { status: "unused", minutes: 0 };
  let MF = null;
  function openMatch(id) {
    const ex = id ? Store.match(id) : null, edit = !!MATCH_EDIT[role()];
    const m = ex ? { ...ex } : { id: "", date: todayISO, opponent: "", comp: "league", venue: "home", surface: "grass", duration: 90, score: "", note: "" };
    const apps = {};
    if (ex) for (const a of Store.appsFor(ex.id)) apps[a.playerId] = { status: a.status, minutes: Number(a.minutes) || 0 };
    for (const p of Store.activePlayers()) if (!apps[p.id]) apps[p.id] = defaultApp(p, m.date);
    MF = { m, apps, isNew: !ex, edit };
    openDrawer(drawerHead(ex ? "Maç · " + fdl(m.date) : "Yeni maç", ex && role() === "doctor" ? `<button class="btn btn-ghost btn-danger" data-act="delmatch" data-id="${ex.id}">${I.trash}</button>` : "") +
      `<form class="drawer-b" id="mform" autocomplete="off"></form>` + (edit ? `<div class="drawer-f"><span class="mf-count" id="mfcount"></span><span class="grow"></span><button class="btn btn-ghost" data-act="close">Vazgeç</button><button class="btn btn-primary" data-act="savematch">${I.check} Kaydet</button></div>` : ""));
    renderMatchForm();
  }
  function matchCounts() {
    const a = Object.values(MF.apps);
    return { start: a.filter((x) => x.status === "start").length, sub: a.filter((x) => x.status === "sub").length, inj: a.filter((x) => x.status === "injured").length, min: a.reduce((s2, x) => s2 + (Number(x.minutes) || 0), 0) };
  }
  function renderMatchForm() {
    const f = $("#mform"); if (!f) return;
    const { m, apps, edit } = MF, dis = edit ? "" : "disabled", sc = f.scrollTop;
    const chips = (name, obj) => `<div class="chips" data-mchips="${name}">${Object.entries(obj).map(([k, v]) => `<button type="button" class="chip ${m[name] === k ? "on" : ""}" data-v="${k}" ${dis}>${v}</button>`).join("")}</div>`;
    const byLine = Object.keys(LINES).map((l) => [l, Store.activePlayers().filter((p) => (POSITIONS[p.pos]?.line || "MF") === l)]);
    f.innerHTML = `<div class="fgrid">
      <label class="field"><span>Tarih</span><input class="input" type="date" name="date" value="${m.date}" ${dis}></label>
      <label class="field"><span>Rakip</span><input class="input" name="opponent" value="${esc(m.opponent)}" placeholder="ör. Liman FK" ${dis}></label>
      <div class="field full"><span>Organizasyon</span>${chips("comp", COMPETITIONS)}</div>
      <div class="field"><span>Saha</span>${chips("venue", VENUES)}</div>
      <label class="field"><span>Zemin</span><select class="input" name="surface" ${dis}>${Object.entries(SURFACES).map(([k, v]) => `<option value="${k}" ${m.surface === k ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      <label class="field"><span>Süre (dk)</span><select class="input" name="duration" ${dis}>${[90, 120].map((d) => `<option value="${d}" ${+m.duration === d ? "selected" : ""}>${d}${d === 120 ? " (uzatma)" : ""}</option>`).join("")}</select></label>
      <label class="field"><span>Skor</span><input class="input mono" name="score" value="${esc(m.score)}" placeholder="2-1" ${dis}></label>
    </div>
    <div class="d-sec"><h5>Maç kadrosu</h5>
      <p class="mf-hint">İlk 11 seçince dakika ${m.duration} olur; oyundan çıkanın dakikasını düşür. Sakatlar aktif kayıtlardan otomatik işaretlendi.</p>
      ${byLine.map(([l, ps]) => ps.length ? `<div class="sq-line"><span class="tag">${LINES[l]}</span>${ps.map((p) => { const a = apps[p.id]; return `<div class="sq-row s-${a.status}">
        <span class="no mono">${p.no}</span><span class="nm">${esc(p.name)}<em>${esc(p.pos || "")}</em></span>
        <select class="input" data-mapp="${p.id}" ${dis}>${Object.entries(APP_STATUS).map(([k, v]) => `<option value="${k}" ${a.status === k ? "selected" : ""}>${v.label}</option>`).join("")}</select>
        <input class="input mono" type="number" min="0" max="${m.duration}" data-mmin="${p.id}" value="${a.minutes}" ${!APP_STATUS[a.status].played || !edit ? "disabled" : ""} aria-label="Dakika"></div>`; }).join("")}</div>` : "").join("")}
    </div>`;
    f.scrollTop = sc;
    const c = matchCounts(), el = $("#mfcount");
    if (el) el.innerHTML = `<b class="${c.start === 11 ? "" : "warn"}">${c.start}/11</b> ilk 11 · ${c.sub} yedek · ${c.inj} sakat · ${fmt(c.min)} dk`;
  }
  function readMatchForm() {
    const f = $("#mform"); if (!f) return;
    for (const el of $$("[name]", f)) MF.m[el.name] = el.name === "duration" ? Number(el.value) : el.value.trim();
  }
  async function saveMatch() {
    readMatchForm();
    const m = MF.m;
    if (!m.date) return toast("Tarih gerekli");
    if (!m.opponent) return toast("Rakip adı gerekli");
    const apps = Object.entries(MF.apps).map(([playerId, a]) => ({ playerId, status: a.status, minutes: APP_STATUS[a.status].played ? Math.max(0, Math.min(m.duration, Number(a.minutes) || 0)) : 0 }));
    const c = matchCounts();
    if (m.date <= todayISO && c.start && c.start !== 11 && !confirm(`İlk 11'de ${c.start} oyuncu var. Yine de kaydedilsin mi?`)) return;
    await Store.saveMatch(m, apps, auth());
    closeDrawer(); MF = null; toast(m.id ? "Maç kaydedildi" : "Maç eklendi");
  }

  /* ───────── QR admin (doctor) ───────── */
  VIEWS.qr = () => {
    const toks = (Store.db.tokens || []).slice().sort((a, b) => (b.active === true) - (a.active === true) || a.name.localeCompare(b.name, "tr"));
    const count = (t) => Store.db.injuries.filter((i) => i.reporterId === t.id).length;
    const expired = (t) => t.expires && t.expires < todayISO;
    const ps = Store.activePlayers();
    return head("Erişim · " + toks.filter((t) => t.active && !expired(t)).length + " aktif", `QR <span>kodları.</span>`, "QR'ı okutan kişi oyuncu adına sakatlık bildirir. Bildirim “Bildirildi” olarak düşer; fizyoterapist ya da hekim değerlendirmeden hiçbir istatistiğe, grafiğe ve uygunluğa girmez.") + `
    <div class="grid g-12">
      <div class="card span-4 reveal"><div class="card-h"><h3>Yeni QR</h3></div>
        <form id="tokform" class="fgrid" style="grid-template-columns:1fr;gap:12px">
          <label class="field"><span>Kişi</span><input class="input" name="name" placeholder="ör. Ahmet Kaya" required></label>
          <label class="field"><span>Görevi</span><input class="input" name="label" placeholder="ör. Masör, Kondisyoner, Analist"></label>
          <label class="field"><span>Bitiş tarihi (opsiyonel)</span><input class="input" type="date" name="expires" min="${todayISO}"></label>
          <button class="btn btn-primary">${I.qr} QR oluştur</button></form>
        <p class="lock-note">${I.lock} Her QR kişiye özeldir; bildirim kimin QR'ıyla girildiği bilinerek kaydedilir. Kaybolan QR'ı “Devre dışı” ile anında kapat.</p></div>
      <div class="span-8 qr-grid">${toks.map((t, k) => { const off = !t.active || expired(t); return `<div class="card qr-card reveal ${off ? "off" : ""}" style="--d:${k * 40}ms">
        <div class="qr-box">${qrSvg(reporterLink(t), 132)}</div>
        <div class="qr-meta"><span class="tag">${esc(t.label || "Raportör")}</span><h4>${esc(t.name)}</h4>
          <span class="pill ${off ? "out" : "available"}"><i class="sdot ${off ? "out" : "available"}"></i>${!t.active ? "Devre dışı" : expired(t) ? "Süresi doldu" : "Aktif"}</span>
          <small>${count(t)} bildirim · ${t.expires ? "bitiş " + fd(t.expires) : "süresiz"} · <span class="mono">${esc(t.token)}</span></small>
          <div class="qr-actions"><button class="btn btn-ghost" data-act="tokpng" data-id="${t.id}" data-tip="PNG indir">${I.download}</button><button class="btn btn-ghost" data-act="tokcopy" data-id="${t.id}" data-tip="Bağlantıyı kopyala">${I.link}</button>
          <button class="btn btn-ghost" data-act="toktoggle" data-id="${t.id}">${t.active ? "Devre dışı" : "Etkinleştir"}</button></div></div></div>`; }).join("") || `<div class="card empty">Henüz QR yok.</div>`}</div>
      <div class="card span-12 reveal"><div class="card-h"><h3>Oyuncu QR'ları</h3><span class="sub">okutan oyuncu doğrudan kendi bildirim ekranına girer · yalnızca oyuncunun kendisine verin</span><span class="grow"></span>
        <button class="btn btn-ghost" data-act="qrprint">${I.print} Tümünü yazdır</button></div>
        <div class="pqr-grid">${ps.filter((p) => p.code).map((p) => `<button class="pqr" data-act="pqr" data-id="${p.id}">${qrSvg(athleteLink(p), 84)}<b>#${p.no} ${esc(p.name)}</b><span class="mono">${esc(p.code)}</span></button>`).join("") || `<div class="empty">Kişisel kodu olan oyuncu yok.</div>`}</div></div>
    </div>`;
  };

  /* ───────── QR reporter: a single-purpose screen for whoever holds a staff QR ───────── */
  function renderReporter() {
    const rp = S.reporter || {}, sent = S.repSent || [];
    root.innerHTML = `<section class="rep"><div class="rep-inner">
      <div class="rep-top"><span class="gate-brand" style="margin:0"><span class="logo" style="margin:0">${I.logo}</span>Pitchside</span><span class="grow"></span><span class="pill">${I.qr} ${esc(rp.name || "QR")}${rp.label ? " · " + esc(rp.label) : ""}</span></div>
      <div class="eyebrow reveal"><span class="live"></span>${esc(CONFIG.TEAM)} · QR bildirimi</div>
      <h1 class="reveal" style="--d:60ms">Oyuncu adına<br><span>bildir.</span></h1>
      <p class="lead reveal" style="--d:120ms">Oyuncuyu seç, bölgeyi işaretle, durumu anlat. Sağlık ekibi değerlendirip onaylayana kadar kayıt hiçbir istatistiğe girmez.</p>
      <button class="report-cta reveal" data-act="report" style="--d:180ms"><span class="arrow">${I.arrow}</span><span class="tag" style="color:rgba(255,255,255,.7)">30 saniye</span><h3>Yeni<br>bildirim</h3><p>Çekilme, burkulma, darbe, ağrı — ne gördüysen.</p></button>
      ${sent.length ? `<div class="card reveal" style="margin-top:16px"><div class="card-h"><h3>Bu oturumda gönderilenler</h3></div><ul class="feed">${sent.map((x) => `<li><span class="ico">${I.check}</span><p><b>${esc(x.name)}</b> <span>·</span> ${esc(x.region)}</p><time>${x.time}</time></li>`).join("")}</ul></div>` : ""}
      <div class="gate-foot"><span>Bu QR kişiye özeldir — başkasıyla paylaşma.</span><button class="btn btn-ghost" data-act="logout">Çık</button></div>
    </div></section>`;
  }
  function renderBadQR() {
    root.innerHTML = `<section class="gate"><div class="gate-inner" style="max-width:560px">
      <a class="gate-brand" href="index.html"><span class="logo" style="margin:0">${I.logo}</span>Pitchside</a>
      <h1>Bu QR kodu<br><span>çalışmıyor.</span></h1><p class="lead">Kod geçersiz, süresi dolmuş ya da devre dışı bırakılmış olabilir. Takım hekimiyle görüş.</p>
      <a class="btn btn-ghost btn-lg" href="app.html">Giriş ekranı</a></div></section>`;
  }

  VIEWS.overview = () => {
    const db = Store.db, r = range(), s = M.summary(db, r);
    const inRange = db.injuries.filter((i) => M.inRange(i, r) && i.stage !== "reported");
    const tl = inRange.filter((i) => i.timeLoss);

    // monthly series
    const months = [];
    const startS = r ? r.start : addDays(todayISO, -365);
    const endS = r ? (r.end < todayISO ? r.end : todayISO) : todayISO;
    let d = parse(startS); d.setDate(1);
    while (iso(d) <= endS) { months.push(iso(d).slice(0, 7)); d.setMonth(d.getMonth() + 1); }
    const series = months.map((m) => {
      const inj = inRange.filter((i) => i.date.slice(0, 7) === m);
      const g = inj.filter((i) => i.timeLoss && i.activity === "game").length, t = inj.filter((i) => i.timeLoss && i.activity !== "game").length, med = inj.filter((i) => !i.timeLoss).length;
      return { label: TR_MONTHS[+m.slice(5) - 1], values: [g, t, med], tip: `${TR_MONTHS[+m.slice(5) - 1]} ${m.slice(0, 4)} — maç ${g}, antrenman ${t}, tıbbi başvuru ${med}` };
    });
    const spark = series.map((x) => x.values[0] + x.values[1]);

    const roster = Store.activePlayers();
    const outPlayers = roster.map((p) => ({ p, st: M.status(p.id, db.injuries), inj: db.injuries.find((i) => i.playerId === p.id && M.active(i)) })).filter((x) => x.st !== "available")
      .sort((a, b) => (a.st === "out" ? 0 : 1) - (b.st === "out" ? 0 : 1));

    const bodySrc = S.bodyFilter === "active" ? db.injuries.filter(M.active) : S.bodyFilter === "tl" ? tl : inRange;
    const heat = Body.heatFrom(bodySrc), max = Math.max(1, ...Object.values(heat));
    const regCount = M.groupBy(bodySrc, "region");
    const ranked = Object.entries(regCount).sort((a, b) => b[1] - a[1]).slice(0, 7);

    const mech = M.groupBy(inRange, "mechanism");
    const mechColors = { contact: "var(--ink)", indirect: "var(--blue)", noncontact: "var(--blue-2)", overuse: "var(--silver-solid)" };
    const tissue = Object.entries(M.groupBy(tl, "tissue")).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: TISSUES[k], value: v }));
    const sevCounts = [0, 1, 2, 3, 4].map((id) => inRange.filter((i) => SEVERITY(M.days(i), i.timeLoss).id === id).length);
    const sevLabels = ["Tıbbi başvuru", "Minimal · 1–3 g", "Hafif · 4–7 g", "Orta · 8–28 g", "Ağır · >28 g"];
    const sit = M.groupBy(inRange, "situation");
    const sitItems = Object.keys(SITUATIONS).map((k) => ({ label: SITUATIONS[k], value: sit[k] || 0 })).filter((x) => x.value).sort((a, b) => b.value - a.value);
    const mus = M.muscle(db, r), musN = mus.reduce((a, x) => a + x.n, 0), musMax = Math.max(1, ...mus.map((x) => x.n));

    const gr = r ? { start: r.start, end: r.end < todayISO ? addDays(todayISO, 21) : r.end } : { start: addDays(todayISO, -365), end: addDays(todayISO, 21) };
    if (r && r.end > todayISO) gr.end = addDays(todayISO, 30) > r.end ? r.end : addDays(todayISO, 30);
    const ganttRows = db.players.map((p) => ({ player: p, injuries: db.injuries.filter((i) => i.playerId === p.id && i.stage !== "reported" && (i.rtpDate || todayISO) >= gr.start && i.date <= gr.end) }))
      .filter((x) => x.injuries.length).sort((a, b) => b.injuries.reduce((s, i) => s + M.days(i), 0) - a.injuries.reduce((s, i) => s + M.days(i), 0));

    const kpi = (label, val, dec, unit, sub, extra = "", tipTxt = "", delay = 0) => `<div class="card kpi reveal" style="--d:${delay}ms">${extra}
      <span class="k-l">${label}${tipTxt ? ` <span class="info" data-tip="${esc(tipTxt)}">i</span>` : ""}</span>
      <span class="k-v tnum"><span data-count="${val}" data-dec="${dec}">0</span>${unit ? `<small>${unit}</small>` : ""}</span><span class="k-s">${sub}</span></div>`;

    return head("Canlı · " + fdl(todayISO), `Kadro sağlığı <span>bir bakışta.</span>`, `${s.ex.total ? fmt(s.ex.total) + " oyuncu-saat maruziyet · " : ""}${s.total} kayıt · IOC 2020 tanımları`, seasonSeg() + (can("add") ? `<button class="btn btn-primary" data-act="new">${I.plus} Yeni sakatlık</button>` : "")) + `
    <div class="grid g-12">
      <div class="card glass span-5 reveal" style="--d:80ms">
        <div class="avail">${Charts.ring(s.availability, { label: "Hazır", size: 156 })}
          <div><h2>${roster.length ? `${s.counts.available} / ${roster.length} oyuncu<br>bugün hazır.` : "Kadro henüz boş.<br><span style=\"color:var(--muted)\">Oyuncular sekmesine ekleyin.</span>"}</h2>
          <div class="stat-row"><div><b class="tnum">${s.counts.available}</b><span><i class="sdot available"></i>Hazır</span></div>
            <div><b class="tnum">${s.counts.limited}</b><span><i class="sdot limited"></i>Kısıtlı</span></div>
            <div><b class="tnum">${s.counts.out}</b><span><i class="sdot out"></i>Oynayamaz</span></div></div></div></div>
        <div class="out-list">${outPlayers.map((x) => `<button class="out-item" data-player="${x.p.id}"><span class="no">${x.p.no}</span><i class="sdot ${x.st}"></i>
          <span class="grow"><b style="font-weight:550">${esc(x.p.name)}</b> <em>· ${esc(x.inj?.diagnosis || regionTR(x.inj) + " — değerlendirme bekliyor")}</em></span>
          <em class="mono">${x.inj && eta(x.inj) && x.inj.stage !== "reported" ? "ETA " + fd(eta(x.inj)) : stageOf(x.inj?.stage).short}</em></button>`).join("") || `<div class="empty" style="padding:12px 0">Tüm kadro hazır.</div>`}</div>
      </div>
      <div class="span-7 grid" style="grid-template-columns:1fr 1fr">
        ${kpi("İnsidans", s.incidence, 1, "/1000 sa", `Maç ${fmt(s.incGame, 1)} · Antrenman ${fmt(s.incTraining, 1)}`, Charts.spark(spark), "Zaman kaybettiren sakatlık sayısı / toplam oyuncu-saat × 1000", 120)}
        ${kpi("Sakatlık yükü", s.burden, 0, "gün/1000 sa", `Ortalama ${fmt(s.meanDays, 1)} gün kayıp`, "", "Kaybedilen gün / oyuncu-saat × 1000 — insidans × ortalama şiddet", 160)}
        ${kpi("Zaman kaybı", s.timeLoss, 0, "sakatlık", `${s.total - s.timeLoss} tıbbi başvuru · ${s.recurrent} tekrarlayan`, "", "", 200)}
        ${kpi("Kayıp gün", s.daysLost, 0, "gün", `${s.active} aktif vaka · <a href="#inbox" data-nav="inbox" style="color:var(--blue)">${s.pending} onay bekliyor</a>`, "", "", 240)}
      </div>

      <div class="card span-8 reveal" style="--d:250ms"><div class="card-h"><h3>Maç uygunluğu</h3><span class="sub">${s.matches} maç · ortalama %${fmt(s.matchAvail * 100, 1)} · ${s.missed} oyuncu-maç sakatlıkla kaçırıldı</span><span class="grow"></span>
        <a class="btn btn-ghost" href="#matches" data-nav="matches">Maçlar ${I.arrow}</a></div>${availBars(M.matchAvailability(db, r).perMatch, M.recovery(db))}</div>
      ${congestionCard(db, r, 255)}

      ${pitchCard(260)}

      <div class="card span-8 reveal" style="--d:280ms">
        <div class="card-h"><h3>Sakatlık haritası</h3><span class="sub">${bodySrc.length} kayıt</span><span class="grow"></span>${seg("body", [["all", "Tümü"], ["tl", "Zaman kaybı"], ["active", "Aktif"]], S.bodyFilter)}</div>
        <div class="bm-wrap">
          <figure class="bm-fig" style="margin:0">${Body.svg("front", { heat, max })}<figcaption>ÖN</figcaption></figure>
          <figure class="bm-fig" style="margin:0">${Body.svg("back", { heat, max })}<figcaption>ARKA</figcaption></figure>
          <div class="rank-wrap"><ul class="rank">${ranked.map(([k, v], n) => `<li data-region="${k}"><span class="n">${String(n + 1).padStart(2, "0")}</span><span>${REGIONS[k]}</span><b class="tnum">${v}</b>
            <span class="bar"><i style="--w:${(v / ranked[0][1]) * 100}%;--d:${400 + n * 60}ms"></i></span></li>`).join("") || `<li>Kayıt yok</li>`}</ul>
            <div class="bm-legend"><span>Az</span><i></i><span>Çok</span></div></div>
        </div>
      </div>
      <div class="card span-4 reveal" style="--d:320ms">
        <div class="card-h"><h3>Mekanizma</h3><span class="sub">tüm kayıtlar</span></div>
        ${Charts.donut(Object.keys(MECHANISMS).map((k) => ({ label: MECHANISMS[k], value: mech[k] || 0, color: mechColors[k] })), { center: String(inRange.length), centerSub: "kayıt", size: 164 })}
        <div style="height:22px"></div>
        <div class="card-h" style="margin-bottom:12px"><h3>Şiddet</h3><span class="sub">gün kaybı</span></div>
        ${Charts.hbars(sevLabels.map((l, k) => ({ label: l, value: sevCounts[k], alt: k === 0 })))}
      </div>

      <div class="card span-7 reveal" style="--d:340ms">
        <div class="card-h"><h3>Kas sakatlıkları</h3><span class="sub">zaman kaybı · ${musN} vaka · zaman kaybı payı %${tl.length ? Math.round(musN / tl.length * 100) : 0}</span></div>
        <div class="muscles">${mus.map((g, k) => `<button class="mtile reveal" style="--d:${380 + k * 50}ms" data-region="${g.region}" data-act="region">
          <span class="tag">${g.label}</span><b class="tnum" data-count="${g.n}">0</b>
          <span class="mt-s">${g.days} gün kayıp${g.recurrent ? ` · <em>${g.recurrent} tekrarlayan</em>` : ""}</span>
          <span class="mt-bar"><i style="--w:${(g.n / musMax) * 100}%"></i></span>${g.active ? `<span class="mt-live"><i class="sdot out"></i>${g.active} aktif</span>` : ""}</button>`).join("")}</div>
      </div>
      <div class="card span-5 reveal" style="--d:360ms">
        <div class="card-h"><h3>Oyun anı</h3><span class="sub">sakatlığa yol açan durum</span></div>
        ${sitItems.length ? Charts.hbars(sitItems) : `<div class="empty">Kayıt yok.</div>`}
      </div>

      <div class="card span-8 reveal" style="--d:380ms">
        <div class="card-h"><h3>Aylık sakatlık</h3><span class="grow"></span>
          <div class="keys"><span><i style="background:var(--ink)"></i>Maç</span><span><i style="background:var(--blue)"></i>Antrenman</span><span><i style="background:var(--silver-solid)"></i>Tıbbi başvuru</span></div></div>
        ${Charts.stacked(series, [{ cls: "game" }, { cls: "training" }, { cls: "medical" }], { h: 220 })}
        <div style="height:10px"></div>
      </div>
      <div class="card span-4 reveal" style="--d:400ms">
        <div class="card-h"><h3>Doku tipi</h3><span class="sub">zaman kaybı</span></div>
        ${Charts.hbars(tissue.slice(0, 7))}
      </div>

      <div class="card span-12 reveal" style="--d:440ms">
        <div class="card-h"><h3>Sakatlık zaman çizelgesi</h3><span class="sub">bar uzunluğu = oyundan uzak kalınan süre</span><span class="grow"></span>
          <div class="keys"><span><i style="background:var(--ice-2)"></i>≤7 g</span><span><i style="background:var(--blue-2)"></i>8–28 g</span><span><i style="background:var(--blue)"></i>&gt;28 g</span><span><i style="background:var(--blue);box-shadow:0 0 0 1.5px var(--blue);background-image:repeating-linear-gradient(-45deg,transparent 0 3px,rgba(255,255,255,.4) 3px 6px)"></i>Aktif</span></div></div>
        ${ganttRows.length ? Charts.gantt(ganttRows, gr) : `<div class="empty">Bu dönemde kayıt yok.</div>`}
      </div>

      <div class="card span-12 reveal" style="--d:480ms">
        <div class="card-h"><h3>Son hareketler</h3><span class="sub">tüm katmanlardan gelen girişler</span></div>
        ${feed(10)}
      </div>
    </div>`;
  };

  function events() {
    const ev = [];
    for (const i of Store.db.injuries) {
      const p = Store.player(i.playerId); if (!p) continue;
      ev.push({ at: i.date, role: i.reportedBy, id: i.id, html: `<b>${esc(p.name)}</b> <span>${i.reportedBy === "athlete" ? "kendi bildirdi" : i.reportedBy === "reporter" ? "QR ile bildirildi (" + esc(i.reporterName || "") + ")" : "için kayıt açıldı"} ·</span> ${esc(regionTR(i))}` });
      if (i.diagnosed) ev.push({ at: i.diagnosed.at, role: "doctor", id: i.id, html: `<b>${esc(p.name)}</b> <span>· tanı onaylandı ·</span> ${esc(i.diagnosis)}` });
      for (const n of i.notes || []) ev.push({ at: n.at, role: n.role, id: i.id, html: `<b>${esc(p.name)}</b> <span>· ${esc(n.by)}:</span> ${esc(n.text)}` });
    }
    return ev.filter((e) => e.at <= todayISO).sort((a, b) => b.at.localeCompare(a.at));
  }
  function feed(n) {
    const icon = { athlete: I.person, physio: I.hand, doctor: I.steth, reporter: I.qr };
    return `<ul class="feed">${events().slice(0, n).map((e) => `<li data-injury="${e.id}" style="cursor:pointer"><span class="ico ${e.role}">${icon[e.role] || I.note}</span><p>${e.html}</p><time>${rel(e.at)}</time></li>`).join("")}</ul>`;
  }

  VIEWS.roster = () => {
    const db = Store.db, order = { out: 0, limited: 1, available: 2 };
    const ps = Store.activePlayers().map((p) => ({ p, st: M.status(p.id, db.injuries), inj: db.injuries.filter((i) => i.playerId === p.id && M.active(i)).sort((a, b) => b.date.localeCompare(a.date))[0] }))
      .sort((a, b) => order[a.st] - order[b.st] || a.p.no - b.p.no);
    const s = M.summary(db, range());
    return head("Kadro · " + ps.length + " oyuncu", `Kim sahada, <span>kim yolda.</span>`, `${s.counts.available} hazır · ${s.counts.limited} kısıtlı · ${s.counts.out} oynayamaz`) + `
    <div class="roster">${ps.length ? "" : `<div class="card empty">Kadro boş. Oyuncuları e-tablodaki <b>Oyuncular</b> sekmesine yazın; ID ve kişisel kod kendiliğinden oluşur.</div>`}${ps.map(({ p, st, inj }, k) => `<button class="pcard reveal ${st}" data-player="${p.id}" style="--d:${k * 35}ms">
      <span class="glare"></span><span class="num">${p.no}</span><span class="pos">${esc([p.pos, posTR(p).toLocaleUpperCase("tr"), p.height ? p.height + " CM" : ""].filter(Boolean).join(" · "))}</span>
      <h4>${esc(p.name)}</h4><span class="meta">${(() => { const st = M.playerStats(db, p.id, range()); return [st.matches ? `${st.played}/${st.matches} maç · ${fmt(st.minutes)} dk` : "", st.injury ? `${st.injury} maç kaçırdı` : "", db.injuries.filter((i) => i.playerId === p.id).length + " kayıt"].filter(Boolean).join(" · "); })()}</span>
      <div class="foot"><span class="pill ${st}"><i class="sdot ${st}"></i>${statusTR[st]}</span>
        ${inj ? `<span class="dx">${esc(inj.diagnosis || regionTR(inj) + " · bildirim")}</span><div class="prog"><i style="--w:${progress(inj) * 100}%"></i></div>
        <span class="tag">${stageOf(inj.stage).label}${eta(inj) && inj.stage !== "reported" ? " · ETA " + fd(eta(inj)) : ""}</span>` : `<span class="dx">Kısıtlama yok</span>`}</div></button>`).join("")}</div>`;
  };

  function sevPill(i) { const s = SEVERITY(M.days(i), i.timeLoss); return `<span class="pill ${s.id >= 4 ? "ink" : s.id >= 3 ? "available" : ""}">${s.label}</span>`; }
  function layerDots(i) {
    const steps = [!!i.reportedBy, !!i.assessed, !!i.diagnosed, i.stage === "rtp"];
    return `<span style="display:inline-flex;gap:3px" data-tip="Bildirim → Değerlendirme → Tanı → RTP">${steps.map((x) => `<i class="sdot" style="background:${x ? "var(--blue)" : "var(--line-2)"}"></i>`).join("")}</span>`;
  }
  VIEWS.log = () => {
    const f = S.log, r = range();
    let rows = Store.db.injuries.filter((i) => M.inRange(i, r));
    if (f.q) { const q = f.q.toLocaleLowerCase("tr"); rows = rows.filter((i) => (Store.player(i.playerId).name + " " + i.diagnosis + " " + regionTR(i)).toLocaleLowerCase("tr").includes(q)); }
    if (f.region) rows = rows.filter((i) => i.region === f.region);
    if (f.activity) rows = rows.filter((i) => i.activity === f.activity);
    if (f.status) rows = rows.filter((i) => (f.status === "active") === M.active(i));
    const key = { date: (i) => i.date, player: (i) => Store.player(i.playerId).name, region: (i) => REGIONS[i.region], days: (i) => M.days(i), missed: (i) => M.missed(i, Store.db), stage: (i) => STAGES.findIndex((s) => s.id === i.stage), dx: (i) => i.diagnosis }[f.sort];
    rows.sort((a, b) => { const x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * (f.asc ? 1 : -1); });
    const th = (k, l) => `<th data-sort="${k}" class="${f.sort === k ? "sorted" + (f.asc ? " asc" : "") : ""}">${l}</th>`;
    return head("Kayıt · " + rows.length, `Sakatlık <span>kaydı.</span>`, "Her satır bir sakatlık epizodu. Satıra tıklayarak ayrıntı, not ve aşama geçmişi.", seasonSeg() + (can("add") ? `<button class="btn btn-primary" data-act="new">${I.plus} Yeni</button>` : "")) + `
    <div class="card reveal" style="--d:80ms">
      <div class="toolbar">
        <input class="input" data-f="q" placeholder="Ara: oyuncu, tanı, bölge…" value="${esc(f.q)}">
        <select class="input" data-f="region"><option value="">Tüm bölgeler</option>${Object.entries(REGIONS).map(([k, v]) => `<option value="${k}" ${f.region === k ? "selected" : ""}>${v}</option>`).join("")}</select>
        <select class="input" data-f="activity"><option value="">Tüm aktiviteler</option>${Object.entries(ACTIVITIES).map(([k, v]) => `<option value="${k}" ${f.activity === k ? "selected" : ""}>${v}</option>`).join("")}</select>
        <select class="input" data-f="status"><option value="">Tüm durumlar</option><option value="active" ${f.status === "active" ? "selected" : ""}>Aktif</option><option value="closed" ${f.status === "closed" ? "selected" : ""}>Kapandı</option></select>
      </div>
      <div class="table-wrap"><table class="tbl"><thead><tr>${th("date", "Tarih")}${th("player", "Oyuncu")}${th("region", "Bölge")}${th("dx", "Tanı")}<th>Mekanizma</th><th>Oyun anı</th><th>Aktivite</th>${th("days", "Gün")}${th("missed", "Maç")}<th>Şiddet</th>${th("stage", "Aşama")}<th>Katman</th></tr></thead>
      <tbody>${rows.map((i) => { const p = Store.player(i.playerId); return `<tr data-injury="${i.id}">
        <td class="mono" style="white-space:nowrap">${fd(i.date)} <span style="color:var(--muted)">${i.date.slice(2, 4)}</span></td>
        <td><span class="pl"><span class="avatar">${p.no}</span>${esc(p.name)}</span></td>
        <td style="white-space:nowrap">${esc(regionTR(i))}</td>
        <td class="dxc">${i.diagnosis ? esc(i.diagnosis) : `<span style="color:var(--muted)">Tanı bekliyor</span>`}</td>
        <td style="white-space:nowrap">${MECHANISMS[i.mechanism] || "—"}</td><td style="white-space:nowrap">${SITUATIONS[i.situation] || "—"}</td><td>${ACTIVITIES[i.activity] || "—"}</td>
        <td class="tnum mono">${M.days(i)}</td><td class="tnum mono">${M.missed(i, Store.db) || "—"}</td><td>${sevPill(i)}</td>
        <td><span class="pill ${M.active(i) ? "outline" : ""}">${stageOf(i.stage).short}</span></td><td>${layerDots(i)}</td></tr>`; }).join("")}</tbody></table>
      ${rows.length ? "" : `<div class="empty">Filtreye uyan kayıt yok.</div>`}</div>
    </div>`;
  };

  VIEWS.board = () => {
    const db = Store.db;
    const cols = [...STAGES.slice(0, 4), { id: "rtp", label: "Son 30 gün dönenler", short: "RTP", who: "Hekim" }];
    const allowed = PERMS[role()].stages;
    return head("Rehabilitasyon", `Oyuna dönüş <span>hattı.</span>`, `Kartı sürükleyerek aşama değiştirin. ${role() === "physio" ? "Oyuna dönüş onayı yalnızca hekimdedir." : "Oyuna dönüş sütununa bırakmak klinik onay anlamına gelir."}`) + `
    <div class="board">${cols.map((c, k) => {
      const items = db.injuries.filter((i) => i.stage === c.id && (c.id !== "rtp" || (i.rtpDate && diffDays(i.rtpDate, todayISO) <= 30 && i.timeLoss))).sort((a, b) => a.date.localeCompare(b.date));
      const locked = !allowed.includes(c.id);
      return `<div class="col reveal" data-col="${c.id}" style="--d:${k * 60}ms"><div class="col-h"><div>${c.label}<small>${c.who}${locked ? " · kilitli" : ""}</small></div><span class="c">${items.length}</span>${locked ? `<span class="lock">${I.lock}</span>` : ""}</div>
      ${items.map((i) => { const p = Store.player(i.playerId); return `<div class="kcard" draggable="${can("assess") && M.active(i)}" data-injury="${i.id}">
        <div class="kc-top"><span class="avatar">${p.no}</span>${esc(p.name)}</div>
        <div class="kc-dx">${esc(i.diagnosis || regionTR(i) + " — sporcu bildirimi")}</div>
        ${M.active(i) && i.stage !== "reported" ? `<div class="prog" style="margin-bottom:10px"><i style="--w:${progress(i) * 100}%"></i></div>` : ""}
        <div class="kc-meta"><span>${M.days(i)}. gün</span><span class="grow"></span>${i.stage === "rtp" ? "✓ " + fd(i.rtpDate) : eta(i) ? "ETA " + fd(eta(i)) : "ağrı " + i.pain + "/10"}</div></div>`; }).join("")}</div>`;
    }).join("")}</div>`;
  };

  VIEWS.inbox = () => {
    const d = Store.db.injuries, isDoc = role() === "doctor";
    const reports = d.filter((i) => i.stage === "reported").sort((a, b) => b.date.localeCompare(a.date));
    const dx = d.filter((i) => M.active(i) && i.stage !== "reported" && !i.diagnosed);
    const rtp = d.filter((i) => i.stage === "rtt");
    const canPlayTR = { yes: "Oynayabilirim", limited: "Kısıtlı oynayabilirim", no: "Oynayamam" }, canPlay3 = { yes: "Oynayabilir", limited: "Kısıtlı oynayabilir", no: "Oynayamaz" };
    const item = (i, kind) => {
      const p = Store.player(i.playerId);
      const ico = kind === "report" ? `<span class="ib-ico">${i.reportedBy === "reporter" ? I.qr : I.person}</span>` : kind === "dx" ? `<span class="ib-ico dx">${I.steth}</span>` : `<span class="ib-ico rtp">${I.shield}</span>`;
      const h = kind === "report" ? `${esc(p.name)} · ${esc(regionTR(i))}` : kind === "dx" ? `${esc(p.name)} · tanı onayı` : `${esc(p.name)} · oyuna dönüş onayı`;
      const sub = kind === "report" ? `${i.reportedBy === "reporter" ? "QR · " + esc(i.reporterName || "") : "Sporcu bildirimi"} · ${rel(i.date)} · ağrı ${i.pain}/10 · ${ACTIVITIES[i.activity]} · ${(i.reportedBy === "reporter" ? canPlay3 : canPlayTR)[i.canPlay] || ""}` :
        kind === "dx" ? `${esc(i.diagnosis || "Ön tanı yok")} · ${esc(i.assessed?.by || "")} değerlendirdi` : `${esc(i.diagnosis)} · ${M.days(i)}. gün · fizyoterapist RTT aşamasına aldı`;
      const act = kind === "report" ? (can("assess") ? `<button class="btn btn-primary" data-act="assess" data-id="${i.id}">Değerlendir</button>` : "") :
        kind === "dx" ? (isDoc ? `<button class="btn btn-primary" data-act="edit" data-id="${i.id}">Tanıyı onayla</button>` : `<span class="pill outline">${I.lock} Hekimde</span>`) :
        (isDoc ? `<button class="btn btn-ghost" data-injury="${i.id}">İncele</button><button class="btn btn-blue" data-act="clear" data-id="${i.id}">${I.check} Oyuna dönüş onayı</button>` : `<span class="pill outline">${I.lock} Hekimde</span>`);
      return `<div class="ib-item reveal" data-row="${i.id}">${ico}<div><h4>${h}</h4><p>${sub}</p>${i.athleteNote && kind === "report" ? `<div class="quote">“${esc(i.athleteNote)}”</div>` : ""}</div><div class="ib-actions">${act}</div></div>`;
    };
    const sec = (t, arr, kind, sub) => arr.length ? `<div class="d-sec"><h5>${t} · ${arr.length}</h5>${sub ? `<p style="margin:-6px 0 12px;color:var(--muted);font-size:13px">${sub}</p>` : ""}<div class="inbox">${arr.map((i) => item(i, kind)).join("")}</div></div>` : "";
    const total = reports.length + (isDoc ? dx.length + rtp.length : 0);
    return head("Katmanlar arası akış", isDoc ? `Onay <span>kutusu.</span>` : `Gelen <span>bildirimler.</span>`, total ? `${total} öğe işlem bekliyor.` : "Her şey güncel.") +
      sec("Sporcu bildirimleri", reports, "report", "Sporcunun kendi girdiği şikâyetler. Değerlendirildiğinde kayıt akut aşamaya geçer.") +
      (isDoc || dx.length ? sec("Tanı onayı bekleyen", dx, "dx", "Fizyoterapist değerlendirmesi yapılmış, hekim tanısı girilmemiş vakalar.") : "") +
      (isDoc || rtp.length ? sec("Oyuna dönüş kararı", rtp, "rtp", "Antrenmana dönmüş, oyuna dönüş için hekim onayı bekleyen sporcular.") : "") +
      (total ? "" : `<div class="card reveal" style="text-align:center;padding:64px 20px"><div class="success" style="padding:0"><div class="check"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div><h3 style="margin:0;font-size:22px;letter-spacing:-.03em">Bekleyen işlem yok</h3></div></div>`);
  };

  VIEWS.exposure = () => {
    const rows = [...Store.db.exposure].reverse();
    const r = range(), ex = M.exposure(Store.db, r);
    const fixtures = M.matches(Store.db, r).length;
    const games = fixtures || Store.db.exposure.filter((x) => !r || (x.week >= r.start && x.week <= r.end)).reduce((s, x) => s + x.games, 0);
    const monday = (() => { const d = new Date(TODAY); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); })();
    return head("Paydalar", `Maruziyet <span>saatleri.</span>`, "İnsidans ve yük hesabının paydası. Antrenman: haftalık takım saatleri. Maç: maç kadrolarındaki bireysel dakikalar (kadrosu girilmemiş maçta 11 oyuncu × 90 dk).", seasonSeg()) + `
    <div class="grid g-12">
      <div class="card kpi span-3 reveal"><span class="k-l">Toplam</span><span class="k-v tnum"><span data-count="${ex.total}">0</span><small>oyuncu-saat</small></span><span class="k-s">${rows.filter((x) => !r || (x.week >= r.start && x.week <= r.end)).length} hafta</span></div>
      <div class="card kpi span-3 reveal" style="--d:40ms"><span class="k-l">Antrenman</span><span class="k-v tnum"><span data-count="${ex.training}">0</span><small>sa</small></span><span class="k-s">${fmt(ex.total ? ex.training / ex.total * 100 : 0, 1)}%</span></div>
      <div class="card kpi span-3 reveal" style="--d:80ms"><span class="k-l">Maç</span><span class="k-v tnum"><span data-count="${ex.game}" data-dec="0">0</span><small>sa</small></span><span class="k-s">${games} maç${fixtures ? " · bireysel dakika" : " · tahmini"}</span></div>
      <div class="card span-3 reveal" style="--d:120ms">
        <form id="expo" class="fgrid" style="grid-template-columns:1fr 1fr;gap:10px">
          <label class="field full"><span>Hafta başı (Pzt)</span><input class="input" type="date" name="week" value="${monday}" required></label>
          <label class="field"><span>Seans</span><input class="input" type="number" name="sessions" value="5" min="0"></label>
          <label class="field"><span>Saat/seans</span><input class="input" type="number" step=".25" name="hours" value="1.25" min="0"></label>
          <label class="field"><span>Oyuncu</span><input class="input" type="number" name="players" value="${Store.activePlayers().length}" min="0"></label>
          <label class="field"><span>Maç <span data-tip="Fikstür girildiyse maç maruziyeti oradan hesaplanır; bu alan yalnızca yedek tahmindir." class="info">i</span></span><input class="input" type="number" name="games" value="1" min="0"></label>
          <button class="btn btn-primary full">Kaydet</button></form></div>
      <div class="card span-12 reveal" style="--d:160ms"><div class="table-wrap"><table class="tbl" style="min-width:560px"><thead><tr><th>Hafta</th><th>Seans</th><th>Saat/seans</th><th>Oyuncu</th><th>Maç</th><th>Antrenman sa</th><th>Maç sa</th></tr></thead>
        <tbody>${rows.slice(0, 30).map((x) => { const h = expoHours(x); return `<tr data-week="${x.week}"><td class="mono">${fdl(x.week)}</td><td>${x.sessions}</td><td>${x.hours}</td><td>${x.players}</td><td>${x.games}</td><td class="mono">${fmt(h.training)}</td><td class="mono">${fmt(h.game, 1)}</td></tr>`; }).join("")}</tbody></table></div></div>
    </div>`;
  };

  VIEWS.me = () => {
    const p = me(); if (!p) return `<div class="empty">Oyuncu bulunamadı.</div>`;
    const mine = Store.db.injuries.filter((i) => i.playerId === p.id).sort((a, b) => b.date.localeCompare(a.date));
    const active = mine.filter(M.active), st = M.status(p.id, Store.db.injuries);
    const heat = Body.heatFrom(mine);
    const cur = active[0];
    const hello = new Date().getHours() < 12 ? "Günaydın" : new Date().getHours() < 18 ? "İyi günler" : "İyi akşamlar";
    return `<div class="me-hero">
      <div class="me-card dark reveal"><span class="bg-num">${p.no}</span>
        <div class="eyebrow" style="color:#7c7c84"><span class="live"></span>${fdl(todayISO)}</div>
        <h2>${hello},<br>${esc(p.name.split(" ")[0])}.</h2>
        <div class="status-big"><i class="sdot ${st}"></i><span>${st === "available" ? "Tam hazırsın. Aktif kısıtlama yok." : cur ? `${stageOf(cur.stage).label} · ${esc(cur.diagnosis || regionTR(cur))}` : statusTR[st]}</span></div>
        ${cur && cur.stage !== "reported" && eta(cur) ? `<div style="margin-top:16px;max-width:360px"><div class="prog" style="background:rgba(255,255,255,.1)"><i style="--w:${progress(cur) * 100}%"></i></div><div style="display:flex;justify-content:space-between;font-size:12px;color:#7c7c84;margin-top:8px" class="mono"><span>${M.days(cur)}. gün</span><span>Tahmini dönüş ${fd(eta(cur))}</span></div></div>` : ""}
      </div>
      <button class="report-cta reveal" data-act="report" style="--d:80ms"><span class="arrow">${I.arrow}</span><span class="tag" style="color:rgba(255,255,255,.7)">30 saniye</span>
        <h3>Bir şey mi<br>hissediyorsun?</h3><p>Çekilme, burkulma, darbe, tutulma — küçük görünse de bildir. Sağlık ekibi hemen görür.</p></button>
    </div>
    <div class="grid g-12" style="margin-top:16px">
      ${(() => { const st = M.playerStats(Store.db, p.id, SEASONS.find((x) => x.id === currentSeasonId())); return st.matches ? `<div class="card span-12 reveal me-stats" style="--d:100ms">
        <div><span class="tag">Bu sezon</span><b class="tnum">${st.played}<small>/${st.matches} maç</small></b></div><div><span class="tag">İlk 11</span><b class="tnum">${st.starts}</b></div>
        <div><span class="tag">Dakika</span><b class="tnum">${fmt(st.minutes)}</b></div><div><span class="tag">Sakatlıkla kaçırılan</span><b class="tnum">${st.injury}</b></div></div>` : ""; })()}
      ${cur ? `<div class="card span-12 reveal" style="--d:120ms"><div class="card-h"><h3>Süreç</h3><span class="sub">${esc(regionTR(cur))}</span></div>${trail(cur)}
        ${cur.notes?.length ? `<div class="d-sec"><h5>Sağlık ekibinden notlar</h5>${notesList(cur)}</div>` : ""}</div>` : ""}
      <div class="card span-5 reveal" style="--d:160ms"><div class="card-h"><h3>Sakatlık geçmişin</h3><span class="sub">${mine.length} kayıt</span></div>
        <div class="bm-wrap" style="grid-template-columns:1fr 1fr">${Body.svg("front", { heat })}${Body.svg("back", { heat })}</div></div>
      <div class="card span-7 reveal" style="--d:200ms"><div class="card-h"><h3>Geçmiş</h3></div>
        <div class="hist">${mine.map((i) => `<button data-injury="${i.id}"><time>${fd(i.date)} ${i.date.slice(2, 4)}</time><span><b style="font-weight:550">${esc(i.diagnosis || regionTR(i))}</b><br><span style="color:var(--muted);font-size:12.5px">${esc(regionTR(i))} · ${ACTIVITIES[i.activity]}</span></span><span class="pill ${M.active(i) ? "outline" : ""}">${M.active(i) ? stageOf(i.stage).short : M.days(i) + " gün"}</span></button>`).join("") || `<div class="empty">Kayıt yok — böyle devam.</div>`}</div></div>
    </div>`;
  };

  /* ───────── Injury detail ───────── */
  function trail(i) {
    const t = [
      { l: "Bildirim", who: i.reportedBy === "athlete" ? "Sporcu" : i.reportedBy === "reporter" ? "QR · " + (i.reporterName || "") : i.reportedBy === "doctor" ? "Hekim" : "Fizyoterapist", at: i.date, done: true },
      { l: "Değerlendirme", who: i.assessed?.by || "Fizyoterapist", at: i.assessed?.at, done: !!i.assessed },
      { l: "Tanı", who: i.diagnosed?.by || "Hekim", at: i.diagnosed?.at, done: !!i.diagnosed },
      { l: "Oyuna dönüş", who: "Hekim onayı", at: i.rtpDate, done: i.stage === "rtp" },
    ];
    const nowIdx = t.findIndex((x) => !x.done);
    return `<div class="trail">${t.map((x, k) => `<div class="t ${x.done ? "done" : ""} ${k === nowIdx ? "now" : ""}"><i>${x.done ? I.check : ""}</i><b>${x.l}</b><span>${esc(x.who)}${x.at ? " · " + fd(x.at) : ""}</span></div>`).join("")}</div>`;
  }
  function notesList(i) {
    const icon = { athlete: I.person, physio: I.hand, doctor: I.steth };
    return `<ul class="notes">${(i.notes || []).slice().reverse().map((n) => `<li><span class="avatar" style="width:28px;height:28px">${icon[n.role] || ""}</span><div><small>${esc(n.by)} · ${fdl(n.at)}</small><p>${esc(n.text)}</p></div></li>`).join("") || `<li style="display:block;color:var(--muted)">Henüz not yok.</li>`}</ul>`;
  }
  function openInjury(id) {
    const i = Store.injury(id); if (!i || role() === "coach") return;
    const p = Store.player(i.playerId), staff = role() !== "athlete";
    const allowed = PERMS[role()].stages;
    const html = drawerHead("Sakatlık · " + i.id.toUpperCase(), staff && can("add") ? `<button class="btn btn-ghost" data-act="edit" data-id="${i.id}">${I.edit} Düzenle</button>` : "") + `
      <div class="drawer-b">
        <button class="pl" data-player="${p.id}" style="display:flex;align-items:center;gap:10px"><span class="avatar lg">${p.no}</span><span style="text-align:left"><b>${esc(p.name)}</b><br><span style="color:var(--muted);font-size:12.5px">${esc(pmeta(p))}</span></span></button>
        <h2 class="d-title">${esc(i.diagnosis || "Tanı bekliyor")}</h2>
        <div class="chips"><span class="pill">${esc(regionTR(i))}</span>${sevPill(i)}<span class="pill ${M.active(i) ? "outline" : ""}">${stageOf(i.stage).label}</span>${i.recurrence !== "new" ? `<span class="pill ink">${RECURRENCE[i.recurrence]}</span>` : ""}</div>
        <div class="d-sec"><h5>Doğrulama katmanları</h5>${trail(i)}</div>
        <div class="d-sec"><h5>Epizod</h5><div class="facts">
          <div><span>Başlangıç</span><b>${fdl(i.date)}</b></div><div><span>${i.rtpDate ? "Oyuna dönüş" : "Tahmini dönüş"}</span><b>${i.rtpDate ? fdl(i.rtpDate) : eta(i) ? fdl(eta(i)) : "—"}</b></div><div><span>Gün</span><b class="tnum">${M.days(i)}${i.expectedDays && M.active(i) ? " / " + i.expectedDays : ""}</b></div><div><span>Kaçırılan maç</span><b class="tnum">${M.missed(i, Store.db)}</b></div>
          <div><span>Aktivite</span><b>${ACTIVITIES[i.activity] || "—"}</b></div><div><span>Mekanizma</span><b>${MECHANISMS[i.mechanism] || "—"}</b></div><div><span>Oyun anı</span><b>${SITUATIONS[i.situation] || "—"}</b></div>
          <div><span>Doku</span><b>${TISSUES[i.tissue] || "—"}</b></div><div><span>Zaman kaybı</span><b>${i.timeLoss ? "Evet" : "Hayır"}</b></div><div><span>Ağrı (ilk)</span><b class="tnum">${i.pain ?? "—"}/10</b></div><div><span>Başlangıç şekli</span><b>${i.onset === "gradual" ? "Kademeli" : "Ani"}</b></div>
        </div></div>
        ${i.reportedBy === "reporter" ? `<div class="d-sec"><h5>Bildiren</h5><span class="pill">${I.qr} QR · ${esc(i.reporterName || "")}</span></div>` : ""}
        ${i.athleteNote ? `<div class="d-sec"><h5>${i.reportedBy === "reporter" ? "Bildirimdeki açıklama" : "Sporcunun ifadesi"}</h5><div class="quote" style="font-size:14px;padding-left:12px;border-left:2px solid var(--blue)">“${esc(i.athleteNote)}”</div></div>` : ""}
        ${staff ? `<div class="d-sec"><h5>Aşama</h5><div class="stepper">${STAGES.map((s, k) => {
          const ci = STAGES.findIndex((x) => x.id === i.stage);
          const dis = !allowed.includes(s.id) || s.id === i.stage;
          return `<button data-act="stage" data-id="${i.id}" data-stage="${s.id}" class="${k < ci ? "past" : k === ci ? "cur" : ""}" ${dis ? "disabled" : ""}><b>${s.short}</b><span>${s.who}${!allowed.includes(s.id) && s.id !== i.stage ? " 🔒" : ""}</span></button>`;
        }).join("")}</div></div>` : ""}
        <div class="d-sec"><h5>Notlar</h5>${notesList(i)}
          ${staff || (role() === "athlete" && M.active(i)) ? `<form class="note-add" data-note="${i.id}"><input class="input" name="t" placeholder="${role() === "athlete" ? "Ekibe bir not bırak…" : "Klinik not ekle…"}" autocomplete="off"><button class="btn btn-primary">Ekle</button></form>` : ""}</div>
        ${can("remove") ? `<div class="d-sec"><button class="btn btn-ghost btn-danger" data-act="remove" data-id="${i.id}">${I.trash} Kaydı sil</button></div>` : ""}
      </div>`;
    openDrawer(html);
  }

  function openPlayer(id) {
    const p = Store.player(id); if (!p) return;
    if (!clinical()) return openPlayerLite(p);
    const inj = Store.db.injuries.filter((i) => i.playerId === id).sort((a, b) => b.date.localeCompare(a.date));
    const st = M.status(id, Store.db.injuries), heat = Body.heatFrom(inj);
    const days = inj.reduce((s, i) => s + (i.timeLoss ? M.days(i) : 0), 0);
    openDrawer(drawerHead("Oyuncu profili", can("add") ? `<button class="btn btn-primary" data-act="new" data-player="${id}">${I.plus} Sakatlık ekle</button>` : "") + `
      <div class="drawer-b">
        <div style="display:flex;align-items:flex-end;gap:18px"><span class="big-no">${p.no}</span>
          <div><span class="tag">${esc(pmeta(p))}</span><h2 class="d-title" style="margin:4px 0 8px">${esc(p.name)}</h2><span class="pill ${st}"><i class="sdot ${st}"></i>${statusTR[st]}</span></div></div>
        <div class="d-sec"><div class="facts"><div><span>Kayıt</span><b class="tnum">${inj.length}</b></div><div><span>Kayıp gün</span><b class="tnum">${days}</b></div><div><span>Kişisel kod</span><b class="mono">${role() === "doctor" ? p.code : "••••"}</b></div></div></div>
        ${(() => { const ss = M.playerStats(Store.db, id, range()); return ss.matches ? `<div class="d-sec"><h5>Maç katılımı · ${range() ? range().label : "tüm zamanlar"}</h5><div class="facts">
          <div><span>Oynadı</span><b class="tnum">${ss.played} / ${ss.matches}</b></div><div><span>İlk 11 · yedek</span><b class="tnum">${ss.starts} · ${ss.subs}</b></div><div><span>Dakika</span><b class="tnum">${fmt(ss.minutes)}</b></div>
          <div><span>Sakatlıkla kaçırdı</span><b class="tnum">${ss.injury}</b></div><div><span>Hastalık · diğer</span><b class="tnum">${ss.illness} · ${ss.other}</b></div><div><span>Maç uygunluğu</span><b class="tnum">%${Math.round(ss.availability * 100)}</b></div></div></div>` : ""; })()}
        ${role() === "doctor" && p.code ? `<div class="d-sec"><h5>Kişisel QR</h5><div class="pqr-one">${qrSvg(athleteLink(p), 120)}<div><p>Oyuncu okutunca doğrudan kendi bildirim ekranına girer. Yalnızca oyuncunun kendisine verin.</p>
          <button class="btn btn-ghost" data-act="pqr" data-id="${p.id}">${I.download} PNG indir</button></div></div></div>` : ""}
        <div class="d-sec"><h5>Sakatlık haritası</h5><div class="bm-wrap" style="grid-template-columns:1fr 1fr;max-width:420px">${Body.svg("front", { heat })}${Body.svg("back", { heat })}</div></div>
        <div class="d-sec"><h5>Geçmiş</h5><div class="hist">${inj.map((i) => `<button data-injury="${i.id}"><time>${fd(i.date)} ${i.date.slice(2, 4)}</time><span><b style="font-weight:550">${esc(i.diagnosis || "Tanı bekliyor")}</b><br><span style="color:var(--muted);font-size:12.5px">${esc(regionTR(i))} · ${ACTIVITIES[i.activity]}</span></span>${sevPill(i)}</button>`).join("") || `<div class="empty">Kayıt yok.</div>`}</div></div>
      </div>`);
  }

  // Coach: availability only — no diagnosis, notes, history or athlete statements.
  function openPlayerLite(p) {
    const x = squadState().find((y) => y.p.id === p.id) || { p, st: "available" };
    const i = x.inj;
    openDrawer(drawerHead("Uygunluk") + `
      <div class="drawer-b">
        <div style="display:flex;align-items:flex-end;gap:18px"><span class="big-no">${p.no}</span>
          <div><span class="tag">${esc(pmeta(p))}</span><h2 class="d-title" style="margin:4px 0 8px">${esc(p.name)}</h2><span class="pill ${x.st}"><i class="sdot ${x.st}"></i>${statusTR[x.st]}</span></div></div>
        ${i ? `<div class="d-sec"><div class="facts"><div><span>Bölge</span><b>${esc(regionTR(i))}</b></div><div><span>Süreç</span><b>${stageOf(i.stage).label}</b></div>
          <div><span>Tahmini dönüş</span><b>${i.stage !== "reported" && eta(i) ? fdl(eta(i)) : "Değerlendiriliyor"}</b></div></div>
          ${i.stage !== "reported" && i.expectedDays ? `<div style="margin-top:18px"><div class="prog"><i style="--w:${progress(i) * 100}%"></i></div></div>` : ""}</div>` : `<div class="d-sec"><p style="color:var(--ink-3)">Aktif kısıtlama yok. Tam katılım.</p></div>`}
        ${(() => { const id = p.id; return `${(() => { const ss = M.playerStats(Store.db, id, range()); return ss.matches ? `<div class="d-sec"><h5>Maç katılımı · ${range() ? range().label : "tüm zamanlar"}</h5><div class="facts">
          <div><span>Oynadı</span><b class="tnum">${ss.played} / ${ss.matches}</b></div><div><span>İlk 11 · yedek</span><b class="tnum">${ss.starts} · ${ss.subs}</b></div><div><span>Dakika</span><b class="tnum">${fmt(ss.minutes)}</b></div>
          <div><span>Sakatlıkla kaçırdı</span><b class="tnum">${ss.injury}</b></div><div><span>Hastalık · diğer</span><b class="tnum">${ss.illness} · ${ss.other}</b></div><div><span>Maç uygunluğu</span><b class="tnum">%${Math.round(ss.availability * 100)}</b></div></div></div>` : ""; })()}`; })()}
        <p class="lock-note">${I.lock} Tanı, klinik notlar ve sporcu ifadeleri teknik ekiple paylaşılmaz. Ayrıntı için takım hekimiyle görüşün.</p>
      </div>`);
  }

  /* ───────── Injury form (staff) ───────── */
  let F = null;
  function openForm(existing, preset = {}) {
    if (!existing && !Store.activePlayers().length) { toast("Önce kadroya oyuncu ekleyin (Oyuncular sekmesi)"); return; }
    const base = existing ? JSON.parse(JSON.stringify(existing)) : {
      id: "", playerId: preset.playerId || Store.activePlayers()[0].id, date: todayISO, region: "", side: "R", tissue: "muscle", diagnosis: "", mechanism: "noncontact", situation: "sprint",
      activity: "training", onset: "sudden", recurrence: "new", timeLoss: true, expectedDays: 7, stage: "acute", rtpDate: null, pain: 4, reportedBy: role(), notes: [],
    };
    if (preset.assess && base.stage === "reported") base.stage = "acute";
    F = { data: base, view: base.region && !Body.hasView(base.region, "front") ? "back" : "front", isNew: !existing, confirmDx: role() === "doctor" && !!base.diagnosed, assessing: !!preset.assess };
    const t = F.isNew ? "Yeni sakatlık" : F.assessing ? "Bildirimi değerlendir" : "Kaydı düzenle";
    openDrawer(drawerHead(t) + `<form class="drawer-b" id="injform" autocomplete="off"></form>
      <div class="drawer-f"><button class="btn btn-ghost" data-act="close">Vazgeç</button><button class="btn btn-primary" data-act="saveform">${I.check} Kaydet</button></div>`);
    renderForm();
  }
  function renderForm() {
    const d = F.data, form = $("#injform"); if (!form) return;
    const sc = form.scrollTop;
    const sel = d.region ? { region: d.region, side: d.side } : null;
    const opts = (obj, cur) => Object.entries(obj).map(([k, v]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${v}</option>`).join("");
    const chipset = (name, obj) => `<div class="chips" data-chips="${name}">${Object.entries(obj).map(([k, v]) => `<button type="button" class="chip ${d[name] === k ? "on" : ""}" data-v="${k}">${v}</button>`).join("")}</div>`;
    const allowed = PERMS[role()].stages.filter((s) => s !== "reported");
    form.innerHTML = `
      ${F.assessing && d.athleteNote ? `<div class="card" style="background:var(--blue-soft);border:0;margin-bottom:20px"><span class="tag">Sporcu bildirimi · ağrı ${d.pain}/10</span><p style="margin:6px 0 0">“${esc(d.athleteNote)}”</p></div>` : ""}
      <div class="fgrid">
        <label class="field"><span>Oyuncu</span><select class="input" name="playerId" ${F.assessing ? "disabled" : ""}>${Store.db.players.filter((p) => p.active !== false || p.id === d.playerId).map((p) => `<option value="${p.id}" ${p.id === d.playerId ? "selected" : ""}>#${p.no} · ${esc(p.name)}</option>`).join("")}</select></label>
        <label class="field"><span>Başlangıç tarihi</span><input class="input" type="date" name="date" value="${d.date}" max="${todayISO}"></label>
        <div class="field full"><span>Bölge — haritada dokunun</span>
          <div class="picker"><div>${Body.svg("front", { interactive: true, selected: sel, label: true })}</div><div>${Body.svg("back", { interactive: true, selected: sel, label: true })}</div>
            <div class="picker-out">${d.region ? `Seçili: <b>${esc(regionTR(d))}</b>` : "Henüz bölge seçilmedi"}</div></div></div>
        <label class="field"><span>Doku / patoloji tipi</span><select class="input" name="tissue">${opts(TISSUES, d.tissue)}</select></label>
        <label class="field"><span>Tekrar durumu</span><select class="input" name="recurrence">${opts(RECURRENCE, d.recurrence)}</select></label>
        <label class="field full"><span>Tanı ${role() === "physio" ? "(ön tanı — hekim onaylar)" : ""}</span><input class="input" name="diagnosis" value="${esc(d.diagnosis)}" placeholder="ör. Hamstring strain — BFlh (BAMIC 2a)"></label>
        <div class="field full"><span>Mekanizma</span>${chipset("mechanism", MECHANISMS)}</div>
        <div class="field full"><span>Oyun anı</span>${chipset("situation", SITUATIONS)}</div>
        <div class="field"><span>Aktivite</span>${chipset("activity", ACTIVITIES)}</div>
        <div class="field"><span>Başlangıç şekli</span>${chipset("onset", { sudden: "Ani", gradual: "Kademeli" })}</div>
        <div class="field full"><span>Ağrı · <b class="tnum" id="painv">${d.pain}</b>/10</span><input class="range" type="range" min="0" max="10" name="pain" value="${d.pain}" style="--p:${d.pain * 10}%"></div>
        <div class="field"><span>Zaman kaybı</span><button type="button" class="toggle ${d.timeLoss ? "on" : ""}" data-toggle="timeLoss" aria-pressed="${d.timeLoss}"></button></div>
        <label class="field"><span>Tahmini süre (gün)</span><input class="input" type="number" min="0" name="expectedDays" value="${d.expectedDays || 0}"></label>
        <label class="field"><span>Aşama</span><select class="input" name="stage">${STAGES.filter((s) => allowed.includes(s.id) || s.id === d.stage).map((s) => `<option value="${s.id}" ${s.id === d.stage ? "selected" : ""} ${!allowed.includes(s.id) ? "disabled" : ""}>${s.label}</option>`).join("")}</select></label>
        ${role() === "doctor" ? `<div class="field"><span>Hekim tanı onayı</span><button type="button" class="toggle ${F.confirmDx ? "on" : ""}" data-toggle="confirmDx"></button></div>` : `<div class="field"><span>Hekim tanı onayı</span><span class="pill outline" style="height:30px">${I.lock} Yalnızca hekim</span></div>`}
        <label class="field full"><span>Klinik not (opsiyonel)</span><textarea class="input" name="note" placeholder="Muayene bulguları, görüntüleme planı, yük önerisi…"></textarea></label>
      </div>`;
    form.scrollTop = sc;
  }
  function readForm() {
    const form = $("#injform"), d = F.data;
    for (const el of $$("[name]", form)) {
      if (el.name === "note" || el.disabled) continue;
      d[el.name] = el.type === "number" || el.type === "range" ? Number(el.value) : el.value;
    }
    return ($("[name=note]", form)?.value || "").trim();
  }
  async function saveForm() {
    const note = readForm(), d = F.data;
    if (!d.region) { toast("Önce haritadan bölge seçin"); return; }
    const r = role(), now = todayISO;
    if (!d.assessed && d.stage !== "reported") d.assessed = { by: ROLES[r].name, at: now };
    if (r === "doctor") d.diagnosed = F.confirmDx && d.diagnosis ? (d.diagnosed || { by: ROLES.doctor.name, at: now }) : null;
    if (d.stage === "rtp" && !d.rtpDate) d.rtpDate = d.timeLoss ? now : d.date;
    if (d.stage !== "rtp") d.rtpDate = null;
    if (note) (d.notes = d.notes || []).push(mkNote(note));
    if (F.assessing) (d.notes = d.notes || []).push(mkNote("Sporcu bildirimi değerlendirildi."));
    const wasNew = F.isNew;
    await Store.saveInjury(d, auth());
    closeDrawer();
    toast(wasNew ? "Sakatlık kaydedildi" : "Kayıt güncellendi");
  }

  /* ───────── Athlete report wizard ───────── */
  let W = null;
  function openReport() {
    const rep = role() === "reporter";
    W = { step: 0, rep, keys: rep ? ["player", "region", "pain", "play"] : ["region", "pain", "play"], view: "front",
      d: { playerId: "", region: "", side: "R", pain: 3, activity: "training", situation: "", onset: "sudden", canPlay: "limited", athleteNote: "", date: todayISO } };
    openDrawer(drawerHead(rep ? "QR bildirimi" : "Yeni bildirim") + `<div class="drawer-b" id="wiz"></div><div class="drawer-f" id="wizf"></div>`);
    renderWiz();
  }
  function renderWiz() {
    const w = W, d = w.d, el = $("#wiz"), foot = $("#wizf"); if (!el) return;
    const last = w.keys.length - 1, key = w.keys[w.step], rep = w.rep;
    const steps = `<div class="wiz-steps">${w.keys.map((_, k) => `<i class="${k <= w.step ? "on" : ""}"></i>`).join("")}</div>`;
    const sel = d.region ? { region: d.region, side: d.side } : null;
    const painC = d.pain >= 7 ? "var(--out)" : d.pain >= 4 ? "var(--limited)" : "var(--blue)";
    const painL = ["Ağrı yok", "Çok hafif", "Hafif", "Hafif", "Orta", "Orta", "Belirgin", "Şiddetli", "Şiddetli", "Çok şiddetli", "Dayanılmaz"][d.pain];
    const opt = (name, v, t, s2, icon = "") => `<button type="button" class="opt ${d[name] === v ? "on" : ""}" data-w="${name}" data-v="${v}">${icon}<b>${t}</b><span>${s2}</span></button>`;
    const pl = d.playerId ? Store.player(d.playerId) : null;
    if (w.step > last) {
      el.innerHTML = `<div class="success wiz-pane"><div class="check"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
        <h2 class="wiz-q">${rep ? "Bildirim ulaştı." : "Bildirimin ulaştı."}</h2><p class="wiz-hint" style="max-width:360px;margin:8px auto 0">${rep ? `${esc(pl?.name || "")} için bildirim sağlık ekibine iletildi. Değerlendirilip onaylanana kadar istatistiklere girmez.` : "Fizyoterapist bildirimi değerlendirecek, gerekirse hekim muayenesi planlanacak. Süreci “Durumum” ekranından izleyebilirsin."}</p></div>`;
      foot.innerHTML = rep ? `<button class="btn btn-ghost" data-act="close">Kapat</button><button class="btn btn-primary" data-act="report">${I.plus} Yeni bildirim</button>` : `<button class="btn btn-primary" data-act="close">Tamam</button>`;
      return;
    }
    const who = rep && pl ? `<div class="wiz-who"><span class="avatar">${pl.no}</span>${esc(pl.name)}</div>` : "";
    const panes = {
      player: `<h2 class="wiz-q">Hangi oyuncu?</h2><p class="wiz-hint">Bildirimi kimin adına yapıyorsun?</p>
        ${Object.keys(LINES).map((l) => { const ps = Store.activePlayers().filter((p) => (POSITIONS[p.pos]?.line || "MF") === l); return ps.length ? `<div class="d-sec" style="margin-top:14px"><h5>${LINES[l]}</h5><div class="pick-grid">${ps.map((p) => `<button type="button" class="pick ${d.playerId === p.id ? "on" : ""}" data-w="playerId" data-v="${p.id}"><b class="mono">${p.no}</b>${esc(p.name)}</button>`).join("")}</div></div>` : ""; }).join("")}`,
      region: `${who}<h2 class="wiz-q">${rep ? "Hangi bölge?" : "Neren ağrıyor?"}</h2><p class="wiz-hint">Ön ya da arka görünümde ilgili bölgeye dokun.</p>
       <div class="picker"><div>${Body.svg("front", { interactive: true, selected: sel })}</div><div>${Body.svg("back", { interactive: true, selected: sel })}</div>
       <div class="picker-out">${d.region ? `Seçili: <b>${esc(regionTR(d))}</b>` : "Bir bölge seç"}</div></div>`,
      pain: `${who}<h2 class="wiz-q">${rep ? "Ağrı ne kadar?" : "Ne kadar ağrıyor?"}</h2><p class="wiz-hint">${rep ? "Oyuncunun ifadesine göre 0–10." : "Şu anki ağrını 0–10 arasında kaydır."}</p>
       <div class="pain-val tnum" id="wpain" style="color:${painC}">${d.pain}</div><div class="pain-lbl" id="wpainl">${painL}</div>
       <input class="range" type="range" min="0" max="10" value="${d.pain}" data-wrange="pain" style="--p:${d.pain * 10}%">
       <div class="d-sec"><h5>Ne zaman oldu?</h5><div class="opt-grid">${opt("activity", "game", "Maçta", "Resmi / hazırlık maçı")}${opt("activity", "training", "Antrenmanda", "Takım veya bireysel")}${opt("activity", "other", "Diğer", "Saha dışı")}</div></div>
       <div class="d-sec"><h5>${rep ? "O an ne yapıyordu?" : "O an ne yapıyordun?"}</h5><div class="opt-grid sit">${Object.entries(SITUATIONS).map(([k, v]) => opt("situation", k, v.split(" / ")[0], v.split(" / ")[1] || "")).join("")}</div></div>
       <div class="d-sec"><h5>Nasıl başladı?</h5><div class="opt-grid" style="grid-template-columns:1fr 1fr">${opt("onset", "sudden", "Aniden", "Bir an / bir hareketle")}${opt("onset", "gradual", "Yavaş yavaş", "Günler içinde arttı")}</div></div>`,
      play: `${who}<h2 class="wiz-q">${rep ? "Oynayabilir mi?" : "Oynayabilir misin?"}</h2><p class="wiz-hint">${rep ? "Gözlemine ve oyuncunun söylediğine göre." : "Dürüst ol — erken müdahale, uzun kayıpları önler."}</p>
       <div class="opt-grid">${opt("canPlay", "yes", "Evet", "Rahatsız ediyor ama sorun yok")}${opt("canPlay", "limited", "Kısıtlı", "Bazı hareketlerde zorlanıyor")}${opt("canPlay", "no", "Hayır", "Oynaması mümkün değil")}</div>
       <div class="d-sec"><h5>Ne oldu? (opsiyonel)</h5><textarea class="input" data-wtext="athleteNote" maxlength="1000" placeholder="ör. Kontra atakta sprint atarken arka adalede çekilme.">${esc(d.athleteNote)}</textarea></div>
       <div class="d-sec"><h5>Tarih</h5><input class="input" type="date" min="${addDays(todayISO, -14)}" max="${todayISO}" value="${d.date}" data-wtext="date" style="max-width:220px"></div>`,
    };
    el.innerHTML = steps + `<div class="wiz-pane">${panes[key]}</div>`;
    const block = (key === "player" && !d.playerId) || (key === "region" && !d.region);
    foot.innerHTML = `${w.step ? `<button class="btn btn-ghost" data-act="wback">Geri</button>` : `<button class="btn btn-ghost" data-act="close">Vazgeç</button>`}
      <button class="btn btn-primary" data-act="wnext" ${block ? "disabled" : ""}>${w.step === last ? "Gönder" : "İleri"} ${I.arrow}</button>`;
  }
  async function submitReport() {
    const d = W.d, rep = W.rep, p = rep ? Store.player(d.playerId) : me();
    const date = d.date >= addDays(todayISO, -14) && d.date <= todayISO ? d.date : todayISO;
    const inj = {
      id: "", playerId: p.id, date, region: d.region, side: ["head", "neck", "chest", "abdomen", "thoracic", "lumbar"].includes(d.region) ? "C" : d.side,
      tissue: "other", diagnosis: "", mechanism: d.onset === "gradual" ? "overuse" : ["duel", "tackle", "fall"].includes(d.situation) ? "contact" : "noncontact",
      activity: d.activity, situation: d.situation || "other", onset: d.onset, recurrence: "new",
      timeLoss: d.canPlay === "no", expectedDays: 0, stage: "reported", rtpDate: null, pain: d.pain, reportedBy: rep ? "reporter" : "athlete", assessed: null, diagnosed: null,
      athleteNote: d.athleteNote.trim().slice(0, 1000), canPlay: d.canPlay, notes: [],
      ...(rep ? { reporterId: S.reporter?.id || "", reporterName: [S.reporter?.name, S.reporter?.label].filter(Boolean).join(" · ") } : {}),
    };
    await Store.saveInjury(inj, auth());
    if (rep) {
      (S.repSent = S.repSent || []).unshift({ name: p.name, region: regionTR(inj), time: new Date().toTimeString().slice(0, 5) });
      // Reporters never keep the roster's injuries in memory beyond their own session view.
      renderReporter();
    }
    W.step = W.keys.length; renderWiz();
  }

  /* ───────── Command palette ───────── */
  let K = null;
  function openCmdk() {
    if (K) return;
    const scrim = document.createElement("div"); scrim.className = "scrim";
    const box = document.createElement("div"); box.className = "cmdk";
    box.innerHTML = `<input placeholder="Oyuncu, tanı veya komut ara…" aria-label="Ara"><ul></ul>`;
    document.body.append(scrim, box);
    K = { scrim, box, idx: 0, items: [] };
    requestAnimationFrame(() => { scrim.classList.add("on"); box.classList.add("on"); $("input", box).focus(); });
    scrim.addEventListener("click", closeCmdk);
    const input = $("input", box);
    const draw = () => {
      const q = input.value.toLocaleLowerCase("tr").trim();
      const actions = [
        ...(can("add") ? [{ g: "İşlem", l: "Yeni sakatlık kaydı", run: () => openForm() }] : []),
        ...NAV[role()].map(([id, l]) => ({ g: "Git", l, run: () => go(id) })),
        { g: "İşlem", l: "Temayı değiştir", run: toggleTheme },
      ];
      const players = Store.activePlayers().map((p) => ({ g: "Oyuncu", l: `#${p.no} ${p.name}`, s: statusTR[M.status(p.id, Store.db.injuries)], run: () => openPlayer(p.id) }));
      const inj = !clinical() ? [] : Store.db.injuries.filter((i) => i.diagnosis).slice().reverse().map((i) => ({ g: "Sakatlık", l: i.diagnosis, s: Store.player(i.playerId).name + " · " + fd(i.date), run: () => openInjury(i.id) }));
      const all = [...actions, ...players, ...inj].filter((x) => !q || (x.l + " " + (x.s || "")).toLocaleLowerCase("tr").includes(q)).slice(0, 12);
      K.items = all; K.idx = Math.min(K.idx, Math.max(0, all.length - 1));
      let lastG = "";
      $("ul", box).innerHTML = all.map((x, k) => { const g = x.g !== lastG ? `<li class="grp">${x.g}</li>` : ""; lastG = x.g; return `${g}<li data-k="${k}" class="${k === K.idx ? "on" : ""}">${esc(x.l)}${x.s ? `<small>${esc(x.s)}</small>` : ""}</li>`; }).join("") || `<li class="grp">Sonuç yok</li>`;
    };
    input.addEventListener("input", () => { K.idx = 0; draw(); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { K.idx = Math.min(K.items.length - 1, K.idx + 1); draw(); e.preventDefault(); }
      if (e.key === "ArrowUp") { K.idx = Math.max(0, K.idx - 1); draw(); e.preventDefault(); }
      if (e.key === "Enter" && K.items[K.idx]) { const it = K.items[K.idx]; closeCmdk(); it.run(); }
    });
    box.addEventListener("click", (e) => { const li = e.target.closest("li[data-k]"); if (li) { const it = K.items[+li.dataset.k]; closeCmdk(); it.run(); } });
    draw();
  }
  function closeCmdk() {
    if (!K) return; const { scrim, box } = K; K = null;
    scrim.classList.remove("on"); box.classList.remove("on"); setTimeout(() => { scrim.remove(); box.remove(); }, 400);
  }
  function toggleTheme() {
    const el = document.documentElement;
    const cur = el.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    transition(() => {
      el.dataset.theme = next;
      try { localStorage.setItem("pitchside.theme", next); } catch {}
      const b = $("[data-act=theme]"); if (b) b.innerHTML = next === "dark" ? I.sun : I.moon;
    });
  }

  /* ───────── Events ───────── */
  addEventListener("unhandledrejection", (e) => { toast(e.reason?.message === "forbidden" ? "Bu işlem için yetkiniz yok" : "Sunucuya kaydedilemedi — tekrar deneyin"); });

  document.addEventListener("click", async (e) => {
    const t = e.target;
    // gate
    const rc = t.closest(".role-card");
    if (rc) { renderGateSelect(rc.dataset.role); return; }

    // body picker
    const part = t.closest(".bodymap.interactive .bm-part");
    if (part) {
      const target = F && $("#injform") ? F.data : W && $("#wiz") ? W.d : null;
      if (target) {
        if (F && $("#injform")) readForm();
        target.region = part.dataset.region; target.side = part.dataset.side;
        if (F && $("#injform")) renderForm(); else renderWiz();
      }
      return;
    }
    const ovPart = t.closest("#page .bm-part[data-count]");
    if (ovPart && +ovPart.dataset.count) { S.log = { ...S.log, region: ovPart.dataset.region, q: "", activity: "", status: "" }; go("log"); return; }

    const segBtn = t.closest(".seg button");
    if (segBtn) {
      const name = segBtn.parentElement.dataset.seg, v = segBtn.dataset.v;
      $$("button", segBtn.parentElement).forEach((b) => b.classList.toggle("on", b === segBtn)); syncSegs(segBtn.parentElement);
      if (name === "season") { S.season = v; S.seasonPicked = true; } if (name === "body") S.bodyFilter = v;
      setTimeout(() => transition(renderView), 180);
      return;
    }
    const mchip = t.closest("[data-mchips] .chip");
    if (mchip && MF) { readMatchForm(); MF.m[mchip.parentElement.dataset.mchips] = mchip.dataset.v; renderMatchForm(); return; }
    const chip = t.closest("[data-chips] .chip");
    if (chip && F) { readForm(); F.data[chip.parentElement.dataset.chips] = chip.dataset.v; renderForm(); return; }
    const tg = t.closest("[data-toggle]");
    if (tg && F) { readForm(); const k = tg.dataset.toggle; if (k === "confirmDx") F.confirmDx = !F.confirmDx; else F.data[k] = !F.data[k]; renderForm(); return; }
    const wopt = t.closest("[data-w]");
    if (wopt && W) { W.d[wopt.dataset.w] = wopt.dataset.v; renderWiz(); return; }

    const nav = t.closest("[data-nav]");
    if (nav) { e.preventDefault(); closeDrawer(); go(nav.dataset.nav); return; }
    const th = t.closest("th[data-sort]");
    if (th) { const k = th.dataset.sort; S.log.asc = S.log.sort === k ? !S.log.asc : false; S.log.sort = k; renderView(); return; }

    const act = t.closest("[data-act]");
    if (act) {
      const a = act.dataset.act, id = act.dataset.id;
      if (a === "close") { closeDrawer(); F = null; W = null; MF = null; }
      else if (a === "logout") logout();
      else if (a === "theme") toggleTheme();
      else if (a === "newmatch") openMatch(null);
      else if (a === "savematch") saveMatch();
      else if (a === "delmatch") { if (confirm("Bu maç ve kadrosu kalıcı olarak silinsin mi?")) { await Store.removeMatch(id, auth()); closeDrawer(); MF = null; toast("Maç silindi"); } }
      else if (a === "toktoggle") { const tk = Store.db.tokens.find((x) => x.id === id); await Store.saveToken({ ...tk, active: !tk.active }, auth()); toast(tk.active ? "QR etkinleştirildi" : "QR devre dışı bırakıldı"); }
      else if (a === "tokcopy") { const tk = Store.db.tokens.find((x) => x.id === id); try { await navigator.clipboard.writeText(reporterLink(tk)); toast("Bağlantı kopyalandı"); } catch { prompt("Bağlantı", reporterLink(tk)); } }
      else if (a === "tokpng") { const tk = Store.db.tokens.find((x) => x.id === id); qrPng(reporterLink(tk), tk.name, (tk.label || "Raportör") + " · sakatlık bildirimi", `pitchside-qr-${tk.name.replace(/\s+/g, "-")}.png`); }
      else if (a === "pqr") { const pp = Store.player(id); qrPng(athleteLink(pp), `#${pp.no} ${pp.name}`, "Kişisel bildirim QR'ı — paylaşma", `pitchside-oyuncu-${pp.no}.png`); }
      else if (a === "qrprint") qrPrint(Store.activePlayers().filter((pp) => pp.code).map((pp) => ({ link: athleteLink(pp), title: `#${pp.no} ${pp.name}`, sub: "Kişisel bildirim QR'ı" })), `${CONFIG.TEAM} · oyuncu QR kodları`);
      else if (a === "region") { S.log = { ...S.log, region: act.dataset.region, q: "", activity: "", status: "" }; go("log"); }
      else if (a === "cmdk") openCmdk();
      else if (a === "reset") { Store.reset(); toast("Demo verisi sıfırlandı"); }
      else if (a === "new") openForm(null, { playerId: act.dataset.player });
      else if (a === "edit") openForm(Store.injury(id));
      else if (a === "assess") openForm(Store.injury(id), { assess: true });
      else if (a === "saveform") saveForm();
      else if (a === "report") openReport();
      else if (a === "wnext") { if (W.step === W.keys.length - 1) submitReport(); else { W.step++; renderWiz(); } }
      else if (a === "wback") { W.step--; renderWiz(); }
      else if (a === "clear") {
        const row = act.closest(".ib-item"); row?.classList.add("leaving");
        const i = Store.injury(id);
        setTimeout(() => setStage(i, "rtp"), 380);
      }
      else if (a === "stage") { const i = Store.injury(id); await setStage(i, act.dataset.stage); openInjury(id); }
      else if (a === "remove") { if (confirm("Bu kayıt kalıcı olarak silinsin mi?")) { await Store.removeInjury(id, auth()); closeDrawer(); toast("Kayıt silindi"); } }
      return;
    }
    const mr = t.closest("[data-match]");
    if (mr && !t.closest(".drawer")) { openMatch(mr.dataset.match); return; }
    const pl = t.closest("[data-player]");
    if (pl) { openPlayer(pl.dataset.player); return; }
    const ij = t.closest("[data-injury]");
    if (ij) { openInjury(ij.dataset.injury); return; }
    const wk = t.closest("tr[data-week]");
    if (wk) { const x = Store.db.exposure.find((r) => r.week === wk.dataset.week), f = $("#expo"); if (x && f) for (const k of ["week", "sessions", "hours", "players", "games"]) f[k].value = x[k]; }
  });

  async function setStage(i, stage) {
    if (!PERMS[role()].stages.includes(stage)) { toast("Bu aşama için yetkiniz yok"); return; }
    const r = role(), now = todayISO;
    const upd = { ...i, stage };
    if (stage !== "reported" && !upd.assessed) upd.assessed = { by: ROLES[r].name, at: now };
    if (stage === "rtp") { upd.rtpDate = upd.rtpDate || now; upd.notes = [...(upd.notes || []), mkNote("Oyuna dönüş onayı verildi.")]; }
    else upd.rtpDate = null;
    if (stage === "rtt") upd.timeLoss = upd.timeLoss;
    await Store.saveInjury(upd, auth());
    toast(`${Store.player(i.playerId).name} → ${stageOf(stage).label}`);
  }

  function renderGateSelect(r) {
    $$(".role-card").forEach((c) => c.classList.toggle("on", c.dataset.role === r));
    const f = $("#auth"); f.innerHTML = authFields(r, !Store.live); f.dataset.role = r;
    f.style.opacity = 0; requestAnimationFrame(() => { f.style.transition = "opacity .4s"; f.style.opacity = 1; });
    setTimeout(() => $("input, select", f)?.focus(), 60);
  }

  document.addEventListener("submit", async (e) => {
    const f = e.target;
    e.preventDefault();
    if (f.id === "auth") return login(f.dataset.role, f);
    if (f.id === "tokform") {
      const tok = { id: "", name: f.name.value.trim().slice(0, 80), label: f.label.value.trim().slice(0, 60), token: randomToken(), active: true, expires: f.expires.value || "", created: todayISO, note: "" };
      if (!tok.name) return;
      await Store.saveToken(tok, auth()); toast("QR oluşturuldu"); return;
    }
    if (f.id === "expo") {
      const row = { week: f.week.value, sessions: +f.sessions.value, hours: +f.hours.value, players: +f.players.value, games: +f.games.value };
      await Store.saveExposure(row, auth()); toast("Maruziyet kaydedildi"); return;
    }
    if (f.dataset.note) {
      const text = f.t.value.trim(); if (!text) return;
      const i = Store.injury(f.dataset.note), r = role();
      await Store.saveInjury({ ...i, notes: [...(i.notes || []), mkNote(text)] }, auth());
      openInjury(i.id);
    }
  });

  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.classList.contains("range")) t.style.setProperty("--p", t.value * 10 + "%");
    if (t.name === "pain" && $("#painv")) $("#painv").textContent = t.value;
    if (t.dataset.wrange && W) {
      W.d.pain = +t.value; const v = +t.value;
      $("#wpain").textContent = v; $("#wpain").style.color = v >= 7 ? "var(--out)" : v >= 4 ? "var(--limited)" : "var(--blue)";
      $("#wpainl").textContent = ["Ağrı yok", "Çok hafif", "Hafif", "Hafif", "Orta", "Orta", "Belirgin", "Şiddetli", "Şiddetli", "Çok şiddetli", "Dayanılmaz"][v];
    }
    if (t.dataset.wtext && W) W.d[t.dataset.wtext] = t.value;
    if (t.dataset.mapp && MF) {
      readMatchForm();
      const a = MF.apps[t.dataset.mapp], st = t.value, dur = Number(MF.m.duration) || 90;
      a.status = st; a.minutes = st === "start" ? dur : st === "sub" ? (a.minutes && a.minutes < dur ? a.minutes : 20) : 0;
      renderMatchForm();
    }
    if (t.dataset.mmin && MF) {
      MF.apps[t.dataset.mmin].minutes = Math.max(0, Math.min(Number(MF.m.duration) || 90, Number(t.value) || 0));
      const c = matchCounts(), el = $("#mfcount"); if (el) el.innerHTML = `<b class="${c.start === 11 ? "" : "warn"}">${c.start}/11</b> ilk 11 · ${c.sub} yedek · ${c.inj} sakat · ${fmt(c.min)} dk`;
    }
    if (t.dataset.f) {
      S.log[t.dataset.f] = t.value;
      if (t.dataset.f === "q") { clearTimeout(t._d); t._d = setTimeout(() => { renderView(); const n = $("[data-f=q]"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 180); }
      else renderView();
    }
  });

  // Rank ↔ body map hover link
  document.addEventListener("pointerover", (e) => {
    const p = e.target.closest("#page .bm-part"), li = e.target.closest(".rank li[data-region]");
    const reg = p?.dataset.region || li?.dataset.region;
    if (!reg || !$("#page .rank")) return;
    $$("#page .rank li").forEach((x) => x.classList.toggle("hl", x.dataset.region === reg));
    $$("#page .bm-part").forEach((x) => x.classList.toggle("dim", !!li && x.dataset.region !== reg));
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest("#page .bm-part, .rank li")) { $$("#page .rank li.hl").forEach((x) => x.classList.remove("hl")); $$("#page .bm-part.dim").forEach((x) => x.classList.remove("dim")); }
  });

  // Drag & drop on the rehab board
  let dragId = null;
  document.addEventListener("dragstart", (e) => { const c = e.target.closest?.(".kcard"); if (!c) return; dragId = c.dataset.injury; c.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; });
  document.addEventListener("dragend", (e) => { e.target.closest?.(".kcard")?.classList.remove("dragging"); $$(".col.over").forEach((c) => c.classList.remove("over")); });
  document.addEventListener("dragover", (e) => {
    const col = e.target.closest?.(".col"); if (!col || !dragId) return;
    if (!PERMS[role()].stages.includes(col.dataset.col)) return;
    e.preventDefault(); $$(".col.over").forEach((c) => c !== col && c.classList.remove("over")); col.classList.add("over");
  });
  document.addEventListener("drop", async (e) => {
    const col = e.target.closest?.(".col"); if (!col || !dragId) return;
    e.preventDefault(); const i = Store.injury(dragId); dragId = null;
    if (i && i.stage !== col.dataset.col) transition(() => setStage(i, col.dataset.col));
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && S.session && clinical()) { e.preventDefault(); K ? closeCmdk() : openCmdk(); }
    if (e.key === "Escape") { if (K) closeCmdk(); else closeDrawer(); }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".bm-part[tabindex]")) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
  });
  addEventListener("resize", () => syncSegs(), { passive: true });
  addEventListener("hashchange", () => {
    const v = location.hash.slice(1);
    if (S.session && role() !== "athlete" && v !== S.view && NAV[role()].some((n) => n[0] === v)) go(v);
  });

  /* ───────── Boot ───────── */
  (async () => {
    const qs = new URLSearchParams(location.search), k = qs.get("k"), c = qs.get("c");
    const empty = () => ({ players: [], injuries: [], exposure: [], matches: [], appearances: [], tokens: [] });
    try {
      // QR links: ?k= staff reporter token, ?c= athlete's personal code. Otherwise a remembered device.
      if (k) S.session = { role: "reporter", token: k.trim().toUpperCase() };
      else if (c) S.session = { role: "athlete", code: c.trim().toUpperCase() };
      else if (!S.session) {
        try { const r = JSON.parse(localStorage.getItem(REMEMBER)); if (r && r.exp > Date.now() && ROLES[r.role]) S.session = { role: r.role, pin: "", sess: r.sess || "" }; else forget(); } catch {}
      }
      if (Store.live && !S.session) Store.db = empty();
      else await Store.load(auth());
      if (S.session?.role === "reporter") {
        if (Store.live) S.reporter = Store.db.reporter || null;
        else { const t = (Store.db.tokens || []).find((x) => x.token === S.session.token && x.active && (!x.expires || x.expires >= todayISO)); S.reporter = t ? { id: t.id, name: t.name, label: t.label } : null; }
        if (!S.reporter) { S.session = null; return renderBadQR(); }
      }
      if (S.session?.role === "athlete" && !S.session.playerId) {
        const pp = Store.db.players.find((x) => x.code && x.code.toUpperCase() === S.session.code);
        if (!pp) { S.session = null; renderGate("athlete"); toast("Kişisel kod bulunamadı"); return; }
        S.session.playerId = pp.id;
      }
      if (S.session) { try { sessionStorage.setItem("pitchside.session", JSON.stringify(S.session)); } catch {} startApp(); }
      else {
        renderGate();
        const want = qs.get("role");
        if (want && ROLES[want] && want !== "reporter") renderGateSelect(want);
      }
    } catch (err) {
      const wasReporter = S.session?.role === "reporter";
      S.session = null; forget(); try { sessionStorage.removeItem("pitchside.session"); } catch {}
      if (wasReporter) return renderBadQR();
      if (Store.live) { Store.db = empty(); renderGate(); } else throw err;
    }
  })();
})();
