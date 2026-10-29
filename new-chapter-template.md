# Template tạo Chapter mới — Kanji Bento / Kotoba Forest

File này là **template tái sử dụng** để tạo một chapter mới cho game
(Kanji Bento — "Kanji The Lost World"). Người dùng chỉ cần cung cấp **tối thiểu 3 thứ**:

1. **1 chữ kanji** (vd `林`)
2. **Cách ghép từ bộ thủ** (vd `木 + 木`)
3. **Câu chuyện ngắn** (ý tưởng cho chapter, 1–3 câu)

Mọi thứ còn lại — hội thoại, mục tiêu, từ vựng, nét chữ SVG, catalog, furigana —
do **AI tự sáng tạo** theo template này.

---

## 1. Cách sử dụng

1. Dán **Phần 2 (Đầu vào)** với thông tin kanji của bạn.
2. AI điền **Phần 3 (Sản phẩm)** theo đúng cấu trúc dữ liệu trong game.
3. Kiểm tra bằng **Phần 4 (Checklist)**.
4. Áp code vào đúng vị trí trong **Phần 5 (Vị trí áp dụng)**.

---

## 2. ĐẦU VÀO — người dùng điền

```text
KANJI:            <ký tự kanji, vd: 林>
BỘ THỦ GHÉP:      <danh sách bộ thủ, vd: 木 + 木>
CÂU CHUYỆN NGẮN:  <1–3 câu mô tả nội dung chapter, vd: "Một khu rừng con mọc
                   lên từ hai gốc cây. Gió đã cuốn mất chữ 林, và lũ chim
                   không còn chỗ làm tổ.">
[TÙY CHỌN] 3 TỪ VỰNG:  <jp + nghĩa, vd: 林(はやし) = rừng, 森林(しんりん) = rừng sâu...>
[TÙY CHỌN] ÂM ON/KUN:  <vd: on=リン, kun=はやし>
```

> Nếu người dùng **không** cung cấp từ vựng / âm đọc / số nét, AI tự tra cứu và
> điền — nhưng **phải kiểm tra lại tính chính xác** (âm On/Kun, số nét, từ vựng).

---

## 3. SẢN PHẨM — AI tạo ra (đúng cấu trúc dữ liệu game)

### 3.1. Chapter object (thêm vào mảng `CHAPTERS` trong `src/game/data.ts`)

```ts
{
  id: "<slug tiếng anh, vd: rin>",
  num: <số chapter kế tiếp, vd: 4>,
  title: { en: "...", ja: "...", vi: "..." },
  digChars: ["<bộ thủ 1>", "<bộ thủ 2>"],          // 2 bộ thủ đào được, đúng thứ tự
  shrineOptions: ["<bộ thủ 1>", "<bộ thủ 2>", "<mồi nhử 1>", "<mồi nhử 2>"], // 4 lựa chọn
  scene: "<rest | bright | rock | CẢNH MỚI>",
  kanji: { /* xem 3.2 */ },
  strokes: [ /* xem 3.3 */ ],
  objectives: { /* xem 3.4 */ },
  dialogues: { /* xem 3.5 */ },
}
```

### 3.2. `kanji: KanjiData`

```ts
kanji: {
  char: "<kanji>",
  meaning: { en: "...", ja: "...", vi: "..." },
  on: "<âm On + romaji, vd: リン (rin)>",
  kun: "<âm Kun + romaji, vd: はやし (hayashi)>",
  strokes: <số nét>,
  parts: ["<bộ thủ 1>", "<bộ thủ 2>", ...],   // phải có trong RADICALS
  story: { en: "...", ja: "...", vi: "..." }, // mở rộng từ câu chuyện người dùng cung cấp
  vocab: [
    { jp: "...", kana: "...", en: { en: "...", ja: "...", vi: "..." } },
    // 3 từ vựng, kana BẮT BUỘC (cho furigana)
  ],
}
```

### 3.3. `strokes: string[]` — SVG path từng nét

- Mỗi phần tử là **1 nét chữ**, định dạng SVG path trong khung **100×100**.
- **Đúng thứ tự nét** (dùng cho hoạt ảnh tập viết ở Calligraphy Desk).
- Tham khảo chapter 1 (`休`, 6 nét):
  ```ts
  strokes: [
    "M32 10 Q24 32 10 50",
    "M23 34 L23 92",
    "M38 38 L93 38",
    "M65 10 L65 94",
    "M63 40 Q50 62 35 76",
    "M67 40 Q80 60 95 74",
  ],
  ```

### 3.4. `objectives` — 7 mục tiêu × 3 ngôn ngữ

```ts
objectives: {
  arrival: { en: "...", ja: "...", vi: "..." }, // Nói chuyện với Mori
  mine:    { en: "...", ja: "...", vi: "..." }, // Đào đá phát sáng ở Mỏ Bộ Thủ
  shrine:  { en: "...", ja: "...", vi: "..." }, // Ghé Miếu Tranh
  bento:   { en: "...", ja: "...", vi: "..." }, // Ghép kanji ở Bàn Bento
  write:   { en: "...", ja: "...", vi: "..." }, // Tập viết ở Bàn Thư Pháp
  restore: { en: "...", ja: "...", vi: "..." }, // Quay lại chỗ Mori
  done:    { en: "...", ja: "...", vi: "..." }, // Hoàn thành, mở Catalog
}
```

### 3.5. `dialogues` — 7 nhóm hội thoại × 3 ngôn ngữ (+ kana)

Mỗi dòng: `{ who: "mori" | "tanuki", text: { en, ja, vi }, kana?: string }`

- **`arrival`** (3–5 dòng): Tanuki nhìn biển báo trống → Mori chào đón → giải thích
  tai họa (gió đánh cắp chữ) → nhiệm vụ đào bộ thủ → Tanuki quyết tâm.
- **`mine`** (1 dòng): Mori chỉ đường tới Mỏ Bộ Thủ.
- **`shrine`** (2 dòng): Mori giải thích ý nghĩa 2 bộ thủ + bảo mang tới Miếu Tranh.
- **`bento`** (1 dòng): Mori hướng dẫn ghép 2 bộ thủ vào Bento Box.
- **`write`** (2 dòng): Mori giới thiệu kanji hoàn chỉnh + mở Calligraphy Desk.
- **`restore`** (2–3 dòng): Mori khen nét chữ → mô tả cảnh vật hồi sinh → chúc mừng
  level mới, giới thiệu Catalog.
- **`done`** (1 dòng): Mori mời nghỉ ngơi / xem Catalog.

**QUY TẮC HỘI THOẠI:**
- Nhân vật chỉ có **Mori** (cú, người giữ rừng, hay nói "ホーホー！") và **Tanuki**
  (im lặng, chỉ có dòng miêu tả hành động trong ngoặc đơn, vd `（タヌキは…）`).
- Mỗi dòng tiếng Nhật **BẮT BUỘC có `kana`** — phiên âm hiragana đầy đủ của cả câu
  (cho tính năng furigana). Kana phải khớp chính xác từng ký tự kanji/kana.
- Giữ giọng văn ấm áp, dễ thương, hợp trẻ em học kanji.

### 3.6. RADICALS mới (nếu dùng bộ thủ chưa có)

Trong `RADICALS` (data.ts) — thêm mọi ký tự mới xuất hiện trong `digChars`,
`parts`, `shrineOptions` (kể cả mồi nhử):

```ts
"林": { name: "<cách đọc, vd: はやし>", meaning: { en: "...", ja: "...", vi: "..." } },
```

### 3.7. CATALOG — hội thoại mở khóa theo level mới

Thêm entry với `level: <số chapter>` (catalog lọc theo `state.level`):

```ts
{
  level: 4,
  title: { en: "...", ja: "...", vi: "..." },
  lines: [
    { who: "Mori", jp: "...", kana: "...", romaji: "...", en: { en: "...", ja: "...", vi: "..." } },
    { who: "Tanuki", jp: "...", kana: "...", romaji: "...", en: { en: "...", ja: "...", vi: "..." } },
  ],
}
```

- Mỗi group **2 dòng** (Mori + Tanuki), dùng từ vựng/kanji của chapter.
- Nên tạo **2–3 group** cho mỗi level (tham khảo level 1 có 3 group).
- `kana` BẮT BUỘC (furigana), `romaji` BẮT BUỘC.

### 3.8. Scene + asset (chỉ khi cần)

- **Scene mới**: nếu chapter dùng cảnh ký ức mới (ngoài `rest/bright/rock`), AI đề
  xuất tên cảnh + mô tả hình ảnh. Lúc đó cần sửa `Chapter["scene"]` trong data.ts
  và thêm nhánh trong `MemoryScene` (Modals.tsx) — ảnh `memory-*.jpg` hoặc SVG.
- **Vật trang trí riêng** (như `bench.png` của chapter 1): AI đề xuất asset cần vẽ
  + vị trí đặt trong Game.tsx. Nếu không cần, bỏ qua.

---

## 4. CHECKLIST bắt buộc (kiểm tra trước khi bàn giao)

- [ ] `id` duy nhất, `num` = chapter kế tiếp
- [ ] Mọi chuỗi `Localized` đủ **3 ngôn ngữ** (en/ja/vi)
- [ ] `digChars` có đúng 2 phần tử; `shrineOptions` có đúng 4 (2 đúng + 2 mồi nhử)
- [ ] Mọi ký tự trong `parts` / `digChars` / `shrineOptions` đều có trong `RADICALS`
- [ ] `strokes` đủ số nét, đúng thứ tự, trong khung 100×100
- [ ] Đủ **7 nhóm** `dialogues` (arrival/mine/shrine/bento/write/restore/done)
- [ ] **Mọi dòng tiếng Nhật đều có `kana`** — và kana khớp chính xác (kiểm tra bằng
      `splitFurigana` / test `src/test/furigana.test.ts`)
- [ ] `vocab` có 3 từ, mỗi từ có `kana`
- [ ] CATALOG có group với `level` = chapter mới
- [ ] Âm On/Kun, số nét, nghĩa kanji **chính xác** (tra cứu kỹ)
- [ ] Build chạy được: `npm run build` + `npm test`

---

## 5. VỊ TRÍ ÁP DỤNG CODE

| Nội dung | File |
|---|---|
| Chapter object (3.1–3.5) | `src/game/data.ts` → mảng `CHAPTERS` |
| Radicals mới (3.6) | `src/game/data.ts` → object `RADICALS` |
| Catalog (3.7) | `src/game/data.ts` → mảng `CATALOG` |
| Scene mới (3.8) | `src/game/data.ts` (type) + `src/game/Modals.tsx` (`MemoryScene`) |
| Asset trang trí (3.8) | `src/assets/` + `src/game/Game.tsx` (import + sprite) |
| Test furigana | `src/test/furigana.test.ts` |

**Không cần sửa**: luồng game (`STEP_ORDER`, `target`, `closeDialogue`), màn hình
chào, Journal, Bento, Calligraphy — đều generic, tự hoạt động với chapter mới.

---

## 6. PROMPT MẪU — dán lại để AI tạo chapter

> Tạo chapter mới cho game Kanji Bento theo template `docs/new-chapter-template.md`.
>
> **Đầu vào:**
> - KANJI: `<kanji>`
> - BỘ THỦ GHÉP: `<bộ thủ>`
> - CÂU CHUYỆN NGẮN: `<câu chuyện>`
> - TỪ VỰNG (tùy chọn): `<...>`
>
> Tạo đầy đủ: chapter object, kanji data, SVG nét chữ, 7 objectives × 3 ngôn ngữ,
> 7 nhóm hội thoại (kèm kana cho furigana), radicals mới, catalog level mới.
> Tuân thủ checklist ở Phần 4, rồi build + test để xác nhận.
