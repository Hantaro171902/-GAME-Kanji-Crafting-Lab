import type { Localized } from "./i18n";

export type Step = "arrival" | "mine" | "shrine" | "bento" | "write" | "restore" | "done";

export const STEP_ORDER: Step[] = ["arrival", "mine", "shrine", "bento", "write", "restore", "done"];
export const atLeast = (s: Step, t: Step) => STEP_ORDER.indexOf(s) >= STEP_ORDER.indexOf(t);

export type KanjiData = {
  char: string;
  meaning: Localized<string>;
  on: string;
  kun: string;
  strokes: number;
  parts: string[];
  story: Localized<string>;
  vocab: { jp: string; kana: string; en: Localized<string> }[];
};

export type Line = { who: "mori" | "tanuki"; text: Localized<string> };

export type Chapter = {
  id: string;
  num: number;
  title: Localized<string>;
  /** The two radical pieces dug from rock1 / rock2, in order. */
  digChars: [string, string];
  /** Four shrine options: the two correct pieces plus two decoys. */
  shrineOptions: string[];
  /** Visual scene the Picture Shrine shows for this chapter. */
  scene: "rest" | "bright" | "rock";
  kanji: KanjiData;
  /** Simplified stroke paths in a 100x100 box, in stroke order. */
  strokes: string[];
  objectives: Record<Step, Localized<string>>;
  dialogues: Record<string, Line[]>;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "kyu",
    num: 1,
    title: { en: "A Place to Rest", ja: "休む場所", vi: "Nơi Nghỉ Ngơi" },
    digChars: ["亻", "木"],
    shrineOptions: ["亻", "口", "木", "水"],
    scene: "rest",
    kanji: {
      char: "休",
      meaning: { en: "Rest", ja: "休む", vi: "Nghỉ ngơi" },
      on: "キュウ (kyū)",
      kun: "やす・む (yasu-mu)",
      strokes: 6,
      parts: ["亻", "木"],
      story: {
        en: "A person (亻) leaning against a tree (木) — taking a rest.",
        ja: "人が木にもたれかかって休んでいる姿。",
        vi: "Một người (亻) tựa vào gốc cây (木) — đang nghỉ ngơi.",
      },
      vocab: [
        { jp: "休む", kana: "やすむ", en: { en: "to rest", ja: "休むこと", vi: "nghỉ ngơi" } },
        { jp: "休日", kana: "きゅうじつ", en: { en: "day off", ja: "休みの日", vi: "ngày nghỉ" } },
        { jp: "休憩", kana: "きゅうけい", en: { en: "a break", ja: "ひと休み", vi: "giải lao" } },
      ],
    },
    strokes: [
      "M32 10 Q24 32 10 50",
      "M23 34 L23 92",
      "M38 38 L93 38",
      "M65 10 L65 94",
      "M63 40 Q50 62 35 76",
      "M67 40 Q80 60 95 74",
    ],
    objectives: {
      arrival: { en: "Talk to Mori by the Great Kanji Tree", ja: "大漢字の木のそばでモリと話す", vi: "Trò chuyện với Mori bên Cây Kanji Vĩ Đại" },
      mine: { en: "Dig the glowing rocks in the Radical Mine", ja: "部首鉱山で光る岩を掘る", vi: "Đào những tảng đá phát sáng trong Mỏ Bộ Thủ" },
      shrine: { en: "Visit the Picture Shrine", ja: "絵神社を訪れる", vi: "Ghé thăm Miếu Tranh" },
      bento: { en: "Build the Kanji at the Bento Table", ja: "弁当台で漢字を作る", vi: "Ghép chữ Kanji tại Bàn Bento" },
      write: { en: "Practice writing at the Calligraphy Desk", ja: "書道机で書き方を練習する", vi: "Tập viết tại Bàn Thư Pháp" },
      restore: { en: "Return to Mori", ja: "モリのもとへ戻る", vi: "Quay lại chỗ Mori" },
      done: { en: "Chapter complete! Browse the Conversation Catalog", ja: "章クリア！会話カタログを見てみよう", vi: "Hoàn thành chương! Khám phá Danh Mục Hội Thoại" },
    },
    dialogues: {
      arrival: [
        { who: "tanuki", text: { en: "...? (Tanuki stares at the sign. The squiggles mean nothing yet.)", ja: "……？（タヌキが看板をじっと見ている。まだ何も読めない。）", vi: "...? (Tanuki nhìn chằm chằm tấm biển. Những nét nguệch ngoạc chẳng có nghĩa gì cả.)" } },
        { who: "mori", text: { en: "Hoo-hoo! A traveler! Welcome to Kotoba Forest. I'm Mori, keeper of the Great Kanji Tree.", ja: "ホーホー！旅人だね！ことばの森へようこそ。私は大漢字の木の番人、モリだよ。", vi: "Hoo-hoo! Một lữ khách! Chào mừng đến Rừng Kotoba. Ta là Mori, người trông giữ Cây Kanji Vĩ Đại." } },
        { who: "mori", text: { en: "A strange wind blew through and every word in the forest broke into pieces. Signs went blank, memories sealed shut.", ja: "不思議な風が吹いて、森の言葉が全部バラバラになってしまったんだ。看板は真っ白になり、記憶は閉ざされてしまった。", vi: "Một cơn gió lạ thổi qua và mọi từ ngữ trong khu rừng vỡ thành từng mảnh. Biển hiệu trở nên trống rỗng, ký ức bị phong ấn." } },
        { who: "mori", text: { en: "But those pieces — radicals — are hidden inside the glowing rocks to the west. Dig them up!", ja: "でもその破片——部首——は西の光る岩の中に隠れているんだ。掘り出してくれ！", vi: "Nhưng những mảnh đó — bộ thủ — đang ẩn bên trong những tảng đá phát sáng ở phía tây. Hãy đào chúng lên!" } },
        { who: "tanuki", text: { en: "(Tanuki pats its little bento box with determination.)", ja: "（タヌキは小さな弁当箱を力強くトントンと叩く。）", vi: "(Tanuki quyết tâm vỗ nhẹ chiếc hộp bento nhỏ của mình.)" } },
      ],
      mine: [{ who: "mori", text: { en: "The glowing rocks are in the Radical Mine, west of here. Give them a few good whacks!", ja: "光る岩はここから西の部首鉱山にあるよ。しっかり叩いてみて！", vi: "Những tảng đá phát sáng nằm trong Mỏ Bộ Thủ, phía tây đây. Hãy đập chúng vài cú thật mạnh!" } }],
      shrine: [
        { who: "mori", text: { en: "Two pieces! 亻 is a person standing sideways, and 木 is a tree.", ja: "破片が二つ！亻は横向きに立っている人、木は木だよ。", vi: "Hai mảnh! 亻 là một người đứng nghiêng, còn 木 là cái cây." } },
        { who: "mori", text: { en: "Kanji are built from pieces like these. Take them to the Picture Shrine — it remembers what they mean together.", ja: "漢字はこういう部品からできているんだ。絵神社に持っていくと、一緒になるとどんな意味になるか思い出してくれるよ。", vi: "Kanji được tạo nên từ những bộ phận như thế này. Hãy mang chúng đến Miếu Tranh — nó sẽ nhớ ý nghĩa khi chúng đứng cùng nhau." } },
      ],
      bento: [{ who: "mori", text: { en: "Now pop those pieces into your Bento Box at the table. Left and right, like a little lunch!", ja: "さあ、その破片をテーブルの弁当箱に入れてごらん。左右に並べて、まるで小さなお弁当みたいに！", vi: "Giờ hãy đặt những mảnh đó vào Hộp Bento trên bàn. Trái và phải, như một bữa trưa nhỏ!" } }],
      write: [
        { who: "mori", text: { en: "休 — a person resting by a tree. Look, the forest is already listening to you!", ja: "休——木のそばで休んでいる人だよ。ほら、森がもう君の声を聞いている！", vi: "休 — một người đang nghỉ ngơi bên gốc cây. Nhìn kìa, khu rừng đang lắng nghe bạn đấy!" } },
        { who: "mori", text: { en: "A word stays with you once your hand remembers it. The Calligraphy Desk is open now.", ja: "手が覚えると、言葉はずっと君のものになるんだ。書道机がもう使えるよ。", vi: "Một từ sẽ ở lại với bạn một khi đôi tay ghi nhớ nó. Bàn Thư Pháp giờ đã mở." } },
      ],
      restore: [
        { who: "mori", text: { en: "Beautiful brushwork! Watch the tree…", ja: "見事な筆さばきだ！木を見ていてごらん……", vi: "Nét bút tuyệt đẹp! Hãy nhìn cái cây…" } },
        { who: "mori", text: { en: "A resting place has returned beneath the branches, and the old sign reads 休 again.", ja: "枝の下に休む場所が戻ってきた。古い看板にはまた「休」と書かれている。", vi: "Một nơi nghỉ ngơi đã trở lại dưới tán cây, và tấm biển cũ lại đọc được chữ 休." } },
        { who: "mori", text: { en: "You've reached Level 1, little one. Now I can teach you some real conversations. Come see my catalog anytime!", ja: "レベル1到達だね、小さい子よ。これから本当の会話を教えてあげられるよ。いつでも私のカタログを見においで！", vi: "Con đã đạt Cấp 1 rồi, bé nhỏ à. Giờ ta có thể dạy con vài cuộc hội thoại thực sự. Hãy ghé xem danh mục của ta bất cứ lúc nào!" } },
      ],
      done: [{ who: "mori", text: { en: "Rest a while! When you're ready, I'll share phrases from my Conversation Catalog.", ja: "少し休んでいいよ！準備ができたら、会話カタログからフレーズを教えてあげるね。", vi: "Hãy nghỉ ngơi một lát! Khi sẵn sàng, ta sẽ chia sẻ những câu hội thoại từ Danh Mục của mình." } }],
    },
  },
  {
    id: "mei",
    num: 2,
    title: { en: "A Light in the Dark", ja: "闇の中の光", vi: "Ánh Sáng Trong Bóng Tối" },
    digChars: ["日", "月"],
    shrineOptions: ["日", "月", "口", "火"],
    scene: "bright",
    kanji: {
      char: "明",
      meaning: { en: "Bright", ja: "明るい", vi: "Sáng" },
      on: "メイ (mei)",
      kun: "あか・るい (aka-rui)",
      strokes: 8,
      parts: ["日", "月"],
      story: {
        en: "The sun (日) and the moon (月) together — bright enough to light the whole forest.",
        ja: "太陽と月が一緒になって、森全体を照らすほど明るい。",
        vi: "Mặt trời (日) và mặt trăng (月) cùng nhau — đủ sáng để thắp sáng cả khu rừng.",
      },
      vocab: [
        { jp: "明るい", kana: "あかるい", en: { en: "bright", ja: "明るいこと", vi: "sáng sủa" } },
        { jp: "明日", kana: "あした", en: { en: "tomorrow", ja: "明日", vi: "ngày mai" } },
        { jp: "明かり", kana: "あかり", en: { en: "light / lamp", ja: "明かり", vi: "ánh sáng / đèn" } },
      ],
    },
    strokes: [
      "M20 12 L20 88",
      "M20 20 L44 20 L44 88",
      "M20 50 L44 50",
      "M20 88 L44 88",
      "M60 14 Q56 45 50 84",
      "M58 20 L88 20 L88 88 L82 88",
      "M58 48 L86 48",
      "M54 80 L88 80",
    ],
    objectives: {
      arrival: { en: "Talk to Mori by the Great Kanji Tree", ja: "大漢字の木のそばでモリと話す", vi: "Trò chuyện với Mori bên Cây Kanji Vĩ Đại" },
      mine: { en: "Dig the glowing rocks in the Radical Mine", ja: "部首鉱山で光る岩を掘る", vi: "Đào những tảng đá phát sáng trong Mỏ Bộ Thủ" },
      shrine: { en: "Visit the Picture Shrine", ja: "絵神社を訪れる", vi: "Ghé thăm Miếu Tranh" },
      bento: { en: "Build the Kanji at the Bento Table", ja: "弁当台で漢字を作る", vi: "Ghép chữ Kanji tại Bàn Bento" },
      write: { en: "Practice writing at the Calligraphy Desk", ja: "書道机で書き方を練習する", vi: "Tập viết tại Bàn Thư Pháp" },
      restore: { en: "Return to Mori", ja: "モリのもとへ戻る", vi: "Quay lại chỗ Mori" },
      done: { en: "Chapter complete! The lanterns are lit", ja: "章クリア！ランタンに灯がともった", vi: "Hoàn thành chương! Những chiếc đèn lồng đã sáng" },
    },
    dialogues: {
      arrival: [
        { who: "tanuki", text: { en: "(The forest grew darker overnight. The lanterns along the path have all gone out.)", ja: "（一晩で森は暗くなってしまった。道沿いのランタンはすべて消えている。）", vi: "(Khu rừng trở nên tối tăm chỉ sau một đêm. Những chiếc đèn lồng dọc đường đều đã tắt.)" } },
        { who: "mori", text: { en: "Hoo… the dark wind came while you slept. It stole the word for light, and every lantern forgot how to shine.", ja: "ホー……君が寝ている間に闇の風が来たんだ。光という言葉を奪われて、どのランタンも輝き方を忘れてしまった。", vi: "Hoo… cơn gió bóng tối đã đến khi con ngủ. Nó đánh cắp từ ngữ của ánh sáng, và mọi chiếc đèn lồng đều quên cách tỏa sáng." } },
        { who: "mori", text: { en: "The pieces 日 and 月 are buried in the mine. Sun and moon together — that word is bright enough to wake the lamps!", ja: "日と月の破片が鉱山に埋まっているんだ。太陽と月が一緒になれば——その言葉はランタンを目覚めさせるほど明るい！", vi: "Hai mảnh 日 và 月 đang bị chôn trong mỏ. Mặt trời và mặt trăng cùng nhau — từ đó đủ sáng để đánh thức những chiếc đèn!" } },
        { who: "tanuki", text: { en: "(Tanuki nods bravely and grips its bento box.)", ja: "（タヌキは勇敢にうなずき、弁当箱をぎゅっと握る。）", vi: "(Tanuki dũng cảm gật đầu và siết chặt chiếc hộp bento.)" } },
      ],
      mine: [{ who: "mori", text: { en: "Two new glowing rocks appeared in the mine. The sun piece and the moon piece are waiting inside.", ja: "鉱山に新しい光る岩が二つ現れたよ。中では太陽の破片と月の破片が待っている。", vi: "Hai tảng đá phát sáng mới đã xuất hiện trong mổ. Mảnh mặt trời và mảnh mặt trăng đang chờ bên trong." } }],
      shrine: [
        { who: "mori", text: { en: "日 is the sun, and 月 is the moon. Put them side by side and think of a sky that holds both at once.", ja: "日は太陽、月は月だよ。二つを並べて、両方が同時に見える空を想像してみて。", vi: "日 là mặt trời, 月 là mặt trăng. Đặt chúng cạnh nhau và nghĩ về bầu trời ôm cả hai cùng lúc." } },
        { who: "mori", text: { en: "The Picture Shrine will show you the memory. Hurry — the lanterns are counting on you!", ja: "絵神社がその記憶を見せてくれるよ。急いで——ランタンたちが君を待っている！", vi: "Miếu Tranh sẽ cho con thấy ký ức đó. Mau lên — những chiếc đèn lồng đang trông cậy vào con!" } },
      ],
      bento: [{ who: "mori", text: { en: "Into the Bento Box! Sun on the left, moon on the right — a little sky for lunch.", ja: "弁当箱に入れて！左に太陽、右に月——お昼の小さな空だね。", vi: "Cho vào Hộp Bento! Mặt trời bên trái, mặt trăng bên phải — một khoảng trời nhỏ cho bữa trưa." } }],
      write: [
        { who: "mori", text: { en: "明 — sun and moon shining together. Say it softly: mei.", ja: "明——太陽と月が一緒に輝いている。そっと言ってみて：めい。", vi: "明 — mặt trời và mặt trăng cùng tỏa sáng. Hãy nói khẽ: mei." } },
        { who: "mori", text: { en: "Once your hand learns it, the lanterns will remember too. The Calligraphy Desk is ready.", ja: "手が覚えたら、ランタンたちも思い出すよ。書道机の準備はできている。", vi: "Một khi đôi tay học được nó, những chiếc đèn lồng cũng sẽ nhớ. Bàn Thư Pháp đã sẵn sàng." } },
      ],
      restore: [
        { who: "mori", text: { en: "What lovely strokes! Now watch the path…", ja: "なんて美しい線なんだ！さあ、道を見ていてごらん……", vi: "Những nét bút đáng yêu làm sao! Giờ hãy nhìn con đường…" } },
        { who: "mori", text: { en: "The lanterns flicker, then blaze — 明 shines all the way to the valley. You've reached Level 2!", ja: "ランタンが揺らめき、そして燃え上がる——明の光が谷まで届いたよ。レベル2到達だ！", vi: "Những chiếc đèn lồng lung lay rồi bùng cháy — 明 soi sáng tận thung lũng. Con đã đạt Cấp 2!" } },
      ],
      done: [{ who: "mori", text: { en: "The forest is bright again. Rest by the lamps, and I'll teach you more words whenever you like.", ja: "森は再び明るくなった。ランタンのそばで休んで、いつでも好きなときに言葉を教えてあげるよ。", vi: "Khu rừng lại sáng rực. Hãy nghỉ ngơi bên những ngọn đèn, và ta sẽ dạy con thêm nhiều từ bất cứ khi nào con muốn." } }],
    },
  },
  {
    id: "gan",
    num: 3,
    title: { en: "The Rocky Path", ja: "岩の道", vi: "Con Đường Đá" },
    digChars: ["山", "石"],
    shrineOptions: ["山", "石", "土", "木"],
    scene: "rock",
    kanji: {
      char: "岩",
      meaning: { en: "Rock / Cliff", ja: "岩", vi: "Đá / Vách đá" },
      on: "ガン (gan)",
      kun: "いわ (iwa)",
      strokes: 8,
      parts: ["山", "石"],
      story: {
        en: "A mountain (山) standing on stone (石) — a great rocky cliff.",
        ja: "石の上に立つ山——大きな岩壁。",
        vi: "Một ngọn núi (山) đứng trên đá (石) — một vách đá lớn.",
      },
      vocab: [
        { jp: "岩", kana: "いわ", en: { en: "rock / boulder", ja: "岩", vi: "đá / tảng đá" } },
        { jp: "岩石", kana: "がんせき", en: { en: "rock / stone", ja: "岩石", vi: "đá" } },
        { jp: "岩場", kana: "いわば", en: { en: "rocky area", ja: "岩場", vi: "khu vực nhiều đá" } },
      ],
    },
    strokes: [
      "M20 30 L20 78",
      "M20 22 L50 78 L50 22",
      "M50 22 L80 78 L80 30",
      "M30 18 L72 18",
      "M48 18 L48 80",
      "M40 45 L85 45",
      "M40 45 L40 82 L85 82",
      "M85 45 L85 82",
    ],
    objectives: {
      arrival: { en: "Talk to Mori by the Great Kanji Tree", ja: "大漢字の木のそばでモリと話す", vi: "Trò chuyện với Mori bên Cây Kanji Vĩ Đại" },
      mine: { en: "Dig the glowing rocks in the Radical Mine", ja: "部首鉱山で光る岩を掘る", vi: "Đào những tảng đá phát sáng trong Mỏ Bộ Thủ" },
      shrine: { en: "Visit the Picture Shrine", ja: "絵神社を訪れる", vi: "Ghé thăm Miếu Tranh" },
      bento: { en: "Build the Kanji at the Bento Table", ja: "弁当台で漢字を作る", vi: "Ghép chữ Kanji tại Bàn Bento" },
      write: { en: "Practice writing at the Calligraphy Desk", ja: "書道机で書き方を練習する", vi: "Tập viết tại Bàn Thư Pháp" },
      restore: { en: "Return to Mori", ja: "モリのもとへ戻る", vi: "Quay lại chỗ Mori" },
      done: { en: "Chapter complete! The mountain path is open", ja: "章クリア！山道が開けた", vi: "Hoàn thành chương! Con đường núi đã mở" },
    },
    dialogues: {
      arrival: [
        { who: "tanuki", text: { en: "(A rumble shakes the forest. Big boulders have rolled across the mountain path.)", ja: "（ゴロゴロと森が揺れる。大きな岩が山道に転がってふさいでいる。）", vi: "(Một tiếng ầm ầm làm rung chuyển khu rừng. Những tảng đá lớn đã lăn xuống chặn con đường núi.)" } },
        { who: "mori", text: { en: "Hoo! The mountain is restless. It has swallowed the word for rock, and now the path is blocked.", ja: "ホー！山が落ち着かないんだ。岩という言葉を飲み込まれて、今は道がふさがれている。", vi: "Hoo! Ngọn núi đang bất an. Nó đã nuốt chửng từ ngữ của đá, và giờ con đường bị chặn." } },
        { who: "mori", text: { en: "The pieces 山 and 石 fell into the mine. Mountain upon stone — that word is strong enough to move boulders!", ja: "山と石の破片が鉱山に落ちたんだ。山の上に石——その言葉は巨岩を動かせるほど強い！", vi: "Hai mảnh 山 và 石 đã rơi vào mỏ. Núi chồng lên đá — từ đó đủ mạnh để dịch chuyển những tảng đá!" } },
        { who: "tanuki", text: { en: "(Tanuki cracks its knuckles and marches toward the mine.)", ja: "（タヌキは指をポキポキ鳴らし、鉱山へ向かって進む。）", vi: "(Tanuki bẻ khớp ngón tay và hành quân về phía mỏ.)" } },
      ],
      mine: [{ who: "mori", text: { en: "The heaviest rocks in the mine hold the pieces. Give them your strongest whacks!", ja: "鉱山で一番重い岩が破片を持っているよ。一番強い一撃をお見舞いして！", vi: "Những tảng đá nặng nhất trong mỏ đang giữ các mảnh. Hãy tung những cú đập mạnh nhất!" } }],
      shrine: [
        { who: "mori", text: { en: "山 is a mountain, and 石 is a stone. Imagine a mountain rooted in solid rock.", ja: "山は山、石は石だよ。しっかりとした岩に根を張った山を想像してみて。", vi: "山 là ngọn núi, 石 là hòn đá. Hãy tưởng tượng một ngọn núi bám rễ trên nền đá vững chắc." } },
        { who: "mori", text: { en: "The Picture Shrine remembers it. Go see — then we'll build the word.", ja: "絵神社がそれを覚えているよ。見に行ってごらん——それから言葉を作ろう。", vi: "Miếu Tranh nhớ điều đó. Hãy đi xem — rồi chúng ta sẽ ghép từ." } },
      ],
      bento: [{ who: "mori", text: { en: "Bento time! Mountain on the left, stone on the right. Sturdy and delicious.", ja: "弁当の時間だ！左に山、右に石。丈夫でおいしいね。", vi: "Đến giờ bento! Núi bên trái, đá bên phải. Vững chãi và ngon lành." } }],
      write: [
        { who: "mori", text: { en: "岩 — a mountain of stone. Strong word! Say it: gan.", ja: "岩——石の山だ。強い言葉だね！言ってみて：がん。", vi: "岩 — một ngọn núi bằng đá. Từ mạnh mẽ! Hãy nói: gan." } },
        { who: "mori", text: { en: "Write it at the Calligraphy Desk and the boulders will listen.", ja: "書道机で書けば、巨岩たちも言うことを聞くよ。", vi: "Hãy viết nó tại Bàn Thư Pháp và những tảng đá sẽ lắng nghe." } },
      ],
      restore: [
        { who: "mori", text: { en: "Magnificent! Watch the mountain…", ja: "素晴らしい！山を見ていてごらん……", vi: "Tuyệt vời! Hãy nhìn ngọn núi…" } },
        { who: "mori", text: { en: "The boulders roll aside, and the path gleams — 岩 carved into the cliff. You've reached Level 3!", ja: "巨岩が脇へ転がり、道が輝く——崖に刻まれた岩の文字。レベル3到達だ！", vi: "Những tảng đá lăn sang một bên, con đường lấp lánh — 岩 khắc trên vách đá. Con đã đạt Cấp 3!" } },
      ],
      done: [{ who: "mori", text: { en: "The whole forest is awake now: rest, light, and stone. Come visit my catalog whenever you wish, little one.", ja: "森全体が目を覚ましたね：休み、光、そして石。いつでもカタログを見においで、小さい子よ。", vi: "Cả khu rừng giờ đã thức giấc: nghỉ ngơi, ánh sáng, và đá. Hãy ghé thăm danh mục của ta bất cứ khi nào con muốn, bé nhỏ à." } }],
    },
  },
];

export const RADICALS: Record<string, { name: string; meaning: Localized<string> }> = {
  "亻": { name: "にんべん", meaning: { en: "person (side)", ja: "人（にんべん）", vi: "người (đứng nghiêng)" } },
  "木": { name: "き", meaning: { en: "tree / wood", ja: "木", vi: "cây / gỗ" } },
  "口": { name: "くち", meaning: { en: "mouth", ja: "口", vi: "miệng" } },
  "水": { name: "みず", meaning: { en: "water", ja: "水", vi: "nước" } },
  "日": { name: "ひ", meaning: { en: "sun / day", ja: "日", vi: "mặt trời / ngày" } },
  "月": { name: "つき", meaning: { en: "moon / month", ja: "月", vi: "mặt trăng / tháng" } },
  "火": { name: "ひ", meaning: { en: "fire", ja: "火", vi: "lửa" } },
  "山": { name: "やま", meaning: { en: "mountain", ja: "山", vi: "núi" } },
  "石": { name: "いし", meaning: { en: "stone", ja: "石", vi: "đá" } },
  "土": { name: "つち", meaning: { en: "earth / soil", ja: "土", vi: "đất" } },
};

export const CATALOG = [
  {
    level: 1,
    title: { en: "Taking a break", ja: "ひと休みしよう", vi: "Nghỉ giải lao" },
    lines: [
      { who: "Mori", jp: "ちょっと休みましょう。", romaji: "Chotto yasumimashō.", en: { en: "Let's rest a little.", ja: "ちょっと休みましょう。", vi: "Chúng ta nghỉ một chút nhé." } },
      { who: "Tanuki", jp: "はい、休みます！", romaji: "Hai, yasumimasu!", en: { en: "Okay, I'll rest!", ja: "はい、休みます！", vi: "Vâng, tôi sẽ nghỉ!" } },
    ],
  },
  {
    level: 1,
    title: { en: "Day off", ja: "休日", vi: "Ngày nghỉ" },
    lines: [
      { who: "Mori", jp: "明日は休日ですか。", romaji: "Ashita wa kyūjitsu desu ka.", en: { en: "Is tomorrow a day off?", ja: "明日は休日ですか。", vi: "Ngày mai có phải là ngày nghỉ không?" } },
      { who: "Tanuki", jp: "はい、休日です。", romaji: "Hai, kyūjitsu desu.", en: { en: "Yes, it's a day off.", ja: "はい、休日です。", vi: "Vâng, là ngày nghỉ." } },
    ],
  },
  {
    level: 1,
    title: { en: "Good night", ja: "おやすみ", vi: "Chúc ngủ ngon" },
    lines: [
      { who: "Mori", jp: "お休みなさい。", romaji: "Oyasumi nasai.", en: { en: "Good night (rest well).", ja: "お休みなさい。", vi: "Chúc ngủ ngon (nghỉ ngơi tốt)." } },
      { who: "Tanuki", jp: "お休み〜！", romaji: "Oyasumi~!", en: { en: "Night night!", ja: "お休み〜！", vi: "Ngủ ngon nhé!" } },
    ],
  },
  {
    level: 2,
    title: { en: "Bright morning (明)", ja: "明るい朝（明）", vi: "Buổi sáng tươi sáng (明)" },
    lines: [
      { who: "Mori", jp: "今日は明るいですね。", romaji: "Kyō wa akarui desu ne.", en: { en: "It's bright today, isn't it?", ja: "今日は明るいですね。", vi: "Hôm nay trời sáng nhỉ?" } },
      { who: "Tanuki", jp: "明日も明るいといいな。", romaji: "Ashita mo akarui to ii na.", en: { en: "I hope tomorrow is bright too.", ja: "明日も明るいといいな。", vi: "Mong ngày mai cũng sáng." } },
    ],
  },
  {
    level: 3,
    title: { en: "On the rocks (岩)", ja: "岩の上で（岩）", vi: "Trên tảng đá (岩)" },
    lines: [
      { who: "Mori", jp: "岩の上で休みましょう。", romaji: "Iwa no ue de yasumimashō.", en: { en: "Let's rest on the rock.", ja: "岩の上で休みましょう。", vi: "Chúng ta hãy nghỉ trên tảng đá." } },
      { who: "Tanuki", jp: "この岩は大きいですね。", romaji: "Kono iwa wa ōkii desu ne.", en: { en: "This rock is big, isn't it?", ja: "この岩は大きいですね。", vi: "Tảng đá này to nhỉ?" } },
    ],
  },
];

export const WORLD = { w: 1920, h: 1088 };

export type StationId = "mori" | "rock1" | "rock2" | "shrine" | "bento" | "desk" | "sign";

export const STATIONS: Record<StationId, { x: number; y: number; r: number; label: Localized<string> }> = {
  mori: { x: 1190, y: 330, r: 110, label: { en: "Talk", ja: "話す", vi: "Nói chuyện" } },
  rock1: { x: 560, y: 470, r: 100, label: { en: "Dig", ja: "掘る", vi: "Đào" } },
  rock2: { x: 640, y: 680, r: 100, label: { en: "Dig", ja: "掘る", vi: "Đào" } },
  shrine: { x: 1400, y: 690, r: 120, label: { en: "Inspect", ja: "調べる", vi: "Kiểm tra" } },
  bento: { x: 980, y: 860, r: 120, label: { en: "Build", ja: "作る", vi: "Ghép" } },
  desk: { x: 1520, y: 430, r: 110, label: { en: "Write", ja: "書く", vi: "Viết" } },
  sign: { x: 760, y: 360, r: 90, label: { en: "Read", ja: "読む", vi: "Đọc" } },
};

// Simple circle obstacles (x, y, radius)
export const OBSTACLES: [number, number, number][] = [
  [960, 210, 120],
  [1190, 300, 40],
  [560, 450, 55],
  [640, 660, 55],
  [1400, 650, 70],
  [980, 830, 70],
  [1520, 410, 60],
];

export const BOUNDS = { minX: 380, maxX: 1640, minY: 170, maxY: 960 };