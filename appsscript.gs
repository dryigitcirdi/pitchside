/** @OnlyCurrentDoc */
/*
 * PITCHSIDE — futbol sakatlık gözetimi · Google E-Tablo arka ucu.
 *
 * Tüm veriler bu e-tabloda, her alan kendi sütununda durur (JSON yok): filtrelenebilir, elle düzenlenebilir,
 * Dosya ▸ İndir ▸ Microsoft Excel ile tek tıkla .xlsx olur.
 *
 * Şablon: e-tablo ilk açıldığında otomatik kurulur (onOpen). Sonradan onarmak için: Pitchside ▸ Şablonu kur / onar.
 * PIN'ler: Pitchside ▸ PIN'leri ayarla… — betik ayarlarında saklanır, e-tabloya ASLA yazılmaz.
 * Kadro: Oyuncular sekmesine ad yazılınca ID ve kişisel giriş kodu kendiliğinden oluşur.
 * Web uygulaması (sonra): Dağıt ▸ Yeni dağıtım ▸ Web uygulaması · "Ben" olarak çalıştır · erişim "Herkes".
 *
 * Yetkiler sunucuda zorlanır — istemci ne gönderirse göndersin:
 *  - Sporcu (kişisel kod): yalnızca kendi kayıtlarını görür; yalnızca "Bildirildi" aşamasında yeni bildirim açar,
 *    kendi açık kayıtlarına not ekler.
 *  - Fizyoterapist (PIN): kayıt açar/düzenler, aşama en fazla "Antrenmana dönüş"; tanı onayı, oyuna dönüş ve silme yok.
 *  - Teknik ekip (PIN): yalnızca okur — oyuncu uygunluğu, bölge, aşama ve tahmini dönüş. Tanı, doku, mekanizma,
 *    klinik not ve sporcu ifadesi sunucudan HİÇ gönderilmez (KVKK: sağlık verisi bilmesi gereken kadar).
 *  - Hekim (PIN): tam yetki.
 */

const TAB = {
  panel: "Panel", injuries: "Sakatlıklar", players: "Oyuncular", notes: "Notlar",
  exposure: "Maruziyet", seasons: "Sezonlar", settings: "Ayarlar", audit: "Denetim",
};

/* ───────── Sözlük: uygulama kodu → tablodaki etiket ───────── */
const L = {
  region: {
    head: "Baş / Yüz", neck: "Boyun", shoulder: "Omuz", upperarm: "Üst kol", elbow: "Dirsek", forearm: "Önkol",
    hand: "El / Parmak", chest: "Göğüs", abdomen: "Karın", thoracic: "Torakal omurga", lumbar: "Bel (lomber)",
    groin: "Kasık / Adduktor", hip: "Kalça / Gluteal", thigh_ant: "Uyluk ön (kuadriseps)", thigh_post: "Uyluk arka (hamstring)", knee: "Diz",
    lowerleg: "Bacak ön", calf: "Baldır / Aşil", ankle: "Ayak bileği", foot: "Ayak",
  },
  side: { R: "Sağ", L: "Sol", C: "Orta" },
  tissue: {
    muscle: "Kas", tendon: "Tendon", ligament: "Bağ / kapsül", bone: "Kemik", cartilage: "Kıkırdak / menisküs",
    joint: "Eklem", disc: "Disk", brain: "Sinir / SRC", skin: "Cilt", contusion: "Kontüzyon", other: "Diğer",
  },
  mechanism: { contact: "Direkt temas", indirect: "İndirekt temas", noncontact: "Temassız", overuse: "Aşırı kullanım" },
  activity: { game: "Maç", training: "Antrenman", other: "Diğer" },
  situation: {
    sprint: "Sprint / hızlanma", kick: "Şut / uzun pas", duel: "İkili mücadele", tackle: "Kayarak müdahale",
    jump: "Hava topu / iniş", cut: "Yön değiştirme", fall: "Düşme / çarpışma", other: "Diğer / bilinmiyor",
  },
  onset: { sudden: "Ani", gradual: "Kademeli" },
  recurrence: { new: "Yeni", recurrent: "Tekrarlayan", subsequent: "Sonraki (farklı)" },
  stage: { reported: "Bildirildi", acute: "Akut değerlendirme", rehab: "Rehabilitasyon", rtt: "Antrenmana dönüş", rtp: "Oyuna döndü" },
  canPlay: { yes: "Evet", limited: "Kısıtlı", no: "Hayır" },
  role: { athlete: "Sporcu", physio: "Fizyoterapist", coach: "Teknik ekip", doctor: "Hekim" },
  pos: { GK: "GK", RB: "RB", CB: "CB", LB: "LB", DM: "DM", CM: "CM", AM: "AM", RW: "RW", LW: "LW", ST: "ST" },
};
const DEF = { region: "", side: "R", tissue: "other", mechanism: "noncontact", activity: "training", situation: "other", onset: "sudden", recurrence: "new", stage: "", canPlay: "", role: "", pos: "" };
const MIDLINE = ["head", "neck", "chest", "abdomen", "thoracic", "lumbar"];
const PHYSIO_STAGES = ["acute", "rehab", "rtt"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const TEMPLATE_V = "futbol şablon v1";
const INK = "#0a0a0b", BLUE = "#2563ff", MUTED = "#8a8a91", PAPER = "#f6f6f4", LINE = "#e4e4e1";

/* ───────── Şema: k = uygulama alanı, h = sütun başlığı (okuma/yazma başlığa göre yapılır) ───────── */
const F_INJURIES = [
  { k: "id", h: "ID", t: "text", w: 64, n: "Otomatik (S0001…). Değiştirmeyin." },
  { k: "playerId", h: "Oyuncu ID", t: "text", w: 78, n: "Oyuncu adını seçince otomatik dolar." },
  { k: "playerName", h: "Oyuncu", t: "text", w: 150, n: "Listeden seçin (Oyuncular sekmesi)." },
  { k: "date", h: "Tarih", t: "date", w: 92, n: "Sakatlığın başladığı gün." },
  { k: "region", h: "Bölge", t: "enum", e: "region", w: 128 },
  { k: "side", h: "Taraf", t: "enum", e: "side", w: 64 },
  { k: "tissue", h: "Doku", t: "enum", e: "tissue", w: 132 },
  { k: "diagnosis", h: "Tanı", t: "text", w: 290 },
  { k: "mechanism", h: "Mekanizma", t: "enum", e: "mechanism", w: 124 },
  { k: "activity", h: "Aktivite", t: "enum", e: "activity", w: 92 },
  { k: "situation", h: "Oyun anı", t: "enum", e: "situation", w: 136, n: "Sakatlık anındaki oyun durumu." },
  { k: "onset", h: "Başlangıç", t: "enum", e: "onset", w: 86 },
  { k: "recurrence", h: "Tekrar", t: "enum", e: "recurrence", w: 124 },
  { k: "timeLoss", h: "Zaman kaybı", t: "bool", w: 96, n: "Evet = en az bir gün antrenman/maça tam katılamadı (IOC 2020). Hayır = yalnızca tıbbi başvuru." },
  { k: "expectedDays", h: "Tahmini gün", t: "int", w: 92 },
  { k: "stage", h: "Aşama", t: "enum", e: "stage", w: 150, n: "Bildirildi → Akut değerlendirme → Rehabilitasyon → Antrenmana dönüş → Oyuna döndü" },
  { k: "rtpDate", h: "Oyuna dönüş", t: "date", w: 100, n: "Tam katılıma dönüş günü. Boşsa vaka açıktır." },
  { k: "pain", h: "Ağrı (0–10)", t: "int", w: 84 },
  { k: "reportedBy", h: "Bildiren", t: "enum", e: "role", w: 104 },
  { k: "athleteNote", h: "Sporcu ifadesi", t: "text", w: 240 },
  { k: "canPlay", h: "Oynayabilir mi", t: "enum", e: "canPlay", w: 104, n: "Sporcunun kendi beyanı." },
  { k: "assessedBy", h: "Değerlendiren", t: "text", w: 140 },
  { k: "assessedAt", h: "Değerlendirme", t: "date", w: 104 },
  { k: "diagnosedBy", h: "Tanı onayı", t: "text", w: 140, n: "Yalnızca hekim onaylar." },
  { k: "diagnosedAt", h: "Onay tarihi", t: "date", w: 96 },
  { k: "updatedBy", h: "Son işlem", t: "text", w: 140 },
  { k: "updatedAt", h: "Güncelleme", t: "datetime", w: 124 },
];
const C_INJURIES = [
  { h: "Kayıp gün", w: 84, fmt: "0", n: "Otomatik. Oyuna dönüşe kadar geçen gün; vaka açıksa bugüne kadar.",
    f: (c) => `IF(${R(c.date)}="",,IF(${R(c.timeLoss)}="Hayır",0,IF(${R(c.rtpDate)}<>"",${R(c.rtpDate)},TODAY())-${R(c.date)}))` },
  { h: "Şiddet", w: 104, n: "Otomatik. IOC 2020: Minimal 1–3 · Hafif 4–7 · Orta 8–28 · Ağır >28 gün.",
    f: (c) => `IF(${R(c.date)}="",,IF((${R(c.timeLoss)}="Hayır")+(${R(c["Kayıp gün"])}=0),"Tıbbi başvuru",IF(${R(c["Kayıp gün"])}<=3,"Minimal",IF(${R(c["Kayıp gün"])}<=7,"Hafif",IF(${R(c["Kayıp gün"])}<=28,"Orta","Ağır")))))` },
  { h: "Sezon", w: 76, n: "Otomatik (Sezonlar sekmesinden).",
    f: (c, x) => {
      const s = `SORT(FILTER({${Q(TAB.seasons, x.sea.start)},${Q(TAB.seasons, x.sea.end)},${Q(TAB.seasons, x.sea.label)}},${Q(TAB.seasons, x.sea.start)}<>""))`;
      return `IF(${R(c.date)}="",,IFERROR(IF(${R(c.date)}<=VLOOKUP(${R(c.date)},${s},2,1),VLOOKUP(${R(c.date)},${s},3,1),""),""))`;
    } },
];
const F_PLAYERS = [
  { k: "id", h: "ID", t: "text", w: 60, n: "Otomatik (P001…). Değiştirmeyin." },
  { k: "name", h: "Ad Soyad", t: "text", w: 180, n: "Ad yazınca ID ve kişisel kod kendiliğinden oluşur." },
  { k: "no", h: "Forma", t: "int", w: 64 },
  { k: "pos", h: "Pozisyon", t: "enum", e: "pos", w: 84, free: true, n: "GK · RB CB LB · DM CM AM · RW LW ST — saha görünümündeki yerini belirler." },
  { k: "birth", h: "Doğum tarihi", t: "date", w: 104 },
  { k: "height", h: "Boy (cm)", t: "int", w: 76 },
  { k: "code", h: "Kişisel kod", t: "text", w: 104, n: "Sporcunun uygulamaya giriş kodu. Yalnızca sporcunun kendisine iletin." },
  { k: "active", h: "Aktif", t: "bool", w: 64, n: "Takımdan ayrılan oyuncu için Hayır seçin; geçmiş kayıtları korunur." },
  { k: "note", h: "Not", t: "text", w: 240 },
];
const C_PLAYERS = [
  { h: "Yaş", w: 52, fmt: "0", n: "Otomatik.", f: (c) => `IF(${R(c.birth)}="",,DATEDIF(${R(c.birth)},TODAY(),"Y"))` },
];
const F_NOTES = [
  { k: "id", h: "ID", t: "text", w: 70 },
  { k: "injuryId", h: "Sakatlık ID", t: "text", w: 86 },
  { k: "playerName", h: "Oyuncu", t: "text", w: 150 },
  { k: "at", h: "Tarih", t: "date", w: 92 },
  { k: "by", h: "Yazan", t: "text", w: 150 },
  { k: "role", h: "Rol", t: "enum", e: "role", w: 104 },
  { k: "text", h: "Not", t: "text", w: 480 },
];
const F_EXPOSURE = [
  { k: "week", h: "Hafta başı", t: "date", w: 100, n: "Haftanın pazartesi günü." },
  { k: "sessions", h: "Seans", t: "num", w: 64 },
  { k: "hours", h: "Saat / seans", t: "num", w: 92 },
  { k: "players", h: "Oyuncu sayısı", t: "int", w: 104 },
  { k: "games", h: "Maç", t: "int", w: 56 },
  { k: "note", h: "Not", t: "text", w: 220 },
];
const C_EXPOSURE = [
  { h: "Antrenman (sa)", w: 112, fmt: "0.#", n: "Otomatik: seans × saat × oyuncu.", f: (c) => `IF(${R(c.week)}="",,${R(c.sessions)}*${R(c.hours)}*${R(c.players)})` },
  { h: "Maç (sa)", w: 84, fmt: "0.#", n: "Otomatik: maç × 11 oyuncu × 90 dk.", f: (c) => `IF(${R(c.week)}="",,${R(c.games)}*11*90/60)` },
  { h: "Toplam (sa)", w: 96, fmt: "0.#", n: "Otomatik.", f: (c) => `IF(${R(c.week)}="",,${R(c["Antrenman (sa)"])}+${R(c["Maç (sa)"])})` },
];
const F_SEASONS = [
  { k: "label", h: "Sezon", t: "text", w: 96, n: "Örn. 2026–27" },
  { k: "start", h: "Başlangıç", t: "date", w: 104 },
  { k: "end", h: "Bitiş", t: "date", w: 104 },
];
const F_SETTINGS = [
  { k: "key", h: "Ayar", t: "text", w: 190 },
  { k: "value", h: "Değer", t: "text", w: 280 },
];
const F_AUDIT = [
  { k: "at", h: "Zaman", t: "datetime", w: 130 },
  { k: "who", h: "Kim", t: "text", w: 160 },
  { k: "role", h: "Rol", t: "text", w: 104 },
  { k: "op", h: "İşlem", t: "text", w: 90 },
  { k: "ref", h: "Kayıt", t: "text", w: 90 },
  { k: "detail", h: "Ayrıntı", t: "text", w: 320 },
];
const SETTINGS_DEFAULT = [["Takım adı", "A Takım"], ["Hekim adı", "Dr. Yiğit Cırdı"], ["Fizyoterapist adı", "Fizyoterapist"], ["Teknik ekip adı", "Teknik Direktör"]];

const R = (col) => `${col}2:${col}`;

/* Formüller en_US sözdizimiyle yazılır. E-tablonun yerel ayarı ondalıkta virgül kullanıyorsa (tr_TR gibi)
   Sheets bağımsız değişkenleri ";" ile, dizi sütunlarını "\" ile ayırır — setFormula bunu çevirmez, biz çeviririz. */
const COMMA_DECIMAL = ["tr", "de", "fr", "es", "it", "pt", "ru", "nl", "pl", "sv", "fi", "da", "nb", "no", "nn", "cs", "sk", "hu", "ro", "bg", "hr", "sl", "sr", "uk", "el", "id", "vi", "lt", "lv", "et", "ca", "eu", "gl", "is", "az", "kk", "be", "mk", "sq", "bs", "ka", "hy", "uz", "mn"];
let SEMI_ = null;
function semicolonLocale() {
  if (SEMI_ === null) {
    let loc = "en_US";
    try { loc = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale() || "en_US"; } catch (e) { /* varsayılan */ }
    SEMI_ = COMMA_DECIMAL.indexOf(String(loc).split(/[_-]/)[0].toLowerCase()) >= 0;
  }
  return SEMI_;
}
function fx(f) {
  if (!semicolonLocale()) return f;
  let out = "", inStr = false, inSheet = false;
  const stack = [];
  for (let i = 0; i < f.length; i++) {
    const ch = f[i];
    if (inStr) { out += ch; if (ch === '"') { if (f[i + 1] === '"') { out += '"'; i++; } else inStr = false; } continue; }
    if (inSheet) { out += ch; if (ch === "'") inSheet = false; continue; }
    if (ch === '"') { inStr = true; out += ch; continue; }
    if (ch === "'") { inSheet = true; out += ch; continue; }
    if (ch === "(" || ch === "{") stack.push(ch);
    else if (ch === ")" || ch === "}") stack.pop();
    if (ch === ",") { out += stack[stack.length - 1] === "{" ? "\\" : ";"; continue; }
    if (ch === "." && /\d/.test(f[i - 1] || "") && /\d/.test(f[i + 1] || "")) { out += ","; continue; }
    out += ch;
  }
  return out;
}
const fxRows = (rows) => rows.map((r) => r.map(fx));
const Q = (tab, col) => `'${tab}'!${col}2:${col}`;

/* ═════════════════════════ Web uygulaması ═════════════════════════ */
function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json({ status: "bad_request" }); }
  const who = authenticate(req);
  if (who === "locked") return json({ status: "locked" });
  if (!who) return json({ status: "unauthorized" });
  try {
    switch (req.action) {
      case "getData": return json({ status: "ok", data: getData(who) });
      case "saveInjury": return json(who.role === "coach" ? { status: "forbidden" } : withLock(() => saveInjury(who, req.injury)));
      case "removeInjury": return json(withLock(() => removeInjury(who, req.id)));
      case "saveExposure": return json(withLock(() => saveExposure(who, req.row)));
      default: return json({ status: "unknown_action" });
    }
  } catch (err) {
    return json({ status: "error", message: String(err && err.message || err) });
  }
}
function doGet() { return json({ status: "ok", service: "pitchside" }); }

function authenticate(req) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get("authFails") || 0);
  if (fails >= 30) return "locked";
  const props = PropertiesService.getScriptProperties(), s = readSettings();
  let who = null;
  const PIN_KEY = { doctor: "DOCTOR_PIN", physio: "PHYSIO_PIN", coach: "COACH_PIN" };
  if (PIN_KEY[req.role] && req.pin) {
    const pin = props.getProperty(PIN_KEY[req.role]);
    if (pin && String(req.pin) === pin) who = { role: req.role, name: staffName(req.role, s) };
  } else if (req.role === "athlete" && req.code) {
    const code = String(req.code).trim().toUpperCase();
    const p = readPlayers().filter((x) => x.active && x.code && x.code.toUpperCase() === code)[0];
    if (p) who = { role: "athlete", name: p.name, playerId: p.id };
  }
  if (!who) cache.put("authFails", String(fails + 1), 600);
  return who;
}

function getData(who) {
  let players = readPlayers(), injuries = readInjuries();
  if (who.role === "athlete") {
    players = players.filter((p) => p.id === who.playerId);
    injuries = injuries.filter((i) => i.playerId === who.playerId);
  }
  if (who.role !== "doctor") players = players.map((p) => Object.assign({}, p, { code: p.id === who.playerId ? p.code : "" }));
  if (who.role === "coach") {
    // Yalnızca açık vakalar ve uygunluk için gereken alanlar; klinik içerik sunucudan çıkmaz.
    injuries = injuries.filter((i) => i.stage !== "rtp").map((i) => ({
      id: i.id, playerId: i.playerId, date: i.date, region: i.region, side: i.side, stage: i.stage, timeLoss: i.timeLoss,
      expectedDays: i.expectedDays, canPlay: i.canPlay, rtpDate: null, diagnosis: "", notes: [],
    }));
  }
  const s = readSettings();
  return {
    v: 2, players: players, injuries: injuries, exposure: who.role === "coach" ? [] : readExposure(), seasons: readSeasons(),
    meta: { team: s["Takım adı"] || "", doctorName: staffName("doctor", s), physioName: staffName("physio", s), coachName: staffName("coach", s) },
  };
}

function saveInjury(who, input) {
  if (!input || typeof input !== "object") return { status: "bad_request" };
  const players = readPlayers(), all = readInjuries(), today = todayISO();
  const prev = input.id ? all.filter((i) => i.id === String(input.id))[0] || null : null;
  let inj;
  if (who.role === "athlete") {
    if (prev) {
      if (prev.playerId !== who.playerId || prev.stage === "rtp") return { status: "forbidden" };
      inj = prev; // sporcu mevcut kayıtta yalnızca not ekleyebilir
    } else {
      if (L.region[input.region] === undefined) return { status: "bad_request" };
      inj = {
        id: "", playerId: who.playerId, date: ISO.test(input.date) && input.date <= today ? input.date : today,
        region: input.region, side: MIDLINE.indexOf(input.region) >= 0 ? "C" : (L.side[input.side] ? input.side : "R"),
        tissue: "other", diagnosis: "",
        mechanism: input.onset === "gradual" ? "overuse" : ["duel", "tackle", "fall"].indexOf(input.situation) >= 0 ? "contact" : "noncontact",
        activity: L.activity[input.activity] ? input.activity : "training", situation: L.situation[input.situation] ? input.situation : "other",
        onset: L.onset[input.onset] ? input.onset : "sudden",
        recurrence: "new", timeLoss: input.canPlay === "no", expectedDays: 0, stage: "reported", rtpDate: null,
        pain: clampInt(input.pain, 0, 10), reportedBy: "athlete", athleteNote: str(input.athleteNote, 1000),
        canPlay: L.canPlay[input.canPlay] ? input.canPlay : "limited", assessed: null, diagnosed: null,
      };
    }
  } else {
    inj = cleanInjury(input, prev);
    if (!players.some((p) => p.id === inj.playerId)) return { status: "bad_request", message: "player" };
    if (!inj.region) return { status: "bad_request", message: "region" };
    if (!prev) inj.reportedBy = who.role;
    if (who.role === "physio") {
      if (prev && prev.stage === "rtp") return { status: "forbidden" };
      if (PHYSIO_STAGES.indexOf(inj.stage) < 0) inj.stage = prev && PHYSIO_STAGES.indexOf(prev.stage) >= 0 ? prev.stage : "acute";
      inj.rtpDate = null;
    } else {
      inj.diagnosed = input.diagnosed && inj.diagnosis ? (prev && prev.diagnosed ? prev.diagnosed : { by: who.name, at: today }) : null;
      inj.rtpDate = inj.stage === "rtp" ? (inj.rtpDate || (inj.timeLoss ? today : inj.date)) : null;
    }
    if (inj.stage !== "reported" && !inj.assessed) inj.assessed = { by: who.name, at: today };
  }
  if (!inj.id) inj.id = nextId(all.map((i) => i.id), "S", 4);

  // Notlar: istemcinin gönderdiği listede sunucunun bilmediği her not yenidir; yazar kimliği sunucudan gelir.
  const prevNotes = prev ? prev.notes : [];
  const knownIds = {}, knownText = {};
  prevNotes.forEach((n) => { knownIds[n.id] = 1; knownText[n.text] = 1; });
  const incoming = Array.isArray(input.notes) ? input.notes : [];
  const fresh = incoming.filter((n) => n && n.text && !(n.id && knownIds[n.id]) && !(!n.id && knownText[n.text]))
    .map((n) => ({ text: str(n.text, 2000), at: today, by: who.name, role: who.role }));

  const player = players.filter((p) => p.id === inj.playerId)[0];
  const rec = injuryToRecord(inj, player ? player.name : "", who);
  writeRecord(TAB.injuries, F_INJURIES, rec, "id", inj.id);
  if (fresh.length) {
    const noteIds = readRecords(TAB.notes, F_NOTES).map((n) => n.id);
    let n = maxNum(noteIds, "N");
    fresh.forEach((x) => { x.id = "N" + pad(++n, 5); });
    appendRecords(TAB.notes, F_NOTES, fresh.map((x) => ({ id: x.id, injuryId: inj.id, playerName: player ? player.name : "", at: x.at, by: x.by, role: x.role, text: x.text })));
  }
  audit(who, prev ? "güncelle" : "yeni", inj.id, (prev ? L.stage[prev.stage] + " → " : "") + L.stage[inj.stage] + (fresh.length ? " · +" + fresh.length + " not" : ""));
  inj.notes = prevNotes.concat(fresh);
  return { status: "ok", injury: inj };
}

function removeInjury(who, id) {
  if (who.role !== "doctor") return { status: "forbidden" };
  const rec = readRecords(TAB.injuries, F_INJURIES).filter((r) => r.id === String(id))[0];
  if (!rec) return { status: "not_found" };
  sheet(TAB.injuries).deleteRow(rec._row);
  const notes = readRecords(TAB.notes, F_NOTES).filter((n) => n.injuryId === String(id)).map((n) => n._row).sort((a, b) => b - a);
  const ns = sheet(TAB.notes);
  notes.forEach((r) => ns.deleteRow(r));
  audit(who, "sil", String(id), rec.diagnosis || "");
  return { status: "ok" };
}

function saveExposure(who, row) {
  if (who.role !== "doctor") return { status: "forbidden" };
  if (!row || !ISO.test(row.week)) return { status: "bad_request" };
  const num = (v, max) => Math.max(0, Math.min(max, Number(v) || 0));
  writeRecord(TAB.exposure, F_EXPOSURE, {
    week: row.week, sessions: num(row.sessions, 50), hours: num(row.hours, 12), players: Math.round(num(row.players, 60)), games: Math.round(num(row.games, 10)),
  }, "week", row.week);
  audit(who, "maruziyet", row.week, "");
  return { status: "ok" };
}

/* ───────── Alan temizliği ───────── */
function cleanInjury(src, prev) {
  const en = (name, v, def) => (L[name][v] !== undefined ? v : def);
  const region = L.region[src.region] !== undefined ? src.region : (prev ? prev.region : "");
  return {
    id: prev ? prev.id : "",
    playerId: prev ? prev.playerId : String(src.playerId || ""),
    date: ISO.test(src.date) ? src.date : (prev ? prev.date : todayISO()),
    region: region,
    side: MIDLINE.indexOf(region) >= 0 ? "C" : en("side", src.side, "R"),
    tissue: en("tissue", src.tissue, "other"),
    diagnosis: str(src.diagnosis, 300),
    mechanism: en("mechanism", src.mechanism, "noncontact"),
    activity: en("activity", src.activity, "training"),
    situation: en("situation", src.situation, "other"),
    onset: en("onset", src.onset, "sudden"),
    recurrence: en("recurrence", src.recurrence, "new"),
    timeLoss: !!src.timeLoss,
    expectedDays: clampInt(src.expectedDays, 0, 999),
    stage: en("stage", src.stage, prev ? prev.stage : "acute"),
    rtpDate: ISO.test(src.rtpDate) ? src.rtpDate : null,
    pain: clampInt(src.pain, 0, 10),
    reportedBy: prev ? prev.reportedBy : "",
    athleteNote: prev ? prev.athleteNote : "",
    canPlay: prev ? prev.canPlay : null,
    assessed: prev ? prev.assessed : null,
    diagnosed: prev ? prev.diagnosed : null,
  };
}
function injuryToRecord(i, playerName, who) {
  return {
    id: i.id, playerId: i.playerId, playerName: playerName, date: i.date, region: i.region, side: i.side, tissue: i.tissue,
    diagnosis: i.diagnosis, mechanism: i.mechanism, activity: i.activity, situation: i.situation || "other", onset: i.onset, recurrence: i.recurrence,
    timeLoss: !!i.timeLoss, expectedDays: i.expectedDays || "", stage: i.stage, rtpDate: i.rtpDate || "", pain: i.pain,
    reportedBy: i.reportedBy, athleteNote: i.athleteNote || "", canPlay: i.canPlay || "",
    assessedBy: i.assessed ? i.assessed.by : "", assessedAt: i.assessed ? i.assessed.at : "",
    diagnosedBy: i.diagnosed ? i.diagnosed.by : "", diagnosedAt: i.diagnosed ? i.diagnosed.at : "",
    updatedBy: who.name, updatedAt: new Date(),
  };
}

/* ───────── Okuma ───────── */
function readPlayers() {
  const today = todayISO();
  return readRecords(TAB.players, F_PLAYERS).filter((p) => p.id && p.name).map((p) => ({
    id: p.id, name: p.name, no: p.no === null ? "" : p.no, pos: p.pos || "", height: p.height || null,
    age: p.birth ? ageOn(p.birth, today) : null, code: p.code || "", active: p.active !== false,
  }));
}
function readInjuries() {
  const notes = {};
  readRecords(TAB.notes, F_NOTES).forEach((n) => {
    if (!n.injuryId || !n.text) return;
    (notes[n.injuryId] = notes[n.injuryId] || []).push({ id: n.id || "R" + n._row, at: n.at, by: n.by, role: n.role || "doctor", text: n.text });
  });
  return readRecords(TAB.injuries, F_INJURIES).filter((o) => o.id && o.playerId && o.date).map((o) => {
    const stage = o.stage || (o.rtpDate ? "rtp" : "acute");
    return {
      id: o.id, playerId: o.playerId, date: o.date, region: o.region, side: MIDLINE.indexOf(o.region) >= 0 ? "C" : (o.side || "R"),
      tissue: o.tissue || "other", diagnosis: o.diagnosis, mechanism: o.mechanism || "noncontact", activity: o.activity || "training", situation: o.situation || "other",
      onset: o.onset || "sudden", recurrence: o.recurrence || "new", timeLoss: o.timeLoss !== false, expectedDays: o.expectedDays || 0,
      stage: stage, rtpDate: stage === "rtp" ? (o.rtpDate || o.date) : null, pain: o.pain === null ? 0 : o.pain,
      reportedBy: o.reportedBy || "doctor", athleteNote: o.athleteNote, canPlay: o.canPlay || null,
      assessed: o.assessedBy ? { by: o.assessedBy, at: o.assessedAt || o.date } : null,
      diagnosed: o.diagnosedBy ? { by: o.diagnosedBy, at: o.diagnosedAt || o.date } : null,
      notes: (notes[o.id] || []).sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0)),
    };
  });
}
function readExposure() {
  return readRecords(TAB.exposure, F_EXPOSURE).filter((x) => x.week).map((x) => ({
    week: x.week, sessions: x.sessions || 0, hours: x.hours || 0, players: x.players || 0, games: x.games || 0,
  })).sort((a, b) => (a.week < b.week ? -1 : 1));
}
function readSeasons() {
  return readRecords(TAB.seasons, F_SEASONS).filter((s) => s.label && s.start && s.end)
    .map((s) => ({ id: String(s.label).replace(/[–—]/g, "-").replace(/\s+/g, ""), label: s.label, start: s.start, end: s.end }))
    .sort((a, b) => (a.start < b.start ? -1 : 1));
}
function readSettings() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB.settings), out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach((r) => { if (String(r[0]).trim()) out[String(r[0]).trim()] = String(r[1]).trim(); });
  return out;
}
function staffName(role, s) {
  s = s || readSettings();
  if (role === "doctor") return s["Hekim adı"] || "Takım Hekimi";
  if (role === "coach") return s["Teknik ekip adı"] || "Teknik ekip";
  return s["Fizyoterapist adı"] || "Fizyoterapist";
}

/* ───────── Tablo erişimi (başlık adına göre; sütun sırası değişse de çalışır) ───────── */
function sheet(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error("Sekme yok: " + name + " — Pitchside ▸ Şablonu kur / onar");
  return sh;
}
function readHead(sh) {
  const n = sh.getLastColumn();
  if (!n) return [];
  const r = sh.getRange(1, 1, 1, n), vals = r.getValues()[0], fs = r.getFormulas()[0];
  return vals.map((v, i) => { const m = String(fs[i] || "").match(/^=\{"([^"]+)"/); return m ? m[1] : String(v).trim(); });
}
function tableMeta(sh, fields) {
  const head = readHead(sh);
  if (!head.length) head.push("");
  const idx = {};
  fields.forEach((f) => { idx[f.k] = head.indexOf(f.h); });
  const span = Math.max.apply(null, fields.map((f) => idx[f.k])) + 1;
  return { head: head, idx: idx, span: Math.max(1, span) };
}
function readRecords(name, fields) {
  const sh = sheet(name), m = tableMeta(sh, fields), tz = tzOf(), last = sh.getLastRow();
  if (last < 2) return [];
  const rows = sh.getRange(2, 1, last - 1, m.head.length).getValues(), out = [];
  rows.forEach((row, i) => {
    const o = { _row: i + 2 };
    let any = false;
    fields.forEach((f) => {
      const c = m.idx[f.k], v = c < 0 ? "" : row[c];
      if (v !== "" && v !== null) any = true;
      o[f.k] = fromCell(v, f, tz);
    });
    if (any) out.push(o);
  });
  return out;
}
/** Anahtar eşleşirse satırı günceller, yoksa son dolu satırın altına yazar. Yalnızca veri sütunlarına dokunur. */
function writeRecord(name, fields, rec, keyField, keyValue) {
  const sh = sheet(name), m = tableMeta(sh, fields), tz = tzOf();
  const kc = m.idx[keyField];
  if (kc < 0) throw new Error("Şablon bozuk (" + name + ") — Pitchside ▸ Şablonu kur / onar");
  const keyF = fields.filter((f) => f.k === keyField)[0];
  const last = sh.getLastRow();
  const vals = last >= 2 ? sh.getRange(2, 1, last - 1, m.span).getValues() : [];
  let rowNum = -1, lastData = 1;
  for (let i = 0; i < vals.length; i++) {
    if (fields.some((f) => m.idx[f.k] >= 0 && vals[i][m.idx[f.k]] !== "" && vals[i][m.idx[f.k]] !== null)) lastData = i + 2;
    if (rowNum < 0 && keyValue !== "" && fromCell(vals[i][kc], keyF, tz) === keyValue) rowNum = i + 2;
  }
  const isNew = rowNum < 0;
  if (isNew) rowNum = lastData + 1;
  const base = isNew ? blank(m.span) : vals[rowNum - 2].slice();
  fields.forEach((f) => { const c = m.idx[f.k]; if (c >= 0 && Object.prototype.hasOwnProperty.call(rec, f.k)) base[c] = toCell(rec[f.k], f, tz); });
  if (rowNum > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), rowNum - sh.getMaxRows() + 100);
  sh.getRange(rowNum, 1, 1, m.span).setValues([base]);
  return rowNum;
}
function appendRecords(name, fields, recs) {
  if (!recs.length) return;
  const sh = sheet(name), m = tableMeta(sh, fields), tz = tzOf(), last = sh.getLastRow();
  let lastData = 1;
  if (last >= 2) sh.getRange(2, 1, last - 1, m.span).getValues().forEach((row, i) => {
    if (fields.some((f) => m.idx[f.k] >= 0 && row[m.idx[f.k]] !== "" && row[m.idx[f.k]] !== null)) lastData = i + 2;
  });
  const rows = recs.map((rec) => {
    const base = blank(m.span);
    fields.forEach((f) => { const c = m.idx[f.k]; if (c >= 0 && Object.prototype.hasOwnProperty.call(rec, f.k)) base[c] = toCell(rec[f.k], f, tz); });
    return base;
  });
  const need = lastData + rows.length;
  if (need > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), need - sh.getMaxRows() + 100);
  sh.getRange(lastData + 1, 1, rows.length, m.span).setValues(rows);
}

function fromCell(v, f, tz) {
  if (v === "" || v === null || v === undefined) return f.t === "int" || f.t === "num" || f.t === "bool" ? null : "";
  switch (f.t) {
    case "date": return toISO(v, tz);
    case "datetime": return v instanceof Date ? Utilities.formatDate(v, tz, "yyyy-MM-dd'T'HH:mm") : String(v);
    case "int": { const n = Number(String(v).replace(",", ".")); return isFinite(n) ? Math.round(n) : null; }
    case "num": { const n = Number(String(v).replace(",", ".")); return isFinite(n) ? n : null; }
    case "bool": return /^(evet|e|yes|true|1)$/i.test(String(v).trim());
    case "enum": return toCode(f.e, v);
    default: return String(v).trim();
  }
}
function toCell(v, f, tz) {
  if (v === null || v === undefined || v === "") return "";
  switch (f.t) {
    case "date": { const s = String(v).slice(0, 10); return ISO.test(s) ? Utilities.parseDate(s, tz, "yyyy-MM-dd") : ""; }
    case "datetime": return v instanceof Date ? v : new Date();
    case "int": { const n = Math.round(Number(v)); return isFinite(n) ? n : ""; }
    case "num": { const n = Number(v); return isFinite(n) ? n : ""; }
    case "bool": return v ? "Evet" : "Hayır";
    case "enum": return L[f.e][v] !== undefined ? L[f.e][v] : f.free ? safe(v) : "";
    default: return safe(v);
  }
}
function toCode(e, v) {
  const s = String(v).trim(), map = L[e];
  if (map[s] !== undefined) return s;
  const low = s.toLowerCase();
  for (const k in map) if (map[k].toLowerCase() === low) return k;
  return e === "pos" ? s : DEF[e];
}
function toISO(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, "yyyy-MM-dd");
  const s = String(v).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + "-" + m[2] + "-" + m[3];
  m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if (m) return m[3] + "-" + pad(m[2], 2) + "-" + pad(m[1], 2);
  return "";
}

/* ═════════════════════════ Şablon ═════════════════════════ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Pitchside")
    .addItem("Şablonu kur / onar", "menuSetup")
    .addItem("PIN'leri ayarla…", "menuPins")
    .addItem("Eksik ID ve kişisel kodları üret", "menuFill")
    .addSeparator()
    .addItem("Web uygulaması adresi", "menuUrl")
    .addToUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet(), panel = ss.getSheetByName(TAB.panel);
  const fresh = !ss.getSheetByName(TAB.injuries);
  if (fresh || !panel || panel.getRange("L1").getValue() !== TEMPLATE_V) {
    try {
      buildTemplate();
      ss.toast(fresh ? "Şablon kuruldu. Oyuncular sekmesine kadroyu yazarak başlayın." : "Şablon güncellendi — verileriniz korundu.", "Pitchside", 10);
    } catch (err) {
      ss.toast("Şablon otomatik kurulamadı (" + err.message + "). Pitchside ▸ Şablonu kur / onar.", "Pitchside", 20);
    }
  }
}

function buildTemplate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try { if (ss.getSpreadsheetTimeZone() !== "Europe/Istanbul") ss.setSpreadsheetTimeZone("Europe/Istanbul"); } catch (e) { /* yetki yoksa geç */ }
  const t = {};
  t.settings = ensureTable(ss, TAB.settings, F_SETTINGS, [], { tab: "#b8bdc6" });
  t.seasons = ensureTable(ss, TAB.seasons, F_SEASONS, [], { tab: "#b8bdc6" });
  t.players = ensureTable(ss, TAB.players, F_PLAYERS, C_PLAYERS, { tab: INK, freezeCols: 2 });
  t.injuries = ensureTable(ss, TAB.injuries, F_INJURIES, C_INJURIES, { tab: INK, freezeCols: 3, filter: true });
  t.notes = ensureTable(ss, TAB.notes, F_NOTES, [], { tab: "#5c5c62" });
  t.exposure = ensureTable(ss, TAB.exposure, F_EXPOSURE, C_EXPOSURE, { tab: "#5c5c62" });
  t.audit = ensureTable(ss, TAB.audit, F_AUDIT, [], { tab: "#b8bdc6" });
  const x = { sea: t.seasons.col, inj: t.injuries.col, pl: t.players.col, exp: t.exposure.col };

  // Otomatik (gri) sütunlar: başlık hücresindeki tek bir ARRAYFORMULA tüm satırları hesaplar.
  [[t.players, C_PLAYERS], [t.injuries, C_INJURIES], [t.exposure, C_EXPOSURE]].forEach((pair) => {
    const tb = pair[0];
    pair[1].forEach((c) => {
      const col = tb.head.indexOf(c.h) + 1;
      tb.sh.getRange(1, col).setFormula(fx(`={"${c.h}";ARRAYFORMULA(${c.f(tb.col, x)})}`));
      const body = tb.sh.getRange(2, col, tb.sh.getMaxRows() - 1, 1).setFontColor("#5c5c62");
      if (c.fmt) body.setNumberFormat(c.fmt);
    });
  });

  // Doğrulama ve koşullu biçim
  const inj = t.injuries, pl = t.players;
  const rows = (tb) => tb.sh.getMaxRows() - 1;
  inj.sh.getRange(2, inj.head.indexOf("Oyuncu") + 1, rows(inj), 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInRange(pl.sh.getRange(`${pl.col.name}2:${pl.col.name}`), true).setAllowInvalid(true).build());
  inj.sh.getRange(2, inj.head.indexOf("Ağrı (0–10)") + 1, rows(inj), 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberBetween(0, 10).setAllowInvalid(false).setHelpText("0–10 arası").build());
  const injBody = inj.sh.getRange(2, 1, rows(inj), inj.span);
  inj.sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=$${inj.col.stage}2="${L.stage.reported}"`)
      .setBackground("#d9e5ff").setBold(true).setRanges([injBody]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=($${inj.col.id}2<>"")*($${inj.col.stage}2<>"${L.stage.rtp}")=1`)
      .setBackground("#eef3ff").setRanges([injBody]).build(),
  ]);
  pl.sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=$${pl.col.active}2="Hayır"`)
      .setFontColor("#a1a1a8").setRanges([pl.sh.getRange(2, 1, rows(pl), pl.head.length)]).build(),
  ]);

  seedDefaults(t);
  buildPanel(ss, t);

  // Sıra, temizlik
  [TAB.panel, TAB.injuries, TAB.players, TAB.notes, TAB.exposure, TAB.seasons, TAB.settings, TAB.audit].forEach((name, i) => {
    const sh = ss.getSheetByName(name);
    if (sh) { ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1); }
  });
  const ours = Object.keys(TAB).map((k) => TAB[k]);
  ss.getSheets().forEach((sh) => {
    if (ours.indexOf(sh.getName()) < 0 && sh.getLastRow() === 0 && sh.getLastColumn() === 0) ss.deleteSheet(sh);
  });
  ss.setActiveSheet(ss.getSheetByName(TAB.panel));
}

/** Sekmeyi oluşturur ya da onarır: eksik başlıkları ekler (veri sütunları otomatik sütunların soluna), biçimi uygular. */
function ensureTable(ss, name, fields, computed, opt) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  const compH = computed.map((c) => c.h);
  let head = readHead(sh);
  if (!head.some((h) => h)) {
    head = fields.map((f) => f.h).concat(compH);
    ensureCols(sh, head.length);
    sh.getRange(1, 1, 1, head.length).setValues([head]);
  } else {
    fields.forEach((f) => {
      if (head.indexOf(f.h) >= 0) return;
      const firstComp = head.findIndex((h) => compH.indexOf(h) >= 0);
      if (firstComp >= 0) { sh.insertColumnBefore(firstComp + 1); head.splice(firstComp, 0, f.h); sh.getRange(1, firstComp + 1).setValue(f.h); }
      else { head.push(f.h); ensureCols(sh, head.length); sh.getRange(1, head.length).setValue(f.h); }
    });
    compH.forEach((h) => { if (head.indexOf(h) < 0) { head.push(h); ensureCols(sh, head.length); sh.getRange(1, head.length).setValue(h); } });
  }
  const width = head.length;
  if (sh.getMaxColumns() > width && sh.getLastColumn() <= width) sh.deleteColumns(width + 1, sh.getMaxColumns() - width);

  const col = {};
  fields.forEach((f) => { col[f.k] = letter(head.indexOf(f.h) + 1); });
  computed.forEach((c) => { col[c.h] = letter(head.indexOf(c.h) + 1); });
  const span = Math.max.apply(null, fields.map((f) => head.indexOf(f.h))) + 1;
  const maxR = sh.getMaxRows();

  // Biçim
  sh.getRange(1, 1, maxR, width).setFontFamily("Inter").setFontSize(10).setVerticalAlignment("middle");
  const hdr = sh.getRange(1, 1, 1, width);
  hdr.setFontWeight("bold").setFontColor("#ffffff").setBackground(INK).setWrap(true);
  sh.setRowHeight(1, 34);
  sh.setFrozenRows(1);
  if (opt.freezeCols) sh.setFrozenColumns(opt.freezeCols);
  if (opt.tab) sh.setTabColor(opt.tab);
  hdr.setNotes([head.map((h) => {
    const f = fields.filter((x) => x.h === h)[0] || computed.filter((x) => x.h === h)[0];
    return f && f.n ? f.n : "";
  })]);
  head.forEach((h, i) => {
    const f = fields.filter((x) => x.h === h)[0] || computed.filter((x) => x.h === h)[0];
    if (f && f.w) sh.setColumnWidth(i + 1, f.w);
  });
  sh.getBandings().forEach((b) => b.remove());
  sh.getRange(1, 1, maxR, width).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
    .setHeaderRowColor(INK).setFirstRowColor("#ffffff").setSecondRowColor("#f7f7f5");

  fields.forEach((f) => {
    const c = head.indexOf(f.h) + 1, body = sh.getRange(2, c, maxR - 1, 1);
    if (f.t === "date") body.setNumberFormat("dd.mm.yyyy");
    if (f.t === "datetime") body.setNumberFormat("dd.mm.yyyy hh:mm");
    if (f.t === "int") body.setNumberFormat("0");
    if (f.t === "num") body.setNumberFormat("0.##");
    if (f.t === "text") body.setNumberFormat("@");
    if (f.t === "enum" || f.t === "bool") {
      const list = f.t === "bool" ? ["Evet", "Hayır"] : Object.keys(L[f.e]).map((k) => L[f.e][k]);
      body.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(list, true).setAllowInvalid(!!f.free).build());
    }
  });
  if (opt.filter && !sh.getFilter()) sh.getRange(1, 1, maxR, width).createFilter();
  return { sh: sh, head: head, col: col, span: span };
}

function seedDefaults(t) {
  if (t.settings.sh.getLastRow() < 2) t.settings.sh.getRange(2, 1, SETTINGS_DEFAULT.length, 2).setValues(SETTINGS_DEFAULT);
  if (t.seasons.sh.getLastRow() < 2) {
    const tz = tzOf(), y = Number(Utilities.formatDate(new Date(), tz, "yyyy")), m = Number(Utilities.formatDate(new Date(), tz, "M"));
    const first = m >= 7 ? y - 1 : y - 2; // bir önceki sezon + içinde bulunulan sezon
    const rows = [first, first + 1].map((s) => [
      s + "–" + String(s + 1).slice(2), Utilities.parseDate(s + "-07-01", tz, "yyyy-MM-dd"), Utilities.parseDate((s + 1) + "-06-30", tz, "yyyy-MM-dd"),
    ]);
    t.seasons.sh.getRange(2, 1, rows.length, 3).setValues(rows);
  }
}

/* ───────── Panel: tablo içinde canlı özet (yalnızca formül) ───────── */
function buildPanel(ss, t) {
  const sh = ss.getSheetByName(TAB.panel) || ss.insertSheet(TAB.panel);
  sh.clear();
  sh.clearConditionalFormatRules();
  ensureCols(sh, 12);
  if (sh.getMaxColumns() > 12) sh.deleteColumns(13, sh.getMaxColumns() - 12);
  if (sh.getMaxRows() < 60) sh.insertRowsAfter(sh.getMaxRows(), 60 - sh.getMaxRows());
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clearDataValidations()
    .setBackground(PAPER).setFontFamily("Inter").setFontSize(10).setFontColor(INK).setVerticalAlignment("middle");
  sh.setHiddenGridlines(true);
  sh.setTabColor(BLUE);
  [24, 170, 116, 150, 24, 160, 130, 250, 150, 96, 24, 110].forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const c = t.injuries.col, e = t.exposure.col, s = t.seasons.col;
  const I = (k) => Q(TAB.injuries, c[k]);
  const X = (k) => Q(TAB.exposure, e[k]);
  const S = (k) => Q(TAB.seasons, s[k]);
  const inSeason = `${I("date")},">="&$L$2,${I("date")},"<="&$L$3`;
  const counted = `${I("stage")},"<>${L.stage.reported}"`;

  // Başlık
  sh.getRange("B2").setValue("PITCHSIDE  ·  FUTBOL SAKATLIK GÖZETİMİ").setFontSize(9).setFontWeight("bold").setFontColor(BLUE);
  sh.getRange("B3").setValue("Kadro sağlığı").setFontSize(26).setFontWeight("bold");
  sh.setRowHeight(3, 46);
  sh.getRange("B4").setFormula(fx(`=IFERROR('${TAB.settings}'!B2,"")&"  ·  "&TEXT(TODAY(),"dd.mm.yyyy")`)).setFontColor(MUTED);

  // Sezon seçici (+ gizli yardımcılar L2:L3)
  sh.getRange("B6").setValue("SEZON").setFontSize(9).setFontWeight("bold").setFontColor(MUTED);
  const seasons = readSeasons(), today = todayISO();
  const cur = seasons.filter((x) => x.start <= today && today <= x.end)[0] || seasons[seasons.length - 1];
  sh.getRange("C6").setValue(cur ? cur.label : "").setFontWeight("bold").setFontSize(12).setBackground("#ffffff")
    .setBorder(true, true, true, true, false, false, LINE, SpreadsheetApp.BorderStyle.SOLID)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInRange(ss.getSheetByName(TAB.seasons).getRange(`${s.label}2:${s.label}`), true).setAllowInvalid(false).build());
  sh.getRange("D6").setFormula(fx(`=IF(C6="","Tüm zamanlar",TEXT($L$2,"dd.mm.yyyy")&" – "&TEXT($L$3,"dd.mm.yyyy"))`)).setFontColor(MUTED);
  sh.getRange("L2").setFormula(fx(`=IFERROR(INDEX(${S("start")},MATCH($C$6,${S("label")},0)),DATE(2000,1,1))`));
  sh.getRange("L3").setFormula(fx(`=IFERROR(INDEX(${S("end")},MATCH($C$6,${S("label")},0)),DATE(2100,1,1))`));
  sh.getRange("L2:L3").setNumberFormat("dd.mm.yyyy");
  sh.getRange("L1").setValue(TEMPLATE_V);
  sh.hideColumns(12);

  // Göstergeler
  const kpis = [
    ["B", "AKTİF VAKA", "şu an açık", `=COUNTIFS(${I("id")},"<>",${I("stage")},"<>${L.stage.rtp}")`, "0"],
    ["C", "OYNAYAMAZ", "oyuncu", `=IFERROR(ROWS(UNIQUE(FILTER(${I("playerId")},(${I("id")}<>"")*(((${I("stage")}="${L.stage.acute}")+(${I("stage")}="${L.stage.rehab}"))*(${I("timeLoss")}="Evet")+(${I("stage")}="${L.stage.reported}")*(${I("canPlay")}="Hayır"))>0))),0)`, "0"],
    ["D", "BEKLEYEN BİLDİRİM", "sporcudan, değerlendirilmemiş", `=COUNTIF(${I("stage")},"${L.stage.reported}")`, "0"],
    ["F", "ZAMAN KAYBI", "sezon · sakatlık", `=COUNTIFS(${inSeason},${I("timeLoss")},"Evet",${counted})`, "0"],
    ["G", "KAYIP GÜN", "sezon", `=SUMIFS(${I("Kayıp gün")},${inSeason},${I("timeLoss")},"Evet",${counted})`, "0"],
    ["H", "MARUZİYET", "oyuncu-saat · sezon", `=SUMIFS(${X("Toplam (sa)")},${X("week")},">="&$L$2,${X("week")},"<="&$L$3)`, "#,##0"],
    ["I", "İNSİDANS", "/ 1000 oyuncu-saat", `=IFERROR(F9/H9*1000,0)`, "0.0"],
    ["J", "YÜK", "gün / 1000 sa", `=IFERROR(G9/H9*1000,0)`, "0"],
  ];
  kpis.forEach((k) => {
    sh.getRange(`${k[0]}8`).setValue(k[1]).setFontSize(8).setFontWeight("bold").setFontColor(MUTED);
    sh.getRange(`${k[0]}9`).setFormula(fx(k[3])).setNumberFormat(k[4]).setFontSize(22).setFontWeight("bold").setHorizontalAlignment("left");
    sh.getRange(`${k[0]}10`).setValue(k[2]).setFontSize(8).setFontColor(MUTED);
    sh.getRange(`${k[0]}8:${k[0]}10`).setBackground("#ffffff").setBorder(true, true, true, true, false, false, LINE, SpreadsheetApp.BorderStyle.SOLID);
  });
  sh.setRowHeight(8, 26); sh.setRowHeight(9, 42); sh.setRowHeight(10, 24);

  // Bölgeye göre (sezon)
  const regions = Object.keys(L.region).map((k) => L.region[k]);
  const r0 = 14, r1 = r0 + regions.length - 1;
  section(sh, "B12", "Bölgeye göre", "B13:D13", ["Bölge", "Sakatlık", ""]);
  sh.getRange(`B${r0}:B${r1}`).setValues(regions.map((x) => [x]));
  sh.getRange(`C${r0}:C${r1}`).setFormulas(fxRows(regions.map((x, i) => [`=COUNTIFS(${I("region")},B${r0 + i},${inSeason},${counted})`])));
  sh.getRange(`D${r0}:D${r1}`).setFormulas(fxRows(regions.map((x, i) => [`=IF(C${r0 + i}=0,"",SPARKLINE(C${r0 + i},{"charttype","bar";"max",MAX($C$${r0}:$C$${r1});"color1","${BLUE}"}))`])));

  // Mekanizma ve aşama
  const m0 = r1 + 3, mech = Object.keys(L.mechanism).map((k) => L.mechanism[k]);
  section(sh, `B${m0}`, "Mekanizma", `B${m0 + 1}:D${m0 + 1}`, ["Mekanizma", "Sakatlık", ""]);
  sh.getRange(`B${m0 + 2}:B${m0 + 1 + mech.length}`).setValues(mech.map((x) => [x]));
  sh.getRange(`C${m0 + 2}:C${m0 + 1 + mech.length}`).setFormulas(fxRows(mech.map((x, i) => [`=COUNTIFS(${I("mechanism")},B${m0 + 2 + i},${inSeason},${counted})`])));
  sh.getRange(`D${m0 + 2}:D${m0 + 1 + mech.length}`).setFormulas(fxRows(mech.map((x, i) => [`=IF(C${m0 + 2 + i}=0,"",SPARKLINE(C${m0 + 2 + i},{"charttype","bar";"max",MAX($C$${m0 + 2}:$C$${m0 + 1 + mech.length});"color1","${INK}"}))`])));

  const o0 = m0 + mech.length + 4, sit = Object.keys(L.situation).map((k) => L.situation[k]);
  section(sh, `B${o0}`, "Oyun anı", `B${o0 + 1}:D${o0 + 1}`, ["Oyun anı", "Sakatlık", ""]);
  sh.getRange(`B${o0 + 2}:B${o0 + 1 + sit.length}`).setValues(sit.map((x) => [x]));
  sh.getRange(`C${o0 + 2}:C${o0 + 1 + sit.length}`).setFormulas(fxRows(sit.map((x, i) => [`=COUNTIFS(${I("situation")},B${o0 + 2 + i},${inSeason},${counted})`])));
  sh.getRange(`D${o0 + 2}:D${o0 + 1 + sit.length}`).setFormulas(fxRows(sit.map((x, i) => [`=IF(C${o0 + 2 + i}=0,"",SPARKLINE(C${o0 + 2 + i},{"charttype","bar";"max",MAX($C$${o0 + 2}:$C$${o0 + 1 + sit.length});"color1","${BLUE}"}))`])));

  const s0 = o0 + sit.length + 4, stages = ["reported", "acute", "rehab", "rtt"];
  section(sh, `B${s0}`, "Rehabilitasyon hattı", `B${s0 + 1}:D${s0 + 1}`, ["Aşama", "Vaka", ""]);
  sh.getRange(`B${s0 + 2}:B${s0 + 6}`).setValues(stages.map((k) => [L.stage[k]]).concat([["Sezonda oyuna dönen"]]));
  sh.getRange(`C${s0 + 2}:C${s0 + 6}`).setFormulas(fxRows(stages.map((k, i) => [`=COUNTIF(${I("stage")},B${s0 + 2 + i})`])
    .concat([[`=COUNTIFS(${I("stage")},"${L.stage.rtp}",${I("rtpDate")},">="&$L$2,${I("rtpDate")},"<="&$L$3)`]])));

  // Aktif vakalar (sağda, aşağı doğru taşar)
  section(sh, "F12", "Aktif vakalar", "F13:J13", ["Oyuncu", "Bölge", "Tanı", "Aşama", "Gün"]);
  sh.getRange("F14").setFormula(fx(`=IFERROR(SORT(FILTER({${I("playerName")},${I("region")},${I("diagnosis")},${I("stage")},${I("Kayıp gün")}},${I("id")}<>"",${I("stage")}<>"${L.stage.rtp}"),5,0),"Aktif vaka yok")`));
  sh.getRange("J14:J60").setNumberFormat("0").setHorizontalAlignment("left");
  sh.getRange("H14:H60").setWrap(false);

  sh.getRange(`B${s0 + 9}`).setValue("Bu sekme yalnızca formül içerir; veriler diğer sekmelerde. Tanımlar IOC 2020 ve futbol konsensüsüne göredir (maç maruziyeti = 11 oyuncu × 90 dk): insidans = zaman kaybettiren sakatlık / oyuncu-saat × 1000, yük = kayıp gün / oyuncu-saat × 1000.")
    .setFontSize(8).setFontColor(MUTED);
  sh.setFrozenRows(0);
}
function section(sh, cell, title, headRange, labels) {
  sh.getRange(cell).setValue(title).setFontSize(12).setFontWeight("bold");
  sh.getRange(headRange).setValues([labels]).setFontSize(8).setFontWeight("bold").setFontColor(MUTED)
    .setBorder(false, false, true, false, false, false, LINE, SpreadsheetApp.BorderStyle.SOLID);
}

/* ═════════════════════════ Elle giriş yardımcıları ═════════════════════════ */
function onEdit(e) {
  if (!e || !e.range) return;
  try {
    const sh = e.range.getSheet(), name = sh.getName(), r1 = Math.max(2, e.range.getRow()), r2 = e.range.getLastRow();
    if (r2 < 2) return;
    if (name === TAB.players) fillPlayers(sh, r1, r2);
    else if (name === TAB.injuries) fillInjuries(sh, r1, r2, e.range.getColumn(), e.range.getLastColumn());
  } catch (err) { /* elle düzenlemeyi asla engelleme */ }
}
/** Adı olan oyunculara eksik ID, kişisel kod ve Aktif=Evet verir. Kaç hücre doldurulduğunu döndürür. */
function fillPlayers(sh, r1, r2) {
  const m = tableMeta(sh, F_PLAYERS), last = sh.getLastRow();
  if (m.idx.id < 0 || m.idx.name < 0 || last < 2) return 0;
  const all = sh.getRange(2, 1, last - 1, m.span).getValues();
  const ids = all.map((r) => String(r[m.idx.id]).trim());
  const codes = {};
  if (m.idx.code >= 0) all.forEach((r) => { const c = String(r[m.idx.code]).trim(); if (c) codes[c] = 1; });
  let n = maxNum(ids, "P"), done = 0;
  for (let r = r1; r <= Math.min(r2, last); r++) {
    const row = all[r - 2];
    if (!String(row[m.idx.name]).trim()) continue;
    if (!String(row[m.idx.id]).trim()) { sh.getRange(r, m.idx.id + 1).setValue("P" + pad(++n, 3)); done++; }
    if (m.idx.code >= 0 && !String(row[m.idx.code]).trim()) { const c = newCode(codes); codes[c] = 1; sh.getRange(r, m.idx.code + 1).setValue(c); done++; }
    if (m.idx.active >= 0 && row[m.idx.active] === "") { sh.getRange(r, m.idx.active + 1).setValue("Evet"); done++; }
  }
  return done;
}
/** Elle girilen sakatlık satırlarına ID verir, oyuncu adı ↔ ID eşler, boş aşama/bildiren/zaman kaybını doldurur. */
function fillInjuries(sh, r1, r2, c1, c2) {
  const m = tableMeta(sh, F_INJURIES), last = sh.getLastRow();
  if (m.idx.id < 0 || last < 2) return 0;
  const all = sh.getRange(2, 1, last - 1, m.span).getValues();
  const players = readPlayers(), byName = {}, byId = {};
  players.forEach((p) => { byName[p.name.toLowerCase()] = p.id; byId[p.id] = p.name; });
  const s = readSettings();
  let n = maxNum(all.map((r) => String(r[m.idx.id]).trim()), "S"), done = 0;
  const touched = (k) => m.idx[k] >= 0 && c1 !== undefined && m.idx[k] + 1 >= c1 && m.idx[k] + 1 <= c2;
  const set = (r, k, v) => { if (m.idx[k] >= 0) { sh.getRange(r, m.idx[k] + 1).setValue(v); done++; } };
  for (let r = r1; r <= Math.min(r2, last); r++) {
    const row = all[r - 2], get = (k) => (m.idx[k] >= 0 ? row[m.idx[k]] : "");
    const has = ["date", "playerName", "playerId", "region", "diagnosis"].some((k) => String(get(k)).trim() !== "");
    if (!has) continue;
    if (!String(get("id")).trim()) set(r, "id", "S" + pad(++n, 4));
    const name = String(get("playerName")).trim(), pid = String(get("playerId")).trim();
    if (name && (touched("playerName") || !pid) && byName[name.toLowerCase()] && byName[name.toLowerCase()] !== pid) set(r, "playerId", byName[name.toLowerCase()]);
    else if (pid && (touched("playerId") || !name) && byId[pid] && byId[pid] !== name) set(r, "playerName", byId[pid]);
    if (get("stage") === "") set(r, "stage", L.stage.acute);
    if (get("reportedBy") === "") set(r, "reportedBy", L.role.doctor);
    if (get("timeLoss") === "") set(r, "timeLoss", "Evet");
    if (c1 !== undefined) { set(r, "updatedBy", staffName("doctor", s) + " (tablo)"); set(r, "updatedAt", new Date()); }
  }
  return done;
}

/* ═════════════════════════ Menü ═════════════════════════ */
function menuSetup() {
  buildTemplate();
  SpreadsheetApp.getUi().alert("Pitchside", "Şablon kuruldu / onarıldı. Veriler korunur.", SpreadsheetApp.getUi().ButtonSet.OK);
}
function menuPins() {
  const ui = SpreadsheetApp.getUi(), props = PropertiesService.getScriptProperties();
  const ask = (title, has) => {
    const r = ui.prompt(title, (has ? "Bir PIN zaten tanımlı. Değiştirmek için yenisini yazın, korumak için boş bırakın.\n\n" : "") + "En az 6 karakter. PIN bu e-tabloya değil, betik ayarlarına kaydedilir.", ui.ButtonSet.OK_CANCEL);
    return r.getSelectedButton() === ui.Button.OK ? r.getResponseText().trim() : null;
  };
  const d = ask("Hekim PIN'i", !!props.getProperty("DOCTOR_PIN"));
  if (d === null) return;
  const p = ask("Fizyoterapist PIN'i", !!props.getProperty("PHYSIO_PIN"));
  if (p === null) return;
  const c = ask("Teknik ekip PIN'i (yalnızca uygunluk görür)", !!props.getProperty("COACH_PIN"));
  if (c === null) return;
  if ([d, p, c].some((x) => x && x.length < 6)) return ui.alert("PIN en az 6 karakter olmalı. Hiçbir şey değiştirilmedi.");
  const all = [d || props.getProperty("DOCTOR_PIN"), p || props.getProperty("PHYSIO_PIN"), c || props.getProperty("COACH_PIN")].filter(Boolean);
  if (new Set(all).size !== all.length) return ui.alert("Her rolün PIN'i farklı olmalı. Hiçbir şey değiştirilmedi.");
  if (d) props.setProperty("DOCTOR_PIN", d);
  if (p) props.setProperty("PHYSIO_PIN", p);
  if (c) props.setProperty("COACH_PIN", c);
  ui.alert("PIN'ler kaydedildi.");
}
function menuFill() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const a = fillPlayers(sheet(TAB.players), 2, sheet(TAB.players).getLastRow());
  const b = fillInjuries(sheet(TAB.injuries), 2, sheet(TAB.injuries).getLastRow());
  ss.toast((a + b) ? (a + b) + " hücre dolduruldu." : "Eksik yok.", "Pitchside", 6);
}
function menuUrl() {
  const url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert("Web uygulaması", url ? url + "\n\nBu adresi uygulamadaki CONFIG.API_URL alanına yapıştırın." : "Henüz web uygulaması olarak dağıtılmadı.", SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ═════════════════════════ Yardımcılar ═════════════════════════ */
function audit(who, op, ref, detail) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB.audit);
  if (sh) sh.appendRow([new Date(), safe(who.name), L.role[who.role] || who.role, op, safe(ref), safe(detail)]);
}
function withLock(fn) { const l = LockService.getScriptLock(); l.waitLock(20000); try { return fn(); } finally { l.releaseLock(); } }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function tzOf() { return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || Session.getScriptTimeZone(); }
function todayISO() { return Utilities.formatDate(new Date(), tzOf(), "yyyy-MM-dd"); }
function ageOn(birth, today) {
  let a = Number(today.slice(0, 4)) - Number(birth.slice(0, 4));
  if (today.slice(5) < birth.slice(5)) a--;
  return a >= 0 && a < 80 ? a : null;
}
function pad(n, w) { return String(n).padStart(w, "0"); }
function maxNum(ids, prefix) {
  let n = 0;
  const re = new RegExp("^" + prefix + "(\\d+)$");
  ids.forEach((id) => { const m = String(id).match(re); if (m) n = Math.max(n, Number(m[1])); });
  return n;
}
function nextId(ids, prefix, w) { return prefix + pad(maxNum(ids, prefix) + 1, w); }
function newCode(used) {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (;;) {
    let s = "";
    for (let i = 0; i < 6; i++) s += a.charAt(Math.floor(Math.random() * a.length));
    if (!used[s]) return s;
  }
}
function clampInt(v, lo, hi) { const n = Math.round(Number(v)); return isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo; }
function str(v, max) { return v === null || v === undefined ? "" : String(v).trim().slice(0, max); }
/** Hücreye yazılan metin asla formül olarak yorumlanmasın (formül enjeksiyonu). */
function safe(v) { const s = String(v === null || v === undefined ? "" : v).slice(0, 2000); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function blank(n) { const a = []; for (let i = 0; i < n; i++) a.push(""); return a; }
function letter(n) { let s = ""; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
function ensureCols(sh, n) { if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns()); }
