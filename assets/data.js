/* PITCHSIDE — domain model, demo seed, storage + optional Apps Script backend.
   Definitions follow the IOC 2020 consensus (Bahr et al., BJSM 2020) and the football
   consensus (Fuller et al., BJSM 2006; Waldén et al. 2023 football extension):
   time-loss vs. medical-attention, severity = days until full availability,
   incidence per 1000 player-hours (match exposure = 11 players × 90 min),
   burden = days lost per 1000 player-hours. */

const CONFIG = {
  // Paste the Apps Script /exec URL here to go live. Empty = demo mode (localStorage).
  API_URL: "https://script.google.com/macros/s/AKfycbwgKg6ZuUlpBbYjXeBA8iJ9eLlxAJwcj4q3VfqXphwbgW3vvDe_V6QVFh5PYxrB5Gk7BA/exec",
  TEAM: "A Takım",
  STORE_KEY: "pitchside.v1",
  MATCH_PLAYERS: 11,
  MATCH_MIN: 90,
};

const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const iso = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const todayISO = iso(TODAY);

const SEASONS = [
  { id: "2025-26", label: "2025–26", start: "2025-07-07", end: "2026-05-31" },
  { id: "2026-27", label: "2026–27", start: "2026-07-06", end: "2027-05-30" },
];

const REGIONS = {
  head: "Baş / Yüz", neck: "Boyun", shoulder: "Omuz", upperarm: "Üst kol", elbow: "Dirsek",
  forearm: "Önkol", hand: "El / Parmak", chest: "Göğüs", abdomen: "Karın", thoracic: "Torakal omurga",
  lumbar: "Bel (lomber)", groin: "Kasık / Adduktor", hip: "Kalça / Gluteal", thigh_ant: "Uyluk ön (kuadriseps)",
  thigh_post: "Uyluk arka (hamstring)", knee: "Diz", lowerleg: "Bacak ön", calf: "Baldır / Aşil",
  ankle: "Ayak bileği", foot: "Ayak",
};
const TISSUES = {
  muscle: "Kas", tendon: "Tendon", ligament: "Bağ / kapsül", bone: "Kemik",
  cartilage: "Kıkırdak / menisküs", joint: "Eklem", disc: "Disk", brain: "Sinir / SRC",
  skin: "Cilt", contusion: "Kontüzyon", other: "Diğer",
};
const MECHANISMS = { contact: "Direkt temas", indirect: "İndirekt temas", noncontact: "Temassız", overuse: "Aşırı kullanım" };
const ACTIVITIES = { game: "Maç", training: "Antrenman", other: "Diğer" };
// Playing situation at the moment of injury — the football-specific inciting event.
const SITUATIONS = {
  sprint: "Sprint / hızlanma", kick: "Şut / uzun pas", duel: "İkili mücadele", tackle: "Kayarak müdahale",
  jump: "Hava topu / iniş", cut: "Yön değiştirme", fall: "Düşme / çarpışma", other: "Diğer / bilinmiyor",
};
// Match-day context (FIFA 2023 football extension: individual match exposure + availability).
const COMPETITIONS = { league: "Lig", cup: "Kupa", europe: "Avrupa", friendly: "Hazırlık", other: "Diğer" };
const VENUES = { home: "İç saha", away: "Deplasman", neutral: "Tarafsız" };
const SURFACES = { grass: "Doğal çim", hybrid: "Hibrit çim", artificial: "Sentetik" };
// played → counts as appearance; missed → health reason (injury / illness) or other absence.
const APP_STATUS = {
  start: { label: "İlk 11", short: "İlk 11", played: true },
  sub: { label: "Yedekten girdi", short: "Yedek", played: true },
  unused: { label: "Kulübede kaldı", short: "Kulübe" },
  coach: { label: "Teknik karar", short: "TK" },
  injured: { label: "Sakat", short: "Sakat", missed: "injury" },
  ill: { label: "Hasta", short: "Hasta", missed: "illness" },
  suspended: { label: "Cezalı", short: "Ceza", missed: "other" },
  national: { label: "Milli takım", short: "Milli", missed: "other" },
  other: { label: "Diğer", short: "Diğer", missed: "other" },
};
const CONGESTION_DAYS = 4; // ≤4 days since the previous match = congested (Bengtsson et al., BJSM 2013)
const RECURRENCE = { new: "Yeni", recurrent: "Tekrarlayan", subsequent: "Sonraki (farklı)" };
const STAGES = [
  { id: "reported", label: "Bildirildi", short: "Bildirim", who: "Sporcu" },
  { id: "acute", label: "Akut değerlendirme", short: "Akut", who: "Fizyoterapist" },
  { id: "rehab", label: "Rehabilitasyon", short: "Rehab", who: "Fizyoterapist" },
  { id: "rtt", label: "Antrenmana dönüş", short: "RTT", who: "Fizyoterapist" },
  { id: "rtp", label: "Oyuna dönüş onayı", short: "RTP", who: "Hekim" },
];
const ROLES = {
  doctor: { label: "Takım Hekimi", name: "Dr. Yiğit Cırdı", initials: "YC" },
  physio: { label: "Fizyoterapist", name: "Fzt. Selin Aksoy", initials: "SA" },
  coach: { label: "Teknik Ekip", name: "Teknik Direktör", initials: "TD" },
  reporter: { label: "QR bildirimi", name: "", initials: "" },
  athlete: { label: "Sporcu", name: "", initials: "" },
};
// coach: availability only — never diagnosis, notes or the athlete's own words (KVKK: health data is need-to-know).
const PERMS = {
  doctor: { add: true, assess: true, diagnose: true, clear: true, exposure: true, remove: true, clinical: true, stages: ["reported", "acute", "rehab", "rtt", "rtp"] },
  physio: { add: true, assess: true, diagnose: false, clear: false, exposure: false, remove: false, clinical: true, stages: ["acute", "rehab", "rtt"] },
  coach: { add: false, assess: false, diagnose: false, clear: false, exposure: false, remove: false, clinical: false, stages: [] },
  athlete: { add: false, assess: false, diagnose: false, clear: false, exposure: false, remove: false, clinical: false, stages: [] },
  // QR holder: may only file a report on behalf of a player; reports stay "Bildirildi" until staff review.
  reporter: { add: false, assess: false, diagnose: false, clear: false, exposure: false, remove: false, clinical: false, stages: [] },
};
// Who may edit match sheets (squad status + minutes).
const MATCH_EDIT = { doctor: true, physio: true };

// Positions → line + 4-3-3 slot (x across the pitch 0–100 from the left, y from own goal 0–100).
const POSITIONS = {
  GK: { label: "Kaleci", line: "GK", x: 50, y: 8 },
  RB: { label: "Sağ bek", line: "DF", x: 84, y: 26 }, CB: { label: "Stoper", line: "DF", x: 50, y: 22 }, LB: { label: "Sol bek", line: "DF", x: 16, y: 26 },
  DM: { label: "Ön libero", line: "MF", x: 50, y: 37 }, CM: { label: "Merkez orta saha", line: "MF", x: 50, y: 51 }, AM: { label: "On numara", line: "MF", x: 50, y: 65 },
  RW: { label: "Sağ kanat", line: "FW", x: 83, y: 80 }, LW: { label: "Sol kanat", line: "FW", x: 17, y: 80 }, ST: { label: "Santrfor", line: "FW", x: 50, y: 88 },
};
const LINES = { GK: "Kaleci", DF: "Defans", MF: "Orta saha", FW: "Hücum" };

// Muscle groups that dominate elite football time-loss (UEFA ECIS).
const MUSCLE_GROUPS = [
  { id: "hamstring", label: "Hamstring", region: "thigh_post" },
  { id: "adductor", label: "Adduktor", region: "groin" },
  { id: "quadriceps", label: "Kuadriseps", region: "thigh_ant" },
  { id: "calf", label: "Baldır", region: "calf" },
];

const SEVERITY = (days, timeLoss) => {
  if (!timeLoss || days === 0) return { id: 0, label: "Tıbbi başvuru" };
  if (days <= 3) return { id: 1, label: "Minimal" };
  if (days <= 7) return { id: 2, label: "Hafif" };
  if (days <= 28) return { id: 3, label: "Orta" };
  return { id: 4, label: "Ağır" };
};

/* ─────────────────────────── Seed ─────────────────────────── */
const SEED_PLAYERS = [
  ["Altay Kılıç", 1, "GK", 29, 191], ["Jonas Berg", 23, "GK", 33, 194], ["Efe Tunç", 35, "GK", 20, 189],
  ["Rafael Costa", 2, "RB", 27, 178], ["Kaan Erdem", 3, "CB", 28, 188], ["Mats Lindqvist", 4, "CB", 30, 192],
  ["Yusuf Aksoy", 5, "CB", 24, 186], ["Ahmed Diallo", 15, "CB", 22, 190], ["Ömer Yalçın", 22, "LB", 26, 180],
  ["Theo Martin", 13, "LB", 23, 177], ["Batuhan Öz", 17, "RB", 21, 179],
  ["Lucas Ferreira", 6, "DM", 29, 183], ["Emre Bulut", 8, "CM", 27, 180], ["Arda Kaplan", 10, "AM", 25, 175],
  ["Ivan Kovač", 14, "CM", 31, 182], ["Samet Gür", 16, "DM", 23, 184], ["Noah Schmidt", 18, "CM", 24, 181],
  ["Mert Karaca", 20, "AM", 20, 174],
  ["Kerem Doğan", 7, "RW", 24, 176], ["Moussa Traoré", 11, "LW", 26, 179], ["Viktor Novak", 9, "ST", 28, 189],
  ["Barış Sezer", 19, "ST", 22, 185], ["Cenk Avcı", 21, "RW", 19, 173], ["Daniel Okafor", 27, "LW", 25, 180],
  ["Emir Tekin", 99, "ST", 30, 187],
].map(([name, no, pos, age, height], i) => ({
  id: `p${i + 1}`, name, no, pos, age, height,
  active: true,
  code: (name.split(" ").pop().slice(0, 3).toLocaleUpperCase("tr") + no).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/İ/g, "I").replace(/Ø/g, "O"),
}));

// [player, date, region, side, tissue, diagnosis, mechanism, activity, situation, daysOut, recurrence, onset]
const SEED_CLOSED = [
  [19, "2025-07-14", "thigh_post", "R", "muscle", "Hamstring strain — BFlh (BAMIC 1b)", "noncontact", "training", "sprint", 11, "new", "sudden"],
  [13, "2025-07-22", "groin", "L", "muscle", "Adduktor longus strain (grade I)", "noncontact", "training", "kick", 9, "new", "sudden"],
  [5, "2025-07-29", "ankle", "R", "ligament", "Lateral ayak bileği burkulması (ATFL grade I)", "indirect", "game", "duel", 6, "new", "sudden"],
  [21, "2025-08-10", "thigh_ant", "L", "contusion", "Kuadriseps kontüzyonu (diz teması)", "contact", "game", "duel", 4, "new", "sudden"],
  [24, "2025-08-17", "thigh_post", "L", "muscle", "Hamstring strain (BAMIC 2a)", "noncontact", "game", "sprint", 23, "new", "sudden"],
  [9, "2025-08-24", "calf", "R", "muscle", "Gastroknemius medial baş strain", "noncontact", "training", "cut", 14, "new", "sudden"],
  [12, "2025-09-01", "knee", "L", "ligament", "MCL grade II", "contact", "game", "tackle", 28, "new", "sudden"],
  [1, "2025-09-07", "hand", "R", "ligament", "4. parmak PIP kollateral bağ — kurtarış", "contact", "training", "fall", 5, "new", "sudden"],
  [14, "2025-09-14", "groin", "R", "tendon", "Adduktor ilişkili kasık ağrısı (Doha)", "overuse", "training", "kick", 12, "new", "gradual"],
  [22, "2025-09-21", "head", "C", "skin", "Kaş laserasyonu (hava topu)", "contact", "game", "jump", 0, "new", "sudden"],
  [6, "2025-09-28", "thigh_post", "R", "muscle", "Hamstring strain — semimembranosus (BAMIC 1a)", "noncontact", "game", "sprint", 8, "new", "sudden"],
  [20, "2025-10-05", "ankle", "L", "ligament", "Lateral ayak bileği burkulması (grade II)", "contact", "game", "tackle", 19, "new", "sudden"],
  [17, "2025-10-12", "lumbar", "C", "muscle", "Mekanik bel ağrısı", "overuse", "training", "other", 4, "new", "gradual"],
  [25, "2025-10-19", "calf", "L", "tendon", "Aşil tendinopatisi (orta kısım)", "overuse", "training", "sprint", 10, "new", "gradual"],
  [8, "2025-10-26", "head", "C", "brain", "Sporla ilişkili sarsıntı (SRC) — kafa kafaya", "contact", "game", "jump", 10, "new", "sudden"],
  [19, "2025-11-02", "thigh_post", "R", "muscle", "Hamstring strain — BFlh (BAMIC 2b)", "noncontact", "game", "sprint", 31, "recurrent", "sudden"],
  [4, "2025-11-09", "thigh_ant", "R", "muscle", "Rektus femoris strain (BAMIC 2a)", "noncontact", "training", "kick", 21, "new", "sudden"],
  [15, "2025-11-16", "knee", "R", "cartilage", "Medial menisküs yırtığı — parsiyel menisektomi", "indirect", "training", "cut", 38, "new", "sudden"],
  [10, "2025-11-23", "groin", "L", "muscle", "Adduktor longus strain (grade II)", "noncontact", "game", "kick", 17, "new", "sudden"],
  [23, "2025-11-30", "ankle", "R", "ligament", "Yüksek ayak bileği burkulması (sindesmoz)", "contact", "game", "tackle", 42, "new", "sudden"],
  [7, "2025-12-07", "foot", "L", "contusion", "Ayak dorsumu kontüzyonu (basılma)", "contact", "game", "duel", 3, "new", "sudden"],
  [13, "2025-12-14", "groin", "L", "muscle", "Adduktor strain", "noncontact", "game", "kick", 15, "recurrent", "sudden"],
  [18, "2025-12-21", "hip", "R", "muscle", "Kalça fleksörü (iliopsoas) strain", "noncontact", "training", "kick", 9, "new", "sudden"],
  [2, "2026-01-08", "shoulder", "L", "joint", "AC eklem incinmesi (grade I)", "contact", "training", "fall", 7, "new", "sudden"],
  [21, "2026-01-15", "thigh_post", "L", "muscle", "Hamstring strain (BAMIC 1b)", "noncontact", "game", "sprint", 12, "new", "sudden"],
  [11, "2026-01-22", "ankle", "L", "ligament", "Lateral ayak bileği burkulması (grade I)", "indirect", "training", "cut", 5, "new", "sudden"],
  [16, "2026-01-29", "calf", "R", "muscle", "Soleus strain", "noncontact", "training", "sprint", 18, "new", "gradual"],
  [3, "2026-02-05", "hand", "L", "bone", "5. metakarp kırığı — konservatif", "contact", "training", "fall", 33, "new", "sudden"],
  [24, "2026-02-12", "thigh_post", "L", "muscle", "Hamstring strain (BAMIC 1b)", "noncontact", "game", "sprint", 14, "recurrent", "sudden"],
  [5, "2026-02-19", "head", "C", "brain", "Sporla ilişkili sarsıntı (SRC)", "contact", "game", "jump", 9, "new", "sudden"],
  [14, "2026-02-26", "groin", "R", "tendon", "Adduktor tendinopatisi alevlenmesi", "overuse", "training", "kick", 8, "recurrent", "gradual"],
  [12, "2026-03-12", "thigh_post", "R", "muscle", "Hamstring strain (BAMIC 1a)", "noncontact", "game", "sprint", 7, "new", "sudden"],
  [20, "2026-03-19", "ankle", "L", "ligament", "Ayak bileği burkulması", "indirect", "game", "duel", 11, "recurrent", "sudden"],
  [22, "2026-03-26", "thigh_ant", "R", "contusion", "Kuadriseps kontüzyonu", "contact", "game", "duel", 3, "new", "sudden"],
  [6, "2026-04-02", "lumbar", "C", "joint", "Faset kaynaklı bel ağrısı", "overuse", "training", "other", 6, "new", "gradual"],
  [19, "2026-04-09", "calf", "R", "muscle", "Gastroknemius strain", "noncontact", "training", "sprint", 13, "subsequent", "sudden"],
  [17, "2026-04-16", "knee", "L", "tendon", "Patellar tendinopati", "overuse", "training", "jump", 0, "new", "gradual"],
  [25, "2026-04-23", "thigh_post", "R", "muscle", "Hamstring strain (BAMIC 2a)", "noncontact", "game", "sprint", 24, "new", "sudden"],
  [4, "2026-05-03", "knee", "R", "ligament", "MCL grade I", "contact", "game", "tackle", 12, "new", "sudden"],
  [13, "2026-05-10", "foot", "R", "bone", "2. metatars stres reaksiyonu", "overuse", "training", "sprint", 26, "new", "gradual"],
  [8, "2026-05-17", "ankle", "R", "ligament", "Lateral ayak bileği burkulması", "contact", "game", "tackle", 8, "new", "sudden"],
  [18, "2026-07-13", "thigh_post", "L", "muscle", "Hamstring strain (BAMIC 1b)", "noncontact", "training", "sprint", 10, "new", "sudden"],
  [7, "2026-07-21", "groin", "R", "muscle", "Adduktor longus strain (grade I)", "noncontact", "training", "kick", 8, "new", "sudden"],
  [23, "2026-08-01", "ankle", "R", "ligament", "Ayak bileği burkulması", "indirect", "game", "cut", 9, "recurrent", "sudden"],
  [1, "2026-08-16", "shoulder", "R", "contusion", "Omuz kontüzyonu — kaleci düşüşü", "contact", "game", "fall", 0, "new", "sudden"],
  [15, "2026-08-24", "calf", "L", "muscle", "Soleus strain", "noncontact", "training", "sprint", 16, "new", "gradual"],
  [21, "2026-09-06", "head", "C", "skin", "Kafa laserasyonu — 4 sütür", "contact", "game", "jump", 0, "new", "sudden"],
  [10, "2026-09-14", "thigh_ant", "L", "muscle", "Rektus femoris strain (BAMIC 1a)", "noncontact", "game", "kick", 9, "new", "sudden"],
  [16, "2026-09-22", "ankle", "L", "ligament", "Lateral ayak bileği burkulması (grade I)", "contact", "game", "tackle", 6, "new", "sudden"],
];
// active: [player, daysAgo, region, side, tissue, dx, mech, activity, situation, expectedDays, stage, recurrence, onset, pain, reportedBy, notes[]]
const SEED_V = 3;
const SEED_ACTIVE = [
  [9, 228, "knee", "R", "ligament", "ÖÇB rüptürü — ÖÇB rekonstrüksiyonu (BTB otogreft)", "noncontact", "game", "cut", 270, "rtt", "new", "sudden", 1, "physio",
    ["Op. sonrası 6. ay izokinetik: kuadriseps LSI %88, hamstring LSI %94.", "Saha içi rehab tamamlandı. Takım antrenmanı — temassız bölümler. Hop test bataryası haftaya."]],
  [24, 6, "thigh_post", "L", "muscle", "Hamstring strain — BFlh (BAMIC 2b), 3. epizod", "noncontact", "game", "sprint", 35, "acute", "recurrent", "sudden", 6, "physio",
    ["Palpasyonda proksimal biseps femoris hassasiyeti, aktif diz fleksiyonu ağrılı.", "MR: intramüsküler tendon tutulumu (BAMIC 2b). Tekrarlayan epizod — sprint mekaniği ve Nordic hacmi gözden geçirilecek."]],
  [20, 15, "ankle", "L", "ligament", "Lateral ayak bileği burkulması (ATFL grade II)", "contact", "game", "tackle", 24, "rehab", "recurrent", "sudden", 3, "physio",
    ["Ödem geriledi, ağırlık aktarımı tam.", "Propriosepsiyon + tek bacak denge protokolü başladı. Bandaj/brace ile dönüş planlanıyor."]],
  [13, 20, "groin", "L", "tendon", "Adduktor ilişkili kasık ağrısı — kronik", "overuse", "training", "kick", 28, "rehab", "recurrent", "gradual", 3, "athlete",
    ["Copenhagen adduksiyon testi 4/10 ağrı. Kopenhag progresyonu 2. seviye.", "Uzun pas/şut hacmi kısıtlı; koşu programı devam."]],
  [22, 12, "calf", "R", "muscle", "Gastroknemius medial baş strain (grade I)", "noncontact", "training", "sprint", 16, "rtt", "new", "sudden", 2, "physio",
    ["Takım antrenmanına kontrollü katılım; yüksek hızlı koşu hacmi %70, maksimal sprint yok."]],
  [5, 2, "thigh_post", "R", "other", "", "noncontact", "game", "sprint", 0, "reported", "new", "sudden", 5, "athlete", []],
  [11, 1, "foot", "R", "other", "", "contact", "training", "duel", 0, "reported", "new", "sudden", 4, "athlete", []],
];
const SEED_ATHLETE_NOTE = {
  5: ["Maçın son 10 dakikasında sprintte arka adalemde çekilme hissettim, oyunu tamamladım.", "limited"],
  11: ["İkili mücadelede ayağıma basıldı, ayak üstünde şişlik var, kramponu giyince ağrıyor.", "limited"],
};

// Deterministic PRNG so the demo season is identical on every device.
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const OPPONENTS = ["Kuzeyspor", "Liman FK", "Boğaziçi SK", "Ege Gücü", "Karadeniz FK", "Başkent SK", "Toros Spor", "Marmara FK", "Kapadokya SK", "Fırat Spor", "Trakya FK", "Akdeniz SK", "Yayla Spor", "Dicle FK", "Göller SK", "Rumeli FK", "Çukurova Spor"];

function buildMatches() {
  const R = rng(7), out = [];
  let n = 1;
  for (const s of SEASONS) {
    let wk = s.start, k = 0;
    const end = s.end < todayISO ? s.end : todayISO;
    while (wk <= end) {
      const pre = k < 5, md = wk.slice(5), winter = md >= "12-22" || md <= "01-04";
      const games = winter ? 0 : pre ? (k >= 2 ? 2 : 1) : (k % 3 === 1 ? 2 : 1);
      const slots = games === 2 ? [2, 6] : [pre ? 5 : 6];
      for (const off of slots) {
        const date = addDays(wk, off);
        if (date > todayISO || date > s.end) continue;
        const comp = pre ? "friendly" : off === 2 ? (k % 2 ? "europe" : "cup") : "league";
        const venue = n % 2 ? "home" : "away";
        const gf = Math.floor(R() * 3.2), ga = Math.floor(R() * 2.4);
        out.push({ id: `m${n++}`, date, opponent: OPPONENTS[Math.floor(R() * OPPONENTS.length)], comp, venue,
          surface: venue === "away" && R() < 0.15 ? "artificial" : "grass", duration: 90, score: `${gf}-${ga}`, note: "" });
      }
      wk = addDays(wk, 7); k++;
    }
  }
  return out;
}

// Squad sheets for every played match: injured/ill players first, then a 4-3-3 from the fit pool.
function buildAppearances(players, matches, injuries) {
  const R = rng(11), apps = [];
  const slots = ["GK", "RB", "CB", "CB", "LB", "DM", "CM", "CM", "RW", "ST", "LW"];
  const line = (pos) => POSITIONS[pos]?.line;
  for (const m of matches) {
    const fit = [], rows = {};
    for (const p of players) {
      const hurt = injuries.some((i) => i.playerId === p.id && i.timeLoss && i.stage !== "reported" &&
        (i.activity === "game" ? m.date > i.date : m.date >= i.date) && m.date < (i.rtpDate || addDays(todayISO, 1)));
      const r = R();
      if (hurt) rows[p.id] = { status: "injured", minutes: 0 };
      else if (r < 0.015) rows[p.id] = { status: "ill", minutes: 0 };
      else if (r < 0.025 && m.comp !== "friendly") rows[p.id] = { status: "suspended", minutes: 0 };
      else fit.push(p);
    }
    // First choice = order in the roster; ~20 % rotation per slot (more in friendlies / cups).
    const rot = m.comp === "league" ? 0.18 : 0.45, used = new Set(), xi = [];
    for (const pos of slots) {
      let pool = fit.filter((p) => !used.has(p.id) && (p.pos === pos || (pos === "CM" && p.pos === "AM")));
      if (!pool.length) pool = fit.filter((p) => !used.has(p.id) && line(p.pos) === line(pos));
      if (!pool.length) pool = fit.filter((p) => !used.has(p.id) && p.pos !== "GK");
      const rr = pos === "GK" ? (m.comp === "league" ? 0.03 : 0.3) : rot;
      const pick = pool.length > 1 && R() < rr ? pool[pos === "GK" ? 1 : 1 + Math.floor(R() * (pool.length - 1))] : pool[0];
      if (pick) { used.add(pick.id); xi.push(pick); rows[pick.id] = { status: "start", minutes: 90 }; }
    }
    const bench = fit.filter((p) => !used.has(p.id));
    const benchGK = bench.filter((p) => p.pos === "GK").slice(0, 1), benchOut = bench.filter((p) => p.pos !== "GK");
    const nSubs = Math.min(benchOut.length, 3 + Math.floor(R() * 3));
    const outfieldXI = xi.filter((p) => p.pos !== "GK");
    for (let k = 0; k < nSubs; k++) {
      const sub = benchOut[k], off = outfieldXI[(k * 3 + Math.floor(R() * 3)) % outfieldXI.length];
      const mins = 8 + Math.floor(R() * 32);
      rows[sub.id] = { status: "sub", minutes: mins };
      if (off && rows[off.id].minutes === 90) rows[off.id].minutes = 90 - mins;
    }
    // Matchday squad of 20: 11 starters + 9 on the bench (subs used + unused).
    for (const p of [...benchGK, ...benchOut.slice(nSubs, Math.max(nSubs, 9 - benchGK.length))]) if (!rows[p.id]) rows[p.id] = { status: "unused", minutes: 0 };
    for (const p of players) {
      const x = rows[p.id] || { status: "coach", minutes: 0 };
      apps.push({ matchId: m.id, playerId: p.id, status: x.status, minutes: x.minutes });
    }
  }
  return apps;
}

function buildSeed() {
  const players = SEED_PLAYERS;
  const matches = buildMatches();
  // Match injuries happen on match days: snap to the nearest earlier fixture.
  const snap = (date) => { const m = [...matches].reverse().find((x) => x.date <= date && diffDays(x.date, date) <= 6); return m ? m.date : date; };
  const injuries = [];
  let n = 1;
  for (const [pi, d0, region, side, tissue, dx, mech, act, sit, days, rec, onset] of SEED_CLOSED) {
    const timeLoss = days > 0, date = act === "game" ? snap(d0) : d0;
    injuries.push({
      id: `i${n++}`, playerId: `p${pi}`, date, region, side, tissue, diagnosis: dx, mechanism: mech, activity: act, situation: sit,
      onset, recurrence: rec, timeLoss, expectedDays: days, stage: "rtp", rtpDate: addDays(date, days),
      pain: Math.min(8, 2 + Math.round(days / 6)), reportedBy: n % 4 === 0 ? "athlete" : "physio",
      assessed: { by: ROLES.physio.name, at: date }, diagnosed: { by: ROLES.doctor.name, at: addDays(date, 1) },
      notes: [{ id: `n${n}`, at: addDays(date, days), by: ROLES.doctor.name, role: "doctor", text: timeLoss ? "Oyuna dönüş onayı verildi." : "Pansuman / bandaj, oyuna devam." }],
    });
  }
  for (const [pi, ago, region, side, tissue, dx, mech, act, sit, exp, stage, rec, onset, pain, by, notes] of SEED_ACTIVE) {
    const date = act === "game" && stage !== "reported" ? snap(addDays(todayISO, -ago)) : addDays(todayISO, -ago);
    const reported = stage === "reported", span = Math.max(1, diffDays(date, todayISO));
    const step = Math.max(1, Math.floor(span / (notes.length + 1)));
    injuries.push({
      id: `i${n++}`, playerId: `p${pi}`, date, region, side, tissue, diagnosis: dx, mechanism: mech, activity: act, situation: sit,
      onset, recurrence: rec, timeLoss: !reported, expectedDays: exp, stage, rtpDate: null, pain,
      reportedBy: by,
      assessed: reported ? null : { by: ROLES.physio.name, at: date },
      diagnosed: reported || stage === "acute" ? null : { by: ROLES.doctor.name, at: addDays(date, 1) },
      athleteNote: reported ? SEED_ATHLETE_NOTE[pi][0] : "",
      canPlay: reported ? SEED_ATHLETE_NOTE[pi][1] : null,
      notes: notes.map((t, k) => ({ id: `n${n}-${k}`, at: addDays(date, Math.min(span, 1 + k * step)), by: ROLES.physio.name, role: "physio", text: t })),
    });
  }
  const appearances = buildAppearances(players, matches, injuries);
  // A player injured during a match was on the pitch for part of it.
  for (const i of injuries) if (i.activity === "game") {
    const m = matches.find((x) => x.date === i.date), a = m && appearances.find((x) => x.matchId === m.id && x.playerId === i.playerId);
    if (a && !APP_STATUS[a.status].played) { a.status = "start"; a.minutes = 35 + (i.id.length * 7) % 50; }
  }
  const tokens = [
    { id: "q1", name: "Ahmet Kaya", label: "Masör", token: "MSR7KX2PQ", active: true, expires: "", created: "2026-07-06", note: "" },
    { id: "q2", name: "Burak Er", label: "Kondisyoner", token: "KND4WT9ZM", active: true, expires: "", created: "2026-07-06", note: "" },
    { id: "q3", name: "Cem Su", label: "Performans analisti", token: "ANL2HR6YV", active: false, expires: "", created: "2026-08-01", note: "Sezon arası ayrıldı" },
  ];
  return { v: SEED_V, players, injuries, matches, appearances, tokens, exposure: buildExposure(matches) };
}

// Weekly team training exposure, player-hours. Match exposure now comes from the match sheets (individual minutes).
function buildExposure(matches = []) {
  const rows = [];
  for (const s of SEASONS) {
    let wk = s.start, k = 0;
    const end = s.end < todayISO ? s.end : todayISO;
    while (wk <= end) {
      const pre = k < 5, md = wk.slice(5);
      const winter = md >= "12-22" || md <= "01-04";
      const sessions = pre ? 10 : winter ? 3 : 5, hours = pre ? 1.5 : 1.25, players = 25;
      const wkEnd = addDays(wk, 6), games = matches.filter((m) => m.date >= wk && m.date <= wkEnd).length;
      rows.push({ week: wk, sessions, hours, players, games });
      wk = addDays(wk, 7); k++;
    }
  }
  return rows;
}
const expoHours = (r) => ({ training: r.sessions * r.hours * r.players, game: r.games * CONFIG.MATCH_PLAYERS * (CONFIG.MATCH_MIN / 60) });
const randomToken = (n = 9) => { const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", b = new Uint32Array(n); crypto.getRandomValues(b); return [...b].map((x) => A[x % A.length]).join(""); };

/* ─────────────────────────── Store ─────────────────────────── */
const Store = {
  db: null,
  live: !!CONFIG.API_URL,
  listeners: new Set(),
  on(fn) { this.listeners.add(fn); },
  emit() { this.listeners.forEach((f) => f(this.db)); },

  async load(auth) {
    if (this.live) {
      const r = await api("getData", auth);
      if (r.status !== "ok") throw new Error(r.status);
      this.db = Object.assign({ matches: [], appearances: [], tokens: [], exposure: [] }, r.data);
      if (r.sess) this.sess = r.sess;
      applyMeta(r.data);
    } else {
      try { this.db = JSON.parse(localStorage.getItem(CONFIG.STORE_KEY)); } catch { this.db = null; }
      if (!this.db || this.db.v !== SEED_V) { this.db = buildSeed(); this.persist(); }
    }
    return this.db;
  },
  persist() { if (!this.live) try { localStorage.setItem(CONFIG.STORE_KEY, JSON.stringify(this.db)); } catch {} },
  reset() { try { localStorage.removeItem(CONFIG.STORE_KEY); } catch {} this.db = buildSeed(); this.persist(); this.emit(); },

  // A deleted roster row must never crash a render: fall back to a placeholder.
  player(id) { return this.db.players.find((p) => p.id === id) || { id, name: "Bilinmeyen oyuncu", no: "–", pos: "", age: null, height: null, active: false, code: "" }; },
  activePlayers() { return this.db.players.filter((p) => p.active !== false); },
  injury(id) { return this.db.injuries.find((i) => i.id === id); },
  match(id) { return (this.db.matches || []).find((m) => m.id === id); },
  appsFor(matchId) { return (this.db.appearances || []).filter((a) => a.matchId === matchId); },

  async saveInjury(inj, auth) {
    const exists = this.injury(inj.id);
    if (!inj.id) inj.id = "i" + Date.now().toString(36);
    if (exists) Object.assign(exists, inj); else this.db.injuries.push(inj);
    this.persist(); this.emit();
    if (this.live) {
      // The server sanitises by role (and may assign a new id) — its copy is the truth.
      const r = await api("saveInjury", auth, { injury: inj });
      if (r.status === "ok") { const k = this.db.injuries.findIndex((i) => i.id === inj.id); this.db.injuries[k] = r.injury; }
      else await this.load(auth);
      this.emit();
      if (r.status !== "ok") throw new Error(r.status);
      return r.injury;
    }
    return inj;
  },
  async removeInjury(id, auth) {
    this.db.injuries = this.db.injuries.filter((i) => i.id !== id);
    this.persist(); this.emit();
    if (this.live) { const r = await api("removeInjury", auth, { id }); if (r.status !== "ok") { await this.load(auth); this.emit(); throw new Error(r.status); } }
  },
  // A match and its full squad sheet are saved together.
  async saveMatch(match, apps, auth) {
    this.db.matches = this.db.matches || []; this.db.appearances = this.db.appearances || [];
    if (!match.id) match.id = "m" + Date.now().toString(36);
    const ex = this.match(match.id);
    if (ex) Object.assign(ex, match); else this.db.matches.push(match);
    this.db.matches.sort((a, b) => a.date.localeCompare(b.date));
    this.db.appearances = this.db.appearances.filter((a) => a.matchId !== match.id).concat(apps.map((a) => ({ ...a, matchId: match.id })));
    this.persist(); this.emit();
    if (this.live) {
      const r = await api("saveMatch", auth, { match, appearances: apps });
      if (r.status !== "ok") { await this.load(auth); this.emit(); throw new Error(r.status); }
      if (r.id && r.id !== match.id) { await this.load(auth); this.emit(); }
      return r.id || match.id;
    }
    return match.id;
  },
  async removeMatch(id, auth) {
    this.db.matches = (this.db.matches || []).filter((m) => m.id !== id);
    this.db.appearances = (this.db.appearances || []).filter((a) => a.matchId !== id);
    this.persist(); this.emit();
    if (this.live) { const r = await api("removeMatch", auth, { id }); if (r.status !== "ok") { await this.load(auth); this.emit(); throw new Error(r.status); } }
  },
  async saveToken(tok, auth) {
    this.db.tokens = this.db.tokens || [];
    const ex = tok.id && this.db.tokens.find((t) => t.id === tok.id);
    if (ex) Object.assign(ex, tok); else { tok.id = tok.id || "q" + Date.now().toString(36); this.db.tokens.push(tok); }
    this.persist(); this.emit();
    if (this.live) { const r = await api("saveToken", auth, { tok }); await this.load(auth); this.emit(); if (r.status !== "ok") throw new Error(r.status); }
  },
  async saveExposure(row, auth) {
    const ex = this.db.exposure.find((r) => r.week === row.week);
    if (ex) Object.assign(ex, row); else this.db.exposure.push(row);
    this.db.exposure.sort((a, b) => a.week.localeCompare(b.week));
    this.persist(); this.emit();
    if (this.live) { const r = await api("saveExposure", auth, { row }); if (r.status !== "ok") { await this.load(auth); this.emit(); throw new Error(r.status); } }
  },
};

function applyMeta(data) {
  if (Array.isArray(data.seasons) && data.seasons.length) SEASONS.splice(0, SEASONS.length, ...data.seasons);
  const m = data.meta || {};
  if (m.team) CONFIG.TEAM = m.team;
  if (m.doctorName) ROLES.doctor.name = m.doctorName;
  if (m.physioName) ROLES.physio.name = m.physioName;
  if (m.coachName) ROLES.coach.name = m.coachName;
}
const currentSeasonId = () => (SEASONS.find((s) => s.start <= todayISO && todayISO <= s.end) || [...SEASONS].sort((a, b) => b.start.localeCompare(a.start))[0] || { id: "all" }).id;

async function api(action, auth = {}, body = {}) {
  // text/plain avoids a CORS preflight on Apps Script; the /exec endpoint is flaky, so retry.
  for (let t = 0; t < 5; t++) {
    try {
      const r = await fetch(CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action, ...auth, ...body }) });
      const txt = await r.text();
      return JSON.parse(txt);
    } catch (e) { await new Promise((res) => setTimeout(res, 600 * (t + 1))); }
  }
  return { status: "network" };
}

/* ─────────────────────────── Metrics ─────────────────────────── */
const M = {
  days(inj) { return inj.rtpDate ? diffDays(inj.date, inj.rtpDate) : Math.max(0, diffDays(inj.date, todayISO)); },
  active(inj) { return inj.stage !== "rtp"; },
  inRange(inj, r) { return !r || (inj.date >= r.start && inj.date <= r.end); },
  status(playerId, injuries) {
    // Unreviewed QR reports never move availability; staff review turns them into a real record first.
    const act = injuries.filter((i) => i.playerId === playerId && M.active(i) && !(i.stage === "reported" && i.reportedBy === "reporter"));
    if (act.some((i) => i.timeLoss && ["acute", "rehab"].includes(i.stage))) return "out";
    if (act.some((i) => i.stage === "reported" && i.canPlay === "no")) return "out";
    if (act.some((i) => !(i.stage === "reported" && i.canPlay === "yes"))) return "limited";
    return "available";
  },
  // Days lost inside the window [start,end] (an injury crossing a boundary counts partially).
  daysIn(inj, r) {
    if (!inj.timeLoss) return 0;
    const s = r && inj.date < r.start ? r.start : inj.date;
    const endInj = inj.rtpDate || todayISO;
    const e = r && endInj > r.end ? r.end : endInj;
    return Math.max(0, diffDays(s, e));
  },
  // Training: weekly team rows. Match: individual minutes from the match sheets; a match without a sheet
  // falls back to 11 players × its duration; with no fixtures at all, to the weekly "games" estimate.
  exposure(db, r) {
    let training = 0, game = 0;
    const inR = (d) => !r || (d >= r.start && d <= r.end);
    for (const row of db.exposure || []) if (inR(row.week)) training += expoHours(row).training;
    const ms = (db.matches || []).filter((m) => m.date <= todayISO && inR(m.date));
    if (ms.length) for (const m of ms) game += M.matchHours(db, m);
    else for (const row of db.exposure || []) if (inR(row.week)) game += expoHours(row).game;
    return { training, game, total: training + game };
  },
  matchHours(db, m) {
    const mins = (db.appearances || []).filter((a) => a.matchId === m.id).reduce((s, a) => s + (Number(a.minutes) || 0), 0);
    return (mins || CONFIG.MATCH_PLAYERS * (m.duration || CONFIG.MATCH_MIN)) / 60;
  },
  matches(db, r) { return (db.matches || []).filter((m) => m.date <= todayISO && (!r || (m.date >= r.start && m.date <= r.end))).sort((a, b) => a.date.localeCompare(b.date)); },
  // Days since the previous fixture (fixture congestion); null for a season's first match.
  recovery(db) {
    const out = {}, ms = [...(db.matches || [])].sort((a, b) => a.date.localeCompare(b.date));
    ms.forEach((m, k) => { const prev = ms[k - 1]; out[m.id] = prev && diffDays(prev.date, m.date) <= 21 ? diffDays(prev.date, m.date) : null; });
    return out;
  },
  // Team fixtures a player missed because of this injury (between onset and return to play).
  missed(inj, db) {
    if (!inj.timeLoss || inj.stage === "reported") return 0;
    const end = inj.rtpDate || addDays(todayISO, 1);
    return (db.matches || []).filter((m) => m.date <= todayISO && (inj.activity === "game" ? m.date > inj.date : m.date >= inj.date) && m.date < end).length;
  },
  // Season line for one player: appearances, minutes, matches missed (injury / illness / other).
  playerStats(db, pid, r) {
    const ms = M.matches(db, r), apps = db.appearances || [];
    const o = { matches: ms.length, played: 0, starts: 0, subs: 0, minutes: 0, injury: 0, illness: 0, other: 0, unused: 0 };
    for (const m of ms) {
      const a = apps.find((x) => x.matchId === m.id && x.playerId === pid);
      if (a) {
        const st = APP_STATUS[a.status] || {};
        if (st.played) { o.played++; o.minutes += Number(a.minutes) || 0; a.status === "start" ? o.starts++ : o.subs++; }
        else if (st.missed) o[st.missed]++;
        else o.unused++;
      } else if (db.injuries.some((i) => i.playerId === pid && M.missed(i, { matches: [m] }))) o.injury++;
    }
    o.availability = o.matches ? 1 - (o.injury + o.illness) / o.matches : 1;
    return o;
  },
  // Player match availability (Hägglund 2013): share of the squad not injured/ill, averaged over fixtures.
  matchAvailability(db, r) {
    const ms = M.matches(db, r), apps = db.appearances || [];
    if (!ms.length) return { mean: 0, perMatch: [] };
    const roster = db.players.filter((p) => p.active !== false).length || 1;
    const perMatch = ms.map((m) => {
      const a = apps.filter((x) => x.matchId === m.id);
      const injured = a.length ? a.filter((x) => x.status === "injured").length : db.players.filter((p) => db.injuries.some((i) => i.playerId === p.id && M.missed(i, { matches: [m] }))).length;
      const ill = a.filter((x) => x.status === "ill").length, squad = a.length || roster;
      return { m, injured, ill, squad, avail: 1 - (injured + ill) / squad };
    });
    return { mean: perMatch.reduce((s, x) => s + x.avail, 0) / perMatch.length, perMatch };
  },
  // Match-injury incidence after short (≤4 d) vs long (≥6 d) recovery.
  congestion(db, r) {
    const rec = M.recovery(db), ms = M.matches(db, r), out = { short: { n: 0, h: 0, m: 0 }, long: { n: 0, h: 0, m: 0 } };
    for (const m of ms) {
      const d = rec[m.id]; if (d === null || d === undefined || d === 5) continue;
      const g = d <= CONGESTION_DAYS ? out.short : out.long;
      g.m++; g.h += M.matchHours(db, m);
      g.n += db.injuries.filter((i) => i.timeLoss && i.stage !== "reported" && i.activity === "game" && i.date === m.date).length;
    }
    for (const g of [out.short, out.long]) g.inc = g.h ? (g.n / g.h) * 1000 : 0;
    return out;
  },
  summary(db, range) {
    const inj = db.injuries.filter((i) => M.inRange(i, range) && i.stage !== "reported");
    const tl = inj.filter((i) => i.timeLoss);
    const ex = M.exposure(db, range);
    const daysLost = db.injuries.reduce((s, i) => s + M.daysIn(i, range), 0);
    const per = (n, h) => (h ? (n / h) * 1000 : 0);
    const roster = db.players.filter((p) => p.active !== false);
    const statuses = roster.map((p) => M.status(p.id, db.injuries));
    const avail = statuses.filter((s) => s === "available").length;
    return {
      total: inj.length, timeLoss: tl.length, daysLost, ex,
      incidence: per(tl.length, ex.total),
      incTraining: per(tl.filter((i) => i.activity === "training").length, ex.training),
      incGame: per(tl.filter((i) => i.activity === "game").length, ex.game),
      burden: per(daysLost, ex.total),
      meanDays: tl.length ? tl.reduce((s, i) => s + M.days(i), 0) / tl.length : 0,
      availability: roster.length ? avail / roster.length : 0,
      counts: { available: avail, limited: statuses.filter((s) => s === "limited").length, out: statuses.filter((s) => s === "out").length },
      pending: db.injuries.filter((i) => i.stage === "reported" || (!i.diagnosed && M.active(i))).length,
      active: db.injuries.filter(M.active).length,
      recurrent: inj.filter((i) => i.recurrence === "recurrent").length,
      severe: per(tl.filter((i) => M.days(i) > 28).length, ex.total),
      matches: M.matches(db, range).length,
      matchAvail: M.matchAvailability(db, range).mean,
      missed: tl.reduce((s2, i) => s2 + M.missed(i, db), 0),
    };
  },
  // Time-loss muscle injuries by group (hamstring / adductor / quadriceps / calf).
  muscle(db, range) {
    const tl = db.injuries.filter((i) => M.inRange(i, range) && i.stage !== "reported" && i.timeLoss && i.tissue === "muscle");
    return MUSCLE_GROUPS.map((g) => {
      const arr = tl.filter((i) => i.region === g.region);
      return { ...g, n: arr.length, days: arr.reduce((s, i) => s + M.days(i), 0), recurrent: arr.filter((i) => i.recurrence === "recurrent").length, active: arr.filter(M.active).length };
    });
  },
  groupBy(arr, key) { const m = {}; for (const x of arr) { const k = typeof key === "function" ? key(x) : x[key]; m[k] = (m[k] || 0) + 1; } return m; },
};
