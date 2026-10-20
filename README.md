# Pitchside — Futbol Sakatlık Gözetim Sistemi

Profesyonel futbol takımı için dört katmanlı sakatlık gözetimi. Bağımlılık yok, derleme yok; statik dosyalar + isteğe bağlı Google Apps Script arka ucu. (Rebound basketbol sisteminin futbol sürümü.)

| Katman | Giriş | Yapabildikleri |
|---|---|---|
| L1 · Sporcu | kişisel kod | 30 saniyelik bildirim (vücut haritası, ağrı, maç/antrenman, **oyun anı**, oynayabilir mi), kendi süreci ve geçmişi, ekibe not |
| L2 · Fizyoterapist | PIN | kayıt açma/düzenleme, bildirimleri değerlendirme, rehabilitasyon panosu (Akut → Rehab → RTT) |
| L3 · Teknik ekip | PIN | **yalnızca okur**: saha üzerinde kadro derinliği, uygunluk, bölge, tahmini dönüş. Tanı / klinik not / sporcu ifadesi sunucudan hiç gönderilmez |
| L4 · Hekim | PIN | tanı onayı, oyuna dönüş (RTP) kararı, silme, maruziyet saatleri, tüm dashboard |

## Futbola özgü
- **Kadro derinliği**: 4-3-3 saha üzerinde her pozisyondaki oyuncular, durum renkleriyle; hat bazında hazır/toplam ve "İlk 11 kurulabilir mi" kontrolü.
- **Kas sakatlıkları**: hamstring · adduktor · kuadriseps · baldır (zaman kaybı, kayıp gün, tekrarlayan, aktif).
- **Oyun anı**: sprint, şut/uzun pas, ikili mücadele, kayarak müdahale, hava topu, yön değiştirme, düşme.
- **Maç maruziyeti** = 11 oyuncu × 90 dk (16,5 oyuncu-saat/maç).
- Pozisyon kodları: `GK · RB CB LB · DM CM AM · RW LW ST`.

## Dosyalar
- `index.html` — tanıtım sayfası (3D futbol topu, dört katman sahnesi)
- `app.html` — uygulama (rol girişi + tüm paneller)
- `assets/data.js` — veri modeli, metrikler, demo verisi, `CONFIG.API_URL`
- `assets/app.js` · `app.css` · `tokens.css` · `body.js` (vücut haritası) · `charts.js` (SVG grafikler)
- `appsscript.gs` + `appsscript.json` — Google E-Tablo arka ucu
- `serve.js` — yerel önizleme: `node serve.js` → http://localhost:4290

## Veriler: Google E-Tablo
Tüm veriler takımın Google E-Tablosunda, her alan kendi sütununda durur (Panel, Sakatlıklar, Oyuncular, Notlar, Maruziyet, Sezonlar, Ayarlar, Denetim). E-tabloya bağlı Apps Script (`appsscript.gs`) şablonu açılışta kurar/onarır; PIN'ler e-tabloya değil betik ayarlarına yazılır. Bu repoda hiçbir sağlık verisi yoktur — demo oyuncuları uydurmadır.

Şablon değişirse `TEMPLATE_V`'yi artır → bir sonraki açılışta veriler korunarak onarılır.

## Canlıya geçiş (kalan adımlar)
1. ~~E-tablo + Apps Script~~ — yapıldı.
2. **Pitchside ▸ PIN'leri ayarla…** — hekim, fizyoterapist, teknik ekip (her biri farklı, en az 6 karakter; betik ayarlarına yazılır).
3. **Oyuncular** sekmesine kadroyu ve pozisyonları yaz; kişisel kodları sporculara ilet.
4. Dağıt ▸ Yeni dağıtım ▸ Web uygulaması (Ben olarak çalıştır · erişim: Herkes) → `/exec` adresini `assets/data.js` → `CONFIG.API_URL`'ye yapıştır.

Demo modunda (`API_URL` boş) veriler yalnızca tarayıcıda (localStorage) tutulur; alttaki "Sıfırla" demo sezonunu yeniden yükler.

## Metrikler (IOC 2020 + futbol konsensüsü)
- **Zaman kaybı**: ≥1 gün tam katılamama. Diğerleri "tıbbi başvuru".
- **Şiddet**: sakatlık gününden tam kullanılabilirliğe kadar gün (1–3 / 4–7 / 8–28 / >28).
- **İnsidans**: zaman kaybı sakatlıkları / oyuncu-saat × 1000 (maç ve antrenman ayrı).
- **Yük**: kayıp gün / oyuncu-saat × 1000.
