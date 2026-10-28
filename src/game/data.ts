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

export type Line = { who: "mori" | "tanuki"; text: Localized<string>; kana?: string };

export type Chapter = {
  id: string;
  num: number;
  title: Localized<string>;
  /** The two radical pieces dug from rock1 / rock2, in order. */
  digChars: [string, string];
  /** Four shrine options: the two correct pieces plus two decoys. */
  shrineOptions: string[];
  /** Visual scene the Picture Shrine shows for this chapter. */
  scene: "rest" | "bright" | "rock" | "time" | "field" | "snow";
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
<<<<<<< Updated upstream
arrival: [
        { who: "tanuki", text: { en: "...? (Tanuki stares at the sign. The squiggles mean nothing yet.)", ja: "……？（タヌキが看板をじっと見ている。まだ何も読めない。）", vi: "...? (Tanuki nhìn chằm chằm tấm biển. Những nét nguệch ngoạc chẳng có nghĩa gì cả.)" }, kana: "……？（タヌキがかんばんをじっとみている。まだなにもよめない。）" },
        { who: "mori", text: { en: "Hoo-hoo! A traveler! Welcome to Kotoba Forest. I'm Mori, keeper of the Great Kanji Tree.", ja: "ホーホー！旅人だね！ことばの森へようこそ。私は大漢字の木の番人、モリだよ。", vi: "Hoo-hoo! Một lữ khách! Chào mừng đến Rừng Kotoba. Ta là Mori, người trông giữ Cây Kanji Vĩ Đại." }, kana: "ホーホー！たびびとだね！ことばのもりへようこそ。わたしはだいかんじのきのばんにん、モリだよ。" },
        { who: "mori", text: { en: "A strange wind blew through and every word in the forest broke into pieces. Signs went blank, memories sealed shut.", ja: "不思議な風が吹いて、森の言葉が全部バラバラになってしまったんだ。看板は真っ白になり、記憶は閉ざされてしまった。", vi: "Một cơn gió lạ thổi qua và mọi từ ngữ trong khu rừng vỡ thành từng mảnh. Biển hiệu trở nên trống rỗng, ký ức bị phong ấn." }, kana: "ふしぎなかぜがふいて、もりのことばがぜんぶバラバラになってしまったんだ。かんばんはまっしろになり、きおくはとざされてしまった。" },
        { who: "mori", text: { en: "But those pieces — radicals — are hidden inside the glowing rocks to the west. Dig them up!", ja: "でもその破片——部首——は西の光る岩の中に隠れているんだ。掘り出してくれ！", vi: "Nhưng những mảnh đó — bộ thủ — đang ẩn bên trong những tảng đá phát sáng ở phía tây. Hãy đào chúng lên!" }, kana: "でもそのはへん——ぶしゅ——はにしのひかるいわのなかにかくれているんだ。ほりだしてくれ！" },
        { who: "tanuki", text: { en: "(Tanuki pats its little bento box with determination.)", ja: "（タヌキは小さな弁当箱を力強くトントンと叩く。）", vi: "(Tanuki quyết tâm vỗ nhẹ chiếc hộp bento nhỏ của mình.)" }, kana: "（タヌキはちいさなべんとうばこをちからづよくトントンとたたく。）" },
      ],
      mine: [{ who: "mori", text: { en: "The glowing rocks are in the Radical Mine, west of here. Give them a few good whacks!", ja: "光る岩はここから西の部首鉱山にあるよ。しっかり叩いてみて！", vi: "Những tảng đá phát sáng nằm trong Mỏ Bộ Thủ, phía tây đây. Hãy đập chúng vài cú thật mạnh!" }, kana: "ひかるいわはここからにしのぶしゅこうざんにあるよ。しっかりたたいてみて！" }],
      shrine: [
        { who: "mori", text: { en: "Two pieces! 亻 is a person standing sideways, and 木 is a tree.", ja: "破片が二つ！亻は横向きに立っている人、木は木だよ。", vi: "Hai mảnh! 亻 là một người đứng nghiêng, còn 木 là cái cây." }, kana: "はへんがふたつ！にんべんはよこむきにたっているひと、きはきだよ。" },
        { who: "mori", text: { en: "Kanji are built from pieces like these. Take them to the Picture Shrine — it remembers what they mean together.", ja: "漢字はこういう部品からできているんだ。絵神社に持っていくと、一緒になるとどんな意味になるか思い出してくれるよ。", vi: "Kanji được tạo nên từ những bộ phận như thế này. Hãy mang chúng đến Miếu Tranh — nó sẽ nhớ ý nghĩa khi chúng đứng cùng nhau." }, kana: "かんじはこういうぶひんからできているんだ。えじんじゃにもっていくと、いっしょになるとどんないみになるかおもいだしてくれるよ。" },
      ],
      bento: [{ who: "mori", text: { en: "Now pop those pieces into your Bento Box at the table. Left and right, like a little lunch!", ja: "さあ、その破片をテーブルの弁当箱に入れてごらん。左右に並べて、まるで小さなお弁当みたいに！", vi: "Giờ hãy đặt những mảnh đó vào Hộp Bento trên bàn. Trái và phải, như một bữa trưa nhỏ!" }, kana: "さあ、そのはへんをテーブルのべんとうばこにいれてごらん。さゆうにならべて、まるでちいさなおべんとうみたいに！" }],
      write: [
        { who: "mori", text: { en: "休 — a person resting by a tree. Look, the forest is already listening to you!", ja: "休——木のそばで休んでいる人だよ。ほら、森がもう君の声を聞いている！", vi: "休 — một người đang nghỉ ngơi bên gốc cây. Nhìn kìa, khu rừng đang lắng nghe bạn đấy!" }, kana: "やす——きのそばでやすんでいるひとだよ。ほら、もりがもうきみのこえをきいている！" },
        { who: "mori", text: { en: "A word stays with you once your hand remembers it. The Calligraphy Desk is open now.", ja: "手が覚えると、言葉はずっと君のものになるんだ。書道机がもう使えるよ。", vi: "Một từ sẽ ở lại với bạn một khi đôi tay ghi nhớ nó. Bàn Thư Pháp giờ đã mở." }, kana: "てがおぼえると、ことばはずっときみのものになるんだ。しょどうづくえがもうつかえるよ。" },
      ],
      restore: [
        { who: "mori", text: { en: "Beautiful brushwork! Watch the tree…", ja: "見事な筆さばきだ！木を見ていてごらん……", vi: "Nét bút tuyệt đẹp! Hãy nhìn cái cây…" }, kana: "みごとなふでさばきだ！きをみていてごらん……" },
        { who: "mori", text: { en: "A resting place has returned beneath the branches, and the old sign reads 休 again.", ja: "枝の下に休む場所が戻ってきた。古い看板にはまた「休」と書かれている。", vi: "Một nơi nghỉ ngơi đã trở lại dưới tán cây, và tấm biển cũ lại đọc được chữ 休." }, kana: "えだのしたにやすむばしょがもどってきた。ふるいかんばんにはまた「やす」とかかれている。" },
        { who: "mori", text: { en: "You've reached Level 1, little one. Now I can teach you some real conversations. Come see my catalog anytime!", ja: "レベル1到達だね、小さい子よ。これから本当の会話を教えてあげられるよ。いつでも私のカタログを見においで！", vi: "Con đã đạt Cấp 1 rồi, bé nhỏ à. Giờ ta có thể dạy con vài cuộc hội thoại thực sự. Hãy ghé xem danh mục của ta bất cứ khi nào con muốn!" }, kana: "レベル1とうたつだね、ちいさいこよ。これからほんとうのかいわをおしえてあげられるよ。いつでもわたしのカタログをみにおいで！" },
      ],
      done: [{ who: "mori", text: { en: "Rest a while! When you're ready, I'll share phrases from my Conversation Catalog.", ja: "少し休んでいいよ！準備ができたら、会話カタログからフレーズを教えてあげるね。", vi: "Hãy nghỉ ngơi một lát! Khi sẵn sàng, ta sẽ chia sẻ những câu hội thoại từ Danh Mục của mình." }, kana: "すこしやすんでいいよ！じゅんびができたら、かいわカタログからフレーズをおしえてあげるね。" }],
=======
      arrival: [
        { who: "tanuki", text: { en: "...? (Tanuki stares at the sign. The squiggles mean nothing yet.)", ja: "……？（タヌキが看板をじっと見ている。まだ何も読めない。）", vi: "...? (Tanuki nhìn chằm chằm tấm biển. Những nét nguệch ngoạc chẳng có nghĩa gì cả.)"}, kana: "……？（タヌキがかんばんをじっとみている。まだなにもよめない。）" },
        { who: "mori", text: { en: "Hoo-hoo! A traveler! Welcome to Kotoba Forest. I'm Mori, keeper of the Great Kanji Tree.", ja: "ホーホー！旅人だね！ことばの森へようこそ。私は大漢字の木の番人、モリだよ。", vi: "Hoo-hoo! Một lữ khách! Chào mừng đến Rừng Kotoba. Ta là Mori, người trông giữ Cây Kanji Vĩ Đại."}, kana: "ホーホー！たびびとだね！ことばのもりへようこそ。わたしはだいかんじのきのばんにん、モリだよ。" },
        { who: "mori", text: { en: "A strange wind blew through and every word in the forest broke into pieces. Signs went blank, memories sealed shut.", ja: "不思議な風が吹いて、森の言葉が全部バラバラになってしまったんだ。看板は真っ白になり、記憶は閉ざされてしまった。", vi: "Một cơn gió lạ thổi qua và mọi từ ngữ trong khu rừng vỡ thành từng mảnh. Biển hiệu trở nên trống rỗng, ký ức bị phong ấn."}, kana: "ふしぎなかぜがふいて、もりのことばがぜんぶバラバラになってしまったんだ。かんばんはまっしろになり、きおくはとざされてしまった。" },
        { who: "mori", text: { en: "But those pieces — radicals — are hidden inside the glowing rocks to the west. Dig them up!", ja: "でもその破片——部首——は西の光る岩の中に隠れているんだ。掘り出してくれ！", vi: "Nhưng những mảnh đó — bộ thủ — đang ẩn bên trong những tảng đá phát sáng ở phía tây. Hãy đào chúng lên!"}, kana: "でもそのはへん——ぶしゅ——はにしのひかるいわのなかにかくれているんだ。ほりだしてくれ！" },
        { who: "tanuki", text: { en: "(Tanuki pats its little bento box with determination.)", ja: "（タヌキは小さな弁当箱を力強くトントンと叩く。）", vi: "(Tanuki quyết tâm vỗ nhẹ chiếc hộp bento nhỏ của mình.)"}, kana: "（タヌキはちいさなべんとうばこをちからづよくトントンとたたく。）" },
      ],
      mine: [{ who: "mori", text: { en: "The glowing rocks are in the Radical Mine, west of here. Give them a few good whacks!", ja: "光る岩はここから西の部首鉱山にあるよ。しっかり叩いてみて！", vi: "Những tảng đá phát sáng nằm trong Mỏ Bộ Thủ, phía tây đây. Hãy đập chúng vài cú thật mạnh!"}, kana: "ひかるいわはここからにしのぶしゅこうざんにあるよ。しっかりたたいてみて！" }],
      shrine: [
        { who: "mori", text: { en: "Two pieces! 亻 is a person standing sideways, and 木 is a tree.", ja: "破片が二つ！亻は横向きに立っている人、木は木だよ。", vi: "Hai mảnh! 亻 là một người đứng nghiêng, còn 木 là cái cây."}, kana: "はへんがふたつ！にんべんはよこむきにたっているひと、きはきだよ。" },
        { who: "mori", text: { en: "Kanji are built from pieces like these. Take them to the Picture Shrine — it remembers what they mean together.", ja: "漢字はこういう部品からできているんだ。絵神社に持っていくと、一緒になるとどんな意味になるか思い出してくれるよ。", vi: "Kanji được tạo nên từ những bộ phận như thế này. Hãy mang chúng đến Miếu Tranh — nó sẽ nhớ ý nghĩa khi chúng đứng cùng nhau."}, kana: "かんじはこういうぶひんからできているんだ。えじんじゃにもっていくと、いっしょになるとどんないみになるかおもいだしてくれるよ。" },
      ],
      bento: [{ who: "mori", text: { en: "Now pop those pieces into your Bento Box at the table. Left and right, like a little lunch!", ja: "さあ、その破片をテーブルの弁当箱に入れてごらん。左右に並べて、まるで小さなお弁当みたいに！", vi: "Giờ hãy đặt những mảnh đó vào Hộp Bento trên bàn. Trái và phải, như một bữa trưa nhỏ!"}, kana: "さあ、そのはへんをテーブルのべんとうばこにいれてごらん。さゆうにならべて、まるでちいさなおべんとうみたいに！" }],
      write: [
        { who: "mori", text: { en: "休 — a person resting by a tree. Look, the forest is already listening to you!", ja: "休——木のそばで休んでいる人だよ。ほら、森がもう君の声を聞いている！", vi: "休 — một người đang nghỉ ngơi bên gốc cây. Nhìn kìa, khu rừng đang lắng nghe bạn đấy!"}, kana: "やす——きのそばでやすんでいるひとだよ。ほら、もりがもうきみのこえをきいている！" },
        { who: "mori", text: { en: "A word stays with you once your hand remembers it. The Calligraphy Desk is open now.", ja: "手が覚えると、言葉はずっと君のものになるんだ。書道机がもう使えるよ。", vi: "Một từ sẽ ở lại với bạn một khi đôi tay ghi nhớ nó. Bàn Thư Pháp giờ đã mở."}, kana: "てがおぼえると、ことばはずっときみのものになるんだ。しょどうづくえがもうつかえるよ。" },
      ],
      restore: [
        { who: "mori", text: { en: "Beautiful brushwork! Watch the tree…", ja: "見事な筆さばきだ！木を見ていてごらん……", vi: "Nét bút tuyệt đẹp! Hãy nhìn cái cây…"}, kana: "みごとなふでさばきだ！きをみていてごらん……" },
        { who: "mori", text: { en: "A resting place has returned beneath the branches, and the old sign reads 休 again.", ja: "枝の下に休む場所が戻ってきた。古い看板にはまた「休」と書かれている。", vi: "Một nơi nghỉ ngơi đã trở lại dưới tán cây, và tấm biển cũ lại đọc được chữ 休."}, kana: "えだのしたにやすむばしょがもどってきた。ふるいかんばんにはまた「やす」とかかれている。" },
        { who: "mori", text: { en: "You've reached Level 1, little one. Now I can teach you some real conversations. Come see my catalog anytime!", ja: "レベル1到達だね、小さい子よ。これから本当の会話を教えてあげられるよ。いつでも私のカタログを見においで！", vi: "Con đã đạt Cấp 1 rồi, bé nhỏ à. Giờ ta có thể dạy con vài cuộc hội thoại thực sự. Hãy ghé xem danh mục của ta bất cứ lúc nào!"}, kana: "レベル1とうたつだね、ちいさいこよ。これからほんとうのかいわをおしえてあげられるよ。いつでもわたしのカタログをみにおいで！" },
      ],
      done: [{ who: "mori", text: { en: "Rest a while! When you're ready, I'll share phrases from my Conversation Catalog.", ja: "少し休んでいいよ！準備ができたら、会話カタログからフレーズを教えてあげるね。", vi: "Hãy nghỉ ngơi một lát! Khi sẵn sàng, ta sẽ chia sẻ những câu hội thoại từ Danh Mục của mình."}, kana: "すこしやすんでいいよ！じゅんびができたら、かいわカタログからフレーズをおしえてあげるね。" }],
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        { who: "tanuki", text: { en: "(The forest grew darker overnight. The lanterns along the path have all gone out.)", ja: "（一晩で森は暗くなってしまった。道沿いのランタンはすべて消えている。）", vi: "(Khu rừng trở nên tối tăm chỉ sau một đêm. Những chiếc đèn lồng dọc đường đều đã tắt.)" }, kana: "（ひとばんでもりはくらくなってしまった。みちぞいのランタンはすべてきえている。）" },
        { who: "mori", text: { en: "Hoo… the dark wind came while you slept. It stole the word for light, and every lantern forgot how to shine.", ja: "ホー……君が寝ている間に闇の風が来たんだ。光という言葉を奪われて、どのランタンも輝き方を忘れてしまった。", vi: "Hoo… cơn gió bóng tối đã đến khi con ngủ. Nó đánh cắp từ ngữ của ánh sáng, và mọi chiếc đèn lồng đều quên cách tỏa sáng." }, kana: "ホー……きみがねているあいだにやみのかぜがきたんだ。ひかりということばをうばわわれて、どのランタンもかがやきかたをわすれてしまった。" },
        { who: "mori", text: { en: "The pieces 日 and 月 are buried in the mine. Sun and moon together — that word is bright enough to wake the lamps!", ja: "日と月の破片が鉱山に埋まっているんだ。太陽と月が一緒になれば——その言葉はランタンを目覚めさせるほど明るい！", vi: "Hai mảnh 日 và 月 đang bị chôn trong mỏ. Mặt trời và mặt trăng cùng nhau — từ đó đủ sáng để đánh thức những chiếc đèn!" }, kana: "ひとつきのはへんがこうざんにうまっているんだ。たいようとつきがいっしょになれば——そのことばはランタンをめざめさせるほどあかるい！" },
        { who: "tanuki", text: { en: "(Tanuki nods bravely and grips its bento box.)", ja: "（タヌキは勇敢にうなずき、弁当箱をぎゅっと握る。）", vi: "(Tanuki dũng cảm gật đầu và siết chặt chiếc hộp bento.)" }, kana: "（タヌキはゆうかんにうなずき、べんとうばこをぎゅっとにぎる。）" },
      ],
      mine: [{ who: "mori", text: { en: "Two new glowing rocks appeared in the mine. The sun piece and the moon piece are waiting inside.", ja: "鉱山に新しい光る岩が二つ現れたよ。中では太陽の破片と月の破片が待っている。", vi: "Hai tảng đá phát sáng mới đã xuất hiện trong mổ. Mảnh mặt trời và mảnh mặt trăng đang chờ bên trong." }, kana: "こうざんにあたらしいひかるいわがふたつあらわれたよ。なかではたいようのはへんとつきのはへんがまっている。" }],
      shrine: [
        { who: "mori", text: { en: "日 is the sun, and 月 is the moon. Put them side by side and think of a sky that holds both at once.", ja: "日は太陽、月は月だよ。二つを並べて、両方が同時に見える空を想像してみて。", vi: "日 là mặt trời, 月 là mặt trăng. Đặt chúng cạnh nhau và nghĩ về bầu trời ôm cả hai cùng lúc." }, kana: "ひはたいよう、つきはつきだよ。ふたつをならべて、りょうほうがどうじにみえるそらをそうぞうしてみて。" },
        { who: "mori", text: { en: "The Picture Shrine will show you the memory. Hurry — the lanterns are counting on you!", ja: "絵神社がその記憶を見せてくれるよ。急いで——ランタンたちが君を待っている！", vi: "Miếu Tranh sẽ cho con thấy ký ức đó. Mau lên — những chiếc đèn lồng đang trông cậy vào con!" }, kana: "えじんじゃがそのきおくをみせてくれるよ。いそいで——ランタンたちがきみをまっている！" },
      ],
      bento: [{ who: "mori", text: { en: "Into the Bento Box! Sun on the left, moon on the right — a little sky for lunch.", ja: "弁当箱に入れて！左に太陽、右に月——お昼の小さな空だね。", vi: "Cho vào Hộp Bento! Mặt trời bên trái, mặt trăng bên phải — một khoảng trời nhỏ cho bữa trưa." }, kana: "べんとうばこにいれて！ひだりにたいよう、みぎにつき——おひるのちいさなそらだね。" }],
      write: [
        { who: "mori", text: { en: "明 — sun and moon shining together. Say it softly: mei.", ja: "明——太陽と月が一緒に輝いている。そっと言ってみて：めい。", vi: "明 — mặt trời và mặt trăng cùng tỏa sáng. Hãy nói khẽ: mei." }, kana: "めい——たいようとつきがいっしょにかがやいている。そっといってみて：めい。" },
        { who: "mori", text: { en: "Once your hand learns it, the lanterns will remember too. The Calligraphy Desk is ready.", ja: "手が覚えたら、ランタンたちも思い出すよ。書道机の準備はできている。", vi: "Một khi đôi tay học được nó, những chiếc đèn lồng cũng sẽ nhớ. Bàn Thư Pháp đã sẵn sàng." }, kana: "てがおぼえたら、ランタンたちもおもいだすよ。しょどうづくえのじゅんびはできている。" },
      ],
      restore: [
        { who: "mori", text: { en: "What lovely strokes! Now watch the path…", ja: "なんて美しい線なんだ！さあ、道を見ていてごらん……", vi: "Những nét bút đáng yêu làm sao! Giờ hãy nhìn con đường…" }, kana: "なんてうつくしいせんなんだ！さあ、みちをみていてごらん……" },
        { who: "mori", text: { en: "The lanterns flicker, then blaze — 明 shines all the way to the valley. You've reached Level 2!", ja: "ランタンが揺らめき、そして燃え上がる——明の光が谷まで届いたよ。レベル2到達だ！", vi: "Những chiếc đèn lồng lung lay rồi bùng cháy — 明 soi sáng tận thung lũng. Con đã đạt Cấp 2!" }, kana: "ランタンがゆらめき、そしてもえあがる——めいのひかりがたにまでとどいたよ。レベル2とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "The forest is bright again. Rest by the lamps, and I'll teach you more words whenever you like.", ja: "森は再び明るくなった。ランタンのそばで休んで、いつでも好きなときに言葉を教えてあげるよ。", vi: "Khu rừng lại sáng rực. Hãy nghỉ ngơi bên những ngọn đèn, và ta sẽ dạy con thêm nhiều từ bất cứ khi nào con muốn." }, kana: "もりはふたたびあかるくなった。ランタンのそばでやすんで、いつでもすきなときにことばをおしえてあげるよ。" }],
=======
        { who: "tanuki", text: { en: "(The forest grew darker overnight. The lanterns along the path have all gone out.)", ja: "（一晩で森は暗くなってしまった。道沿いのランタンはすべて消えている。）", vi: "(Khu rừng trở nên tối tăm chỉ sau một đêm. Những chiếc đèn lồng dọc đường đều đã tắt.)"}, kana: "（ひとばんでもりはくらくなってしまった。みちぞいのランタンはすべてきえている。）" },
        { who: "mori", text: { en: "Hoo… the dark wind came while you slept. It stole the word for light, and every lantern forgot how to shine.", ja: "ホー……君が寝ている間に闇の風が来たんだ。光という言葉を奪われて、どのランタンも輝き方を忘れてしまった。", vi: "Hoo… cơn gió bóng tối đã đến khi con ngủ. Nó đánh cắp từ ngữ của ánh sáng, và mọi chiếc đèn lồng đều quên cách tỏa sáng."}, kana: "ホー……きみがねているあいだにやみのかぜがきたんだ。ひかりということばをうばわわれて、どのランタンもかがやきかたをわすれてしまった。" },
        { who: "mori", text: { en: "The pieces 日 and 月 are buried in the mine. Sun and moon together — that word is bright enough to wake the lamps!", ja: "日と月の破片が鉱山に埋まっているんだ。太陽と月が一緒になれば——その言葉はランタンを目覚めさせるほど明るい！", vi: "Hai mảnh 日 và 月 đang bị chôn trong mỏ. Mặt trời và mặt trăng cùng nhau — từ đó đủ sáng để đánh thức những chiếc đèn!"}, kana: "ひとつきのはへんがこうざんにうまっているんだ。たいようとつきがいっしょになれば——そのことばはランタンをめざめさせるほどあかるい！" },
        { who: "tanuki", text: { en: "(Tanuki nods bravely and grips its bento box.)", ja: "（タヌキは勇敢にうなずき、弁当箱をぎゅっと握る。）", vi: "(Tanuki dũng cảm gật đầu và siết chặt chiếc hộp bento.)"}, kana: "（タヌキはゆうかんにうなずき、べんとうばこをぎゅっとにぎる。）" },
      ],
      mine: [{ who: "mori", text: { en: "Two new glowing rocks appeared in the mine. The sun piece and the moon piece are waiting inside.", ja: "鉱山に新しい光る岩が二つ現れたよ。中では太陽の破片と月の破片が待っている。", vi: "Hai tảng đá phát sáng mới đã xuất hiện trong mổ. Mảnh mặt trời và mảnh mặt trăng đang chờ bên trong."}, kana: "こうざんにあたらしいひかるいわがふたつあらわれたよ。なかではたいようのはへんとつきのはへんがまっている。" }],
      shrine: [
        { who: "mori", text: { en: "日 is the sun, and 月 is the moon. Put them side by side and think of a sky that holds both at once.", ja: "日は太陽、月は月だよ。二つを並べて、両方が同時に見える空を想像してみて。", vi: "日 là mặt trời, 月 là mặt trăng. Đặt chúng cạnh nhau và nghĩ về bầu trời ôm cả hai cùng lúc."}, kana: "ひはたいよう、つきはつきだよ。ふたつをならべて、りょうほうがどうじにみえるそらをそうぞうしてみて。" },
        { who: "mori", text: { en: "The Picture Shrine will show you the memory. Hurry — the lanterns are counting on you!", ja: "絵神社がその記憶を見せてくれるよ。急いで——ランタンたちが君を待っている！", vi: "Miếu Tranh sẽ cho con thấy ký ức đó. Mau lên — những chiếc đèn lồng đang trông cậy vào con!"}, kana: "えじんじゃがそのきおくをみせてくれるよ。いそいで——ランタンたちがきみをまっている！" },
      ],
      bento: [{ who: "mori", text: { en: "Into the Bento Box! Sun on the left, moon on the right — a little sky for lunch.", ja: "弁当箱に入れて！左に太陽、右に月——お昼の小さな空だね。", vi: "Cho vào Hộp Bento! Mặt trời bên trái, mặt trăng bên phải — một khoảng trời nhỏ cho bữa trưa."}, kana: "べんとうばこにいれて！ひだりにたいよう、みぎにつき——おひるのちいさなそらだね。" }],
      write: [
        { who: "mori", text: { en: "明 — sun and moon shining together. Say it softly: mei.", ja: "明——太陽と月が一緒に輝いている。そっと言ってみて：めい。", vi: "明 — mặt trời và mặt trăng cùng tỏa sáng. Hãy nói khẽ: mei."}, kana: "めい——たいようとつきがいっしょにかがやいている。そっといってみて：めい。" },
        { who: "mori", text: { en: "Once your hand learns it, the lanterns will remember too. The Calligraphy Desk is ready.", ja: "手が覚えたら、ランタンたちも思い出すよ。書道机の準備はできている。", vi: "Một khi đôi tay học được nó, những chiếc đèn lồng cũng sẽ nhớ. Bàn Thư Pháp đã sẵn sàng."}, kana: "てがおぼえたら、ランタンたちもおもいだすよ。しょどうづくえのじゅんびはできている。" },
      ],
      restore: [
        { who: "mori", text: { en: "What lovely strokes! Now watch the path…", ja: "なんて美しい線なんだ！さあ、道を見ていてごらん……", vi: "Những nét bút đáng yêu làm sao! Giờ hãy nhìn con đường…"}, kana: "なんてうつくしいせんなんだ！さあ、みちをみていてごらん……" },
        { who: "mori", text: { en: "The lanterns flicker, then blaze — 明 shines all the way to the valley. You've reached Level 2!", ja: "ランタンが揺らめき、そして燃え上がる——明の光が谷まで届いたよ。レベル2到達だ！", vi: "Những chiếc đèn lồng lung lay rồi bùng cháy — 明 soi sáng tận thung lũng. Con đã đạt Cấp 2!"}, kana: "ランタンがゆらめき、そしてもえあがる——めいのひかりがたにまでとどいたよ。レベル2とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "The forest is bright again. Rest by the lamps, and I'll teach you more words whenever you like.", ja: "森は再び明るくなった。ランタンのそばで休んで、いつでも好きなときに言葉を教えてあげるよ。", vi: "Khu rừng lại sáng rực. Hãy nghỉ ngơi bên những ngọn đèn, và ta sẽ dạy con thêm nhiều từ bất cứ khi nào con muốn."}, kana: "もりはふたたびあかるくなった。ランタンのそばでやすんで、いつでもすきなときにことばをおしえてあげるよ。" }],
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        { who: "tanuki", text: { en: "(A rumble shakes the forest. Big boulders have rolled across the mountain path.)", ja: "（ゴロゴロと森が揺れる。大きな岩が山道に転がってふさいでいる。）", vi: "(Một tiếng ầm ầm làm rung chuyển khu rừng. Những tảng đá lớn đã lăn xuống chặn con đường núi.)" }, kana: "（ゴロゴロともりがゆれる。おおきないわがやまみちにころがってふさいでいる。）" },
        { who: "mori", text: { en: "Hoo! The mountain is restless. It has swallowed the word for rock, and now the path is blocked.", ja: "ホー！山が落ち着かないんだ。岩という言葉を飲み込まれて、今は道がふさがれている。", vi: "Hoo! Ngọn núi đang bất an. Nó đã nuốt chửng từ ngữ của đá, và giờ con đường bị chặn." }, kana: "ホー！やまがおちつかないんだ。いわということばをのみこまれて、いまはみちがふさがれている。" },
        { who: "mori", text: { en: "The pieces 山 and 石 fell into the mine. Mountain upon stone — that word is strong enough to move boulders!", ja: "山と石の破片が鉱山に落ちたんだ。山の上に石——その言葉は巨岩を動かせるほど強い！", vi: "Hai mảnh 山 và 石 đã rơi vào mỏ. Núi chồng lên đá — từ đó đủ mạnh để dịch chuyển những tảng đá!" }, kana: "やまといしのはへんがこうざんにおちたんだ。やまのうえにいし——そのことばはきょがんをうごかせるほどつよい！" },
        { who: "tanuki", text: { en: "(Tanuki cracks its knuckles and marches toward the mine.)", ja: "（タヌキは指をポキポキ鳴らし、鉱山へ向かって進む。）", vi: "(Tanuki bẻ khớp ngón tay và hành quân về phía mỏ.)" }, kana: "（タヌキはゆびをポキポキならし、こうざんへむかってすすむ。）" },
      ],
      mine: [{ who: "mori", text: { en: "The heaviest rocks in the mine hold the pieces. Give them your strongest whacks!", ja: "鉱山で一番重い岩が破片を持っているよ。一番強い一撃をお見舞いして！", vi: "Những tảng đá nặng nhất trong mỏ đang giữ các mảnh. Hãy tung những cú đập mạnh nhất!" }, kana: "こうざんでいちばんおもいいわがはへんをもっているよ。いちばんつよいいちげきをおみまいして！" }],
      shrine: [
        { who: "mori", text: { en: "山 is a mountain, and 石 is a stone. Imagine a mountain rooted in solid rock.", ja: "山は山、石は石だよ。しっかりとした岩に根を張った山を想像してみて。", vi: "山 là ngọn núi, 石 là hòn đá. Hãy tưởng tượng một ngọn núi bám rễ trên nền đá vững chắc." }, kana: "やまはやま、いしはいしだよ。しっかりとしたいわにねをはったやまをそうぞうしてみて。" },
        { who: "mori", text: { en: "The Picture Shrine remembers it. Go see — then we'll build the word.", ja: "絵神社がそれを覚えているよ。見に行ってごらん——それから言葉を作ろう。", vi: "Miếu Tranh nhớ điều đó. Hãy đi xem — rồi chúng ta sẽ ghép từ." }, kana: "えじんじゃがそれをおぼえているよ。みにいってごらん——それからことばをつくろう。" },
      ],
      bento: [{ who: "mori", text: { en: "Bento time! Mountain on the left, stone on the right. Sturdy and delicious.", ja: "弁当の時間だ！左に山、右に石。丈夫でおいしいね。", vi: "Đến giờ bento! Núi bên trái, đá bên phải. Vững chãi và ngon lành." }, kana: "べんとうのじかんだ！ひだりにやま、みぎにいし。じょうぶでおいしいね。" }],
      write: [
        { who: "mori", text: { en: "岩 — a mountain of stone. Strong word! Say it: gan.", ja: "岩——石の山だ。強い言葉だね！言ってみて：がん。", vi: "岩 — một ngọn núi bằng đá. Từ mạnh mẽ! Hãy nói: gan." }, kana: "いわ——いしのやまだ。つよいことばだね！いってみて：がん。" },
        { who: "mori", text: { en: "Write it at the Calligraphy Desk and the boulders will listen.", ja: "書道机で書けば、巨岩たちも言うことを聞くよ。", vi: "Hãy viết nó tại Bàn Thư Pháp và những tảng đá sẽ lắng nghe." }, kana: "しょどうづくえでかけば、きょがんたちもいうことをきくよ。" },
      ],
      restore: [
        { who: "mori", text: { en: "Magnificent! Watch the mountain…", ja: "素晴らしい！山を見ていてごらん……", vi: "Tuyệt vời! Hãy nhìn ngọn núi…" }, kana: "すばらしい！やまをみていてごらん……" },
        { who: "mori", text: { en: "The boulders roll aside, and the path gleams — 岩 carved into the cliff. You've reached Level 3!", ja: "巨岩が脇へ転がり、道が輝く——崖に刻まれた岩の文字。レベル3到達だ！", vi: "Những tảng đá lăn sang một bên, con đường lấp lánh — 岩 khắc trên vách đá. Con đã đạt Cấp 3!" }, kana: "きょがんがわきへころがり、みちがかがやく——がけにきざまれたいわのもじ。レベル3とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "The whole forest is awake now: rest, light, and stone. Come visit my catalog whenever you wish, little one.", ja: "森全体が目を覚ましたね：休み、光、そして石。いつでもカタログを見においで、小さい子よ。", vi: "Cả khu rừng giờ đã thức giấc: nghỉ ngơi, ánh sáng, và đá. Hãy ghé thăm danh mục của ta bất cứ khi nào con muốn, bé nhỏ à." }, kana: "もりぜんたいがめをさましたね：やすみ、ひかり、そしていし。いつでもカタログをみにおいで、ちいさいこよ。" }],
=======
        { who: "tanuki", text: { en: "(A rumble shakes the forest. Big boulders have rolled across the mountain path.)", ja: "（ゴロゴロと森が揺れる。大きな岩が山道に転がってふさいでいる。）", vi: "(Một tiếng ầm ầm làm rung chuyển khu rừng. Những tảng đá lớn đã lăn xuống chặn con đường núi.)"}, kana: "（ゴロゴロともりがゆれる。おおきないわがやまみちにころがってふさいでいる。）" },
        { who: "mori", text: { en: "Hoo! The mountain is restless. It has swallowed the word for rock, and now the path is blocked.", ja: "ホー！山が落ち着かないんだ。岩という言葉を飲み込まれて、今は道がふさがれている。", vi: "Hoo! Ngọn núi đang bất an. Nó đã nuốt chửng từ ngữ của đá, và giờ con đường bị chặn."}, kana: "ホー！やまがおちつかないんだ。いわということばをのみこまれて、いまはみちがふさがれている。" },
        { who: "mori", text: { en: "The pieces 山 and 石 fell into the mine. Mountain upon stone — that word is strong enough to move boulders!", ja: "山と石の破片が鉱山に落ちたんだ。山の上に石——その言葉は巨岩を動かせるほど強い！", vi: "Hai mảnh 山 và 石 đã rơi vào mỏ. Núi chồng lên đá — từ đó đủ mạnh để dịch chuyển những tảng đá!"}, kana: "やまといしのはへんがこうざんにおちたんだ。やまのうえにいし——そのことばはきょがんをうごかせるほどつよい！" },
        { who: "tanuki", text: { en: "(Tanuki cracks its knuckles and marches toward the mine.)", ja: "（タヌキは指をポキポキ鳴らし、鉱山へ向かって進む。）", vi: "(Tanuki bẻ khớp ngón tay và hành quân về phía mỏ.)"}, kana: "（タヌキはゆびをポキポキならし、こうざんへむかってすすむ。）" },
      ],
      mine: [{ who: "mori", text: { en: "The heaviest rocks in the mine hold the pieces. Give them your strongest whacks!", ja: "鉱山で一番重い岩が破片を持っているよ。一番強い一撃をお見舞いして！", vi: "Những tảng đá nặng nhất trong mỏ đang giữ các mảnh. Hãy tung những cú đập mạnh nhất!"}, kana: "こうざんでいちばんおもいいわがはへんをもっているよ。いちばんつよいいちげきをおみまいして！" }],
      shrine: [
        { who: "mori", text: { en: "山 is a mountain, and 石 is a stone. Imagine a mountain rooted in solid rock.", ja: "山は山、石は石だよ。しっかりとした岩に根を張った山を想像してみて。", vi: "山 là ngọn núi, 石 là hòn đá. Hãy tưởng tượng một ngọn núi bám rễ trên nền đá vững chắc."}, kana: "やまはやま、いしはいしだよ。しっかりとしたいわにねをはったやまをそうぞうしてみて。" },
        { who: "mori", text: { en: "The Picture Shrine remembers it. Go see — then we'll build the word.", ja: "絵神社がそれを覚えているよ。見に行ってごらん——それから言葉を作ろう。", vi: "Miếu Tranh nhớ điều đó. Hãy đi xem — rồi chúng ta sẽ ghép từ."}, kana: "えじんじゃがそれをおぼえているよ。みにいってごらん——それからことばをつくろう。" },
      ],
      bento: [{ who: "mori", text: { en: "Bento time! Mountain on the left, stone on the right. Sturdy and delicious.", ja: "弁当の時間だ！左に山、右に石。丈夫でおいしいね。", vi: "Đến giờ bento! Núi bên trái, đá bên phải. Vững chãi và ngon lành."}, kana: "べんとうのじかんだ！ひだりにやま、みぎにいし。じょうぶでおいしいね。" }],
      write: [
        { who: "mori", text: { en: "岩 — a mountain of stone. Strong word! Say it: gan.", ja: "岩——石の山だ。強い言葉だね！言ってみて：がん。", vi: "岩 — một ngọn núi bằng đá. Từ mạnh mẽ! Hãy nói: gan."}, kana: "いわ——いしのやまだ。つよいことばだね！いってみて：がん。" },
        { who: "mori", text: { en: "Write it at the Calligraphy Desk and the boulders will listen.", ja: "書道机で書けば、巨岩たちも言うことを聞くよ。", vi: "Hãy viết nó tại Bàn Thư Pháp và những tảng đá sẽ lắng nghe."}, kana: "しょどうづくえでかけば、きょがんたちもいうことをきくよ。" },
      ],
      restore: [
        { who: "mori", text: { en: "Magnificent! Watch the mountain…", ja: "素晴らしい！山を見ていてごらん……", vi: "Tuyệt vời! Hãy nhìn ngọn núi…"}, kana: "すばらしい！やまをみていてごらん……" },
        { who: "mori", text: { en: "The boulders roll aside, and the path gleams — 岩 carved into the cliff. You've reached Level 3!", ja: "巨岩が脇へ転がり、道が輝く——崖に刻まれた岩の文字。レベル3到達だ！", vi: "Những tảng đá lăn sang một bên, con đường lấp lánh — 岩 khắc trên vách đá. Con đã đạt Cấp 3!"}, kana: "きょがんがわきへころがり、みちがかがやく——がけにきざまれたいわのもじ。レベル3とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "The whole forest is awake now: rest, light, and stone. Come visit my catalog whenever you wish, little one.", ja: "森全体が目を覚ましたね：休み、光、そして石。いつでもカタログを見においで、小さい子よ。", vi: "Cả khu rừng giờ đã thức giấc: nghỉ ngơi, ánh sáng, và đá. Hãy ghé thăm danh mục của ta bất cứ khi nào con muốn, bé nhỏ à."}, kana: "もりぜんたいがめをさましたね：やすみ、ひかり、そしていし。いつでもカタログをみにおいで、ちいさいこよ。" }],
    },
  },

  {
    id: "ji",
    num: 4,
    title: { en: "The Bell of Time", ja: "時の鐘", vi: "Chuông Thời Gian" },
    digChars: ["日", "寺"],
    shrineOptions: ["日", "寺", "口", "田"],
    scene: "time",
    kanji: {
      char: "時",
      meaning: { en: "Time", ja: "時", vi: "Thời gian" },
      on: "ジ (ji)",
      kun: "とき (toki)",
      strokes: 10,
      parts: ["日", "寺"],
      story: {
        en: "Long ago there were no clocks. People watched the sun (日) move beneath the temple roof (寺) to tell the time of day.",
        ja: "昔は時計がありませんでした。人々は寺の屋根の下を動く太陽（日）を見て、時刻を測っていました。",
        vi: "Ngày xưa chưa có đồng hồ. Người ta nhìn mặt trời (日) di chuyển dưới mái chùa (寺) để đoán thời gian trong ngày.",
      },
      vocab: [
        { jp: "時間", kana: "じかん", en: { en: "time / hour", ja: "時間", vi: "thời gian" } },
        { jp: "時々", kana: "ときどき", en: { en: "sometimes", ja: "ときどき", vi: "thỉnh thoảng" } },
        { jp: "一時", kana: "いちじ", en: { en: "one o'clock", ja: "一時", vi: "một giờ" } },
      ],
    },
    strokes: [
      "M18 22 L18 80",
      "M14 22 L33 22",
      "M25 22 L25 80",
      "M14 80 L33 80",
      "M42 16 L88 16",
      "M65 16 L65 52",
      "M46 52 L86 52",
      "M46 66 L88 66",
      "M78 66 L78 92 Q78 96 73 96",
      "M88 70 Q93 76 87 82",
    ],
    objectives: {
      arrival: { en: "Talk to Mori by the temple gate", ja: "寺の門のそばでモリと話す", vi: "Trò chuyện với Mori bên cổng chùa" },
      mine: { en: "Dig the glowing rocks in the Radical Mine", ja: "部首鉱山で光る岩を掘る", vi: "Đào những tảng đá phát sáng trong Mỏ Bộ Thủ" },
      shrine: { en: "Visit the Picture Shrine", ja: "絵神社を訪れる", vi: "Ghé thăm Miếu Tranh" },
      bento: { en: "Build the Kanji at the Bento Table", ja: "弁当台で漢字を作る", vi: "Ghép chữ Kanji tại Bàn Bento" },
      write: { en: "Practice writing at the Calligraphy Desk", ja: "書道机で書き方を練習する", vi: "Tập viết tại Bàn Thư Pháp" },
      restore: { en: "Return to Mori", ja: "モリのもとへ戻る", vi: "Quay lại chỗ Mori" },
      done: { en: "Chapter complete! Browse the Conversation Catalog", ja: "章クリア！会話カタログを見てみよう", vi: "Hoàn thành chương! Khám phá Danh Mục Hội Thoại" },
    },
    dialogues: {
      arrival: [
        { who: "tanuki", text: { en: "...? (Tanuki peers at the temple roof. The shadow on the ground has not moved all day.)", ja: "……？（タヌキは寺の屋根を見上げて首をかしげる。地面の影が一日中動いていない。）", vi: "...? (Tanuki ngước nhìn mái chùa. Cái bóng trên mặt đất đã không nhúc nhích cả ngày.)" }, kana: "……？（タヌキはてらのやねをみあげてくびをかしげる。じめんのかげがいちにちじゅううごいていない。）" },
        { who: "mori", text: { en: "Hoo-hoo! The temple bell has not rung since dawn, little one. The dark wind stole the word for time: 時.", ja: "ホーホー！夜明けから寺の鐘が鳴っていないんだ、小さい子よ。時間という言葉「時」を闇の風に奪われてしまった。", vi: "Hoo-hoo! Chuông chùa đã không kêu từ lúc bình minh, bé nhỏ à. Cơn gió bóng tối đã đánh cắp từ ngữ của thời gian: 時." }, kana: "ホーホー！よあけからてらのかねがなっていないんだ、ちいさいこよ。じかんということば「じ」をやみのかぜにうばわれてしまった。" },
        { who: "mori", text: { en: "Long ago we had no clocks. We told the time by watching the sun 日 move across the temple roof 寺.", ja: "昔は時計なんてなかったんだ。寺の屋根を動く太陽「日」を見て、時刻を測っていたんだよ。", vi: "Ngày xưa chúng ta không có đồng hồ. Ta xem giờ bằng cách nhìn mặt trời 日 di chuyển trên mái chùa 寺." }, kana: "むかしはとけいなんてなかったんだ。てらのやねをうごくたいよう「ひ」をみて、じこくをはかっていたんだよ。" },
        { who: "mori", text: { en: "The pieces 日 and 寺 are buried in the mine. Bring them back and the bell will ring again!", ja: "日と寺の破片が鉱山に埋まっているんだ。取り戻せば、鐘がまた鳴るよ！", vi: "Hai mảnh 日 và 寺 đang bị chôn trong mỏ. Mang chúng về, chuông sẽ lại kêu!" }, kana: "ひとてらのはへんがこうざんにうまっているんだ。とりもどせば、かねがまたなるよ！" },
        { who: "tanuki", text: { en: "(Tanuki studies its reflection in the bento lid like a pocket watch, then nods.)", ja: "（タヌキは弁当箱の蓋を懐中時計のように見つめて、うなずく。）", vi: "(Tanuki nhìn hình phản chiếu trên nắp hộp bento như một chiếc đồng hồ bỏ túi, rồi gật đầu.)" }, kana: "（タヌキはべんとうばこのふたをかいちゅうどけいのようにみつめて、うなずく。）" },
      ],
      mine: [{ who: "mori", text: { en: "The glowing rocks are in the Radical Mine, west of here. The sun piece and the temple piece are waiting!", ja: "光る岩はここから西の部首鉱山にあるよ。太陽の破片と寺の破片が待っている！", vi: "Những tảng đá phát sáng nằm trong Mỏ Bộ Thủ, phía tây đây. Mảnh mặt trời và mảnh ngôi chùa đang chờ!" }, kana: "ひかるいわはここからにしのぶしゅこうざんにあるよ。たいようのはへんとてらのはへんがまっている！" }],
      shrine: [
        { who: "mori", text: { en: "日 is the sun that marks the hours, and 寺 is the temple that shelters it.", ja: "日は時刻を刻む太陽、寺はその太陽を守るお堂だよ。", vi: "日 là mặt trời đánh dấu giờ giấc, 寺 là ngôi chùa che chở cho nó." }, kana: "ひはじこくをきざむたいよう、てらはそのたいようをまもるおどうだよ。" },
        { who: "mori", text: { en: "Take them to the Picture Shrine — it remembers the moment when sun meets temple.", ja: "絵神社に持っていくと、太陽と寺が出会う瞬間を思い出してくれるよ。", vi: "Hãy mang chúng đến Miếu Tranh — nó nhớ khoảnh khắc mặt trời gặp ngôi chùa." }, kana: "えじんじゃにもっていくと、たいようとてらがであうしゅんかんをおもいだしてくれるよ。" },
      ],
      bento: [{ who: "mori", text: { en: "Into the Bento Box! Sun on the left, temple on the right — a little sundial for lunch.", ja: "弁当箱に入れて！左に太陽、右に寺——お昼の小さな日時計だね。", vi: "Cho vào Hộp Bento! Mặt trời bên trái, ngôi chùa bên phải — một chiếc đồng hồ mặt trời nhỏ cho bữa trưa." }, kana: "べんとうばこにいれて！ひだりにたいよう、みぎにてら——おひるのちいさなひどけいだね。" }],
      write: [
        { who: "mori", text: { en: "時 — the sun standing beside the temple. Say it with me: ji.", ja: "時——寺のそばに立つ太陽だよ。一緒に言ってみて：じ。", vi: "時 — mặt trời đứng bên cạnh ngôi chùa. Hãy nói cùng ta: ji." }, kana: "じ——てらのそばにたつたいようだよ。いっしょにいってみて：じ。" },
        { who: "mori", text: { en: "Once your hand remembers it, the shadows will start moving again. The Calligraphy Desk is ready.", ja: "手が覚えれば、影がまた動き出すよ。書道机の準備はできている。", vi: "Một khi đôi tay ghi nhớ nó, những cái bóng sẽ lại bắt đầu chuyển động. Bàn Thư Pháp đã sẵn sàng." }, kana: "てがおぼえれば、かげがまたうごきだすよ。しょどうづくえのじゅんびはできている。" },
      ],
      restore: [
        { who: "mori", text: { en: "Beautiful strokes! Watch the temple grounds…", ja: "素敵な筆さばきだ！寺の境内を見ていてごらん……", vi: "Nét bút tuyệt đẹp! Hãy nhìn sân chùa…" }, kana: "すてきなふでさばきだ！てらのけいだいをみていてごらん……" },
        { who: "mori", text: { en: "The bell rings noon, and the shadows stretch and shrink once more — 時 has returned to the forest. Level 4!", ja: "鐘が正午を告げ、影がまた伸び縮みする——時が森に戻ってきたよ。レベル4到達だ！", vi: "Chuông điểm giữa trưa, những cái bóng lại giãn ra và co lại — 時 đã trở về khu rừng. Con đã đạt Cấp 4!" }, kana: "かねがしょうごをつげ、かげがまたのびちぢみする——ときがもりにもどってきたよ。レベル4とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "Time flows again! Rest by the temple, and I'll teach you phrases about the hours.", ja: "時がまた流れ始めたね！寺のそばで休んで、時刻のフレーズを教えてあげるよ。", vi: "Thời gian lại trôi! Hãy nghỉ ngơi bên ngôi chùa, ta sẽ dạy con những câu về giờ giấc." }, kana: "ときがまたながれはじめたね！てらのそばでやすんで、じこくのフレーズをおしえてあげるよ。" }],
    },
  },

  {
    id: "dan",
    num: 5,
    title: { en: "Strength in the Fields", ja: "田んぼの力", vi: "Sức Mạnh Nơi Đồng Ruộng" },
    digChars: ["田", "力"],
    shrineOptions: ["田", "力", "土", "口"],
    scene: "field",
    kanji: {
      char: "男",
      meaning: { en: "Man", ja: "男", vi: "Nam / Đàn ông" },
      on: "ダン (dan)",
      kun: "おとこ (otoko)",
      strokes: 7,
      parts: ["田", "力"],
      story: {
        en: "Since ancient times the rice field (田) has been worked by strength (力) — the strength of a man (男).",
        ja: "昔から田んぼは力で耕されてきました。田に力を合わせた姿が「男」です。",
        vi: "Từ xa xưa, việc đồng áng (田) luôn có sự góp sức (力) từ những người nam (男).",
      },
      vocab: [
        { jp: "男", kana: "おとこ", en: { en: "man", ja: "男", vi: "đàn ông" } },
        { jp: "男性", kana: "だんせい", en: { en: "male / man", ja: "男性", vi: "nam giới" } },
        { jp: "男の子", kana: "おとこのこ", en: { en: "boy", ja: "男の子", vi: "bé trai" } },
      ],
    },
    strokes: [
      "M20 15 L20 62",
      "M14 15 L52 15",
      "M33 15 L33 62",
      "M14 62 L52 62",
      "M58 18 L92 18",
      "M75 18 L75 90 Q75 94 71 94",
      "M58 34 Q68 62 75 90",
    ],
    objectives: {
      arrival: { en: "Talk to Mori by the rice paddies", ja: "田んぼのそばでモリと話す", vi: "Trò chuyện với Mori bên ruộng lúa" },
      mine: { en: "Dig the glowing rocks in the Radical Mine", ja: "部首鉱山で光る岩を掘る", vi: "Đào những tảng đá phát sáng trong Mỏ Bộ Thủ" },
      shrine: { en: "Visit the Picture Shrine", ja: "絵神社を訪れる", vi: "Ghé thăm Miếu Tranh" },
      bento: { en: "Build the Kanji at the Bento Table", ja: "弁当台で漢字を作る", vi: "Ghép chữ Kanji tại Bàn Bento" },
      write: { en: "Practice writing at the Calligraphy Desk", ja: "書道机で書き方を練習する", vi: "Tập viết tại Bàn Thư Pháp" },
      restore: { en: "Return to Mori", ja: "モリのもとへ戻る", vi: "Quay lại chỗ Mori" },
      done: { en: "Chapter complete! Browse the Conversation Catalog", ja: "章クリア！会話カタログを見てみよう", vi: "Hoàn thành chương! Khám phá Danh Mục Hội Thoại" },
    },
    dialogues: {
      arrival: [
        { who: "tanuki", text: { en: "...? (Tanuki stands at the edge of the rice paddies. The young rice plants droop, thirsty.)", ja: "……？（タヌキは田んぼのほとりに立っている。稲の苗がぐったりとしおれている。）", vi: "...? (Tanuki đứng bên bờ ruộng lúa. Những cây mạ non héo rũ vì khát.)" }, kana: "……？（タヌキはたんぼのほとりにたっている。いねのなえがぐったりとしおれている。）" },
        { who: "mori", text: { en: "Hoo-hoo! The paddies are drying up, little one. The dark wind stole the word for man: 男.", ja: "ホーホー！田んぼが干上がってしまいそうなんだ、小さい子よ。「男」という言葉を闇の風に奪われてしまった。", vi: "Hoo-hoo! Ruộng lúa sắp khô cạn rồi, bé nhỏ à. Cơn gió bóng tối đã đánh cắp từ ngữ của người nam: 男." }, kana: "ホーホー！たんぼがひあがってしまいそうなんだ、ちいさいこよ。「おとこ」ということばをやみのかぜにうばわれてしまった。" },
        { who: "mori", text: { en: "Since ancient times, the fields 田 have been tended by strength 力 — the strength of men 男.", ja: "昔から田んぼは力で耕されてきたんだ。田に力を合わせると、それが「男」なんだよ。", vi: "Từ xa xưa, ruộng đồng 田 luôn được chăm bón bằng sức mạnh 力 — sức mạnh của người nam 男." }, kana: "むかしからたんぼはちからでたがやされてきたんだ。たにちからをあわせると、それが「おとこ」なんだよ。" },
        { who: "mori", text: { en: "The pieces 田 and 力 are buried in the mine. Bring them back and the fields will drink again!", ja: "田と力の破片が鉱山に埋まっているんだ。取り戻せば、田んぼがまた元気になるよ！", vi: "Hai mảnh 田 và 力 đang bị chôn trong mỏ. Mang chúng về, ruộng lúa sẽ lại tươi tốt!" }, kana: "たとちからのはへんがこうざんにうまっているんだ。とりもどせば、たんぼがまたげんきになるよ！" },
        { who: "tanuki", text: { en: "(Tanuki rolls up its sleeves and marches toward the mine.)", ja: "（タヌキは袖をまくり、鉱山へ向かって歩き出す。）", vi: "(Tanuki xắn tay áo và bước về phía mỏ.)" }, kana: "（タヌキはそでをまくり、こうざんへむかってあるきだす。）" },
      ],
      mine: [{ who: "mori", text: { en: "The glowing rocks are in the Radical Mine, west of here. The field piece and the strength piece are waiting!", ja: "光る岩はここから西の部首鉱山にあるよ。田んぼの破片と力の破片が待っている！", vi: "Những tảng đá phát sáng nằm trong Mỏ Bộ Thủ, phía tây đây. Mảnh ruộng và mảnh sức mạnh đang chờ!" }, kana: "ひかるいわはここからにしのぶしゅこうざんにあるよ。たんぼのはへんとちからのはへんがまっている！" }],
      shrine: [
        { who: "mori", text: { en: "田 is the field that feeds us, and 力 is the strength that works it.", ja: "田は私たちを養う田んぼ、力はそれを耕す力だよ。", vi: "田 là ruộng lúa nuôi sống chúng ta, 力 là sức mạnh cày cấy nó." }, kana: "たはわたしたちをやしなうたんぼ、ちからはそれをたがやすちからだよ。" },
        { who: "mori", text: { en: "Take them to the Picture Shrine — it remembers the hands that shaped the land.", ja: "絵神社に持っていくと、土地を耕してきた手を思い出してくれるよ。", vi: "Hãy mang chúng đến Miếu Tranh — nó nhớ những bàn tay đã khai phá đất đai." }, kana: "えじんじゃにもっていくと、とちをたがやしてきたてをおもいだしてくれるよ。" },
      ],
      bento: [{ who: "mori", text: { en: "Into the Bento Box! Field on the left, strength on the right — a hearty meal for hard workers.", ja: "弁当箱に入れて！左に田んぼ、右に力——働き者のためのごちそうだね。", vi: "Cho vào Hộp Bento! Ruộng bên trái, sức mạnh bên phải — một bữa no nê cho người lao động." }, kana: "べんとうばこにいれて！ひだりにたんぼ、みぎにちから——はたらきもののためのごちそうだね。" }],
      write: [
        { who: "mori", text: { en: "男 — strength working the fields. Say it proudly: otoko.", ja: "男——田んぼで働く力だよ。誇らしく言ってみて：おとこ。", vi: "男 — sức mạnh làm việc trên đồng ruộng. Hãy nói thật tự hào: otoko." }, kana: "おとこ——たんぼではたらくちからだよ。ほこらしくいってみて：おとこ。" },
        { who: "mori", text: { en: "Once your hand remembers it, the paddies will stand tall again. The Calligraphy Desk is ready.", ja: "手が覚えれば、田んぼがまた青々とするよ。書道机の準備はできている。", vi: "Một khi đôi tay ghi nhớ nó, ruộng lúa sẽ lại xanh tươi. Bàn Thư Pháp đã sẵn sàng." }, kana: "てがおぼえれば、たんぼがまたあおあおとするよ。しょどうづくえのじゅんびはできている。" },
      ],
      restore: [
        { who: "mori", text: { en: "Powerful strokes! Watch the paddies…", ja: "力強い筆さばきだ！田んぼを見ていてごらん……", vi: "Nét bút đầy sức mạnh! Hãy nhìn ruộng lúa…" }, kana: "ちからづよいふでさばきだ！たんぼをみていてごらん……" },
        { who: "mori", text: { en: "Water flows back into the fields, and the rice plants lift their heads — 男 has returned to the land. Level 5!", ja: "田んぼに水が戻り、稲が頭を起こす——男が大地に戻ってきたよ。レベル5到達だ！", vi: "Nước lại chảy về ruộng, những cây lúa ngẩng cao đầu — 男 đã trở về đất đai. Con đã đạt Cấp 5!" }, kana: "たんぼにみずがもどり、いねがあたまをおこす——おとこがだいちにもどってきたよ。レベル5とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "The fields are alive again! Rest by the paddies, and I'll teach you phrases about working the land.", ja: "田んぼがまた生き返ったね！田んぼのそばで休んで、畑仕事のフレーズを教えてあげるよ。", vi: "Ruộng lúa lại sống động rồi! Hãy nghỉ ngơi bên ruộng, ta sẽ dạy con những câu về việc đồng áng." }, kana: "たんぼがまたいきかえったね！たんぼのそばでやすんで、はたけしごとのフレーズをおしえてあげるよ。" }],
    },
  },

  {
    id: "setsu",
    num: 6,
    title: { en: "The White Snowfall", ja: "白い雪", vi: "Tuyết Trắng" },
    digChars: ["雨", "彐"],
    shrineOptions: ["雨", "彐", "水", "田"],
    scene: "snow",
    kanji: {
      char: "雪",
      meaning: { en: "Snow", ja: "雪", vi: "Tuyết" },
      on: "セツ (setsu)",
      kun: "ゆき (yuki)",
      strokes: 11,
      parts: ["雨", "彐"],
      story: {
        en: "Snow falls like white rain (雨), and we sweep it away with a rake (彐).",
        ja: "雪は白くなった雨のように降り、彐の道具で掃いて片付けます。",
        vi: "Tuyết (雪) rơi thành những cơn mưa (雨) trắng xóa, và ta phải dùng bàn cào (彐) để dọn chúng đi.",
      },
      vocab: [
        { jp: "雪", kana: "ゆき", en: { en: "snow", ja: "雪", vi: "tuyết" } },
        { jp: "大雪", kana: "おおゆき", en: { en: "heavy snow", ja: "大雪", vi: "tuyết lớn" } },
        { jp: "雪だるま", kana: "ゆきだるま", en: { en: "snowman", ja: "雪だるま", vi: "người tuyết" } },
      ],
    },
    strokes: [
      "M18 10 L82 10",
      "M26 10 L26 86",
      "M74 10 L74 86",
      "M18 28 L82 28",
      "M34 18 L34 24",
      "M66 18 L66 24",
      "M34 48 L34 54",
      "M66 48 L66 54",
      "M30 68 L82 68",
      "M30 80 L82 80",
      "M30 92 L76 92 Q82 92 82 88",
    ],
    objectives: {
      arrival: { en: "Talk to Mori by the snowy clearing", ja: "雪原でモリと話す", vi: "Trò chuyện với Mori giữa cánh đồng tuyết" },
      mine: { en: "Dig the glowing rocks in the Radical Mine", ja: "部首鉱山で光る岩を掘る", vi: "Đào những tảng đá phát sáng trong Mỏ Bộ Thủ" },
      shrine: { en: "Visit the Picture Shrine", ja: "絵神社を訪れる", vi: "Ghé thăm Miếu Tranh" },
      bento: { en: "Build the Kanji at the Bento Table", ja: "弁当台で漢字を作る", vi: "Ghép chữ Kanji tại Bàn Bento" },
      write: { en: "Practice writing at the Calligraphy Desk", ja: "書道机で書き方を練習する", vi: "Tập viết tại Bàn Thư Pháp" },
      restore: { en: "Return to Mori", ja: "モリのもとへ戻る", vi: "Quay lại chỗ Mori" },
      done: { en: "Chapter complete! Browse the Conversation Catalog", ja: "章クリア！会話カタログを見てみよう", vi: "Hoàn thành chương! Khám phá Danh Mục Hội Thoại" },
    },
    dialogues: {
      arrival: [
        { who: "tanuki", text: { en: "...? (Tanuki shivers at the edge of the clearing. Snow falls without end, like white rain.)", ja: "……？（タヌキは広場のほとりで震えている。白い雨のような雪が降り止まない。）", vi: "...? (Tanuki run rẩy bên bờ khoảng trống. Tuyết rơi không ngừng, như một cơn mưa trắng.)" }, kana: "……？（タヌキはひろばのほとりでふるえている。しろいあめのようなゆきがふりやまない。）" },
        { who: "mori", text: { en: "Hoo-hoo! The snow will not stop, little one. The dark wind stole the word for snow: 雪.", ja: "ホーホー！雪が止まらないんだ、小さい子よ。「雪」という言葉を闇の風に奪われてしまった。", vi: "Hoo-hoo! Tuyết không chịu ngừng rơi, bé nhỏ à. Cơn gió bóng tối đã đánh cắp từ ngữ của tuyết: 雪." }, kana: "ホーホー！ゆきがとまらないんだ、ちいさいこよ。「ゆき」ということばをやみのかぜにうばわれてしまった。" },
        { who: "mori", text: { en: "Snow is rain 雨 that turned white, and we sweep it away with a rake 彐.", ja: "雪は白くなった雨なんだ。そして、雪かきの道具で掃くんだよ。", vi: "Tuyết là mưa 雨 hóa trắng, và ta dùng bàn cào 彐 để dọn nó đi." }, kana: "ゆきはしろくなったあめなんだ。そして、ゆきかきのどうぐではくんだよ。" },
        { who: "mori", text: { en: "The pieces 雨 and 彐 are buried in the mine. Bring them back and the snow will lift!", ja: "雨と彐の破片が鉱山に埋まっているんだ。取り戻せば、雪がやむよ！", vi: "Hai mảnh 雨 và 彐 đang bị chôn trong mỏ. Mang chúng về, tuyết sẽ ngừng rơi!" }, kana: "あめとけいのはへんがこうざんにうまっているんだ。とりもどせば、ゆきがやむよ！" },
        { who: "tanuki", text: { en: "(Tanuki pulls its scarf tighter and trudges toward the mine.)", ja: "（タヌキはマフラーを巻き直し、鉱山へ向かって歩き出す。）", vi: "(Tanuki quấn lại khăn quàng cổ và lê bước về phía mỏ.)" }, kana: "（タヌキはマフラーをまきなおし、こうざんへむかってあるきだす。）" },
      ],
      mine: [{ who: "mori", text: { en: "The glowing rocks are in the Radical Mine, west of here. The rain piece and the rake piece are waiting!", ja: "光る岩はここから西の部首鉱山にあるよ。雨の破片と彐の破片が待っている！", vi: "Những tảng đá phát sáng nằm trong Mỏ Bộ Thủ, phía tây đây. Mảnh mưa và mảnh bàn cào đang chờ!" }, kana: "ひかるいわはここからにしのぶしゅこうざんにあるよ。あめのはへんとけいのはへんがまっている！" }],
      shrine: [
        { who: "mori", text: { en: "雨 is the rain that waters the sky, and 彐 is the rake that clears the snow.", ja: "雨は空を潤す雨、彐は雪を掃く道具だよ。", vi: "雨 là mưa tưới mát bầu trời, 彐 là bàn cào dọn tuyết." }, kana: "あめはそらをうるおすあめ、けいはゆきをはくどうぐだよ。" },
        { who: "mori", text: { en: "Take them to the Picture Shrine — it remembers the first snowfall.", ja: "絵神社に持っていくと、最初の雪を思い出してくれるよ。", vi: "Hãy mang chúng đến Miếu Tranh — nó nhớ trận tuyết đầu tiên." }, kana: "えじんじゃにもっていくと、さいしょのゆきをおもいだしてくれるよ。" },
      ],
      bento: [{ who: "mori", text: { en: "Into the Bento Box! Rain on the left, rake on the right — a winter snack to warm you up.", ja: "弁当箱に入れて！左に雨、右に彐——体が温まる冬のおやつだね。", vi: "Cho vào Hộp Bento! Mưa bên trái, bàn cào bên phải — một bữa ăn vặt mùa đông ấm bụng." }, kana: "べんとうばこにいれて！ひだりにあめ、みぎにけい——からだがあたたまるふゆのおやつだね。" }],
      write: [
        { who: "mori", text: { en: "雪 — white rain that blankets the forest. Say it softly: yuki.", ja: "雪——森を包む白い雨だよ。そっと言ってみて：ゆき。", vi: "雪 — cơn mưa trắng phủ kín khu rừng. Hãy nói khẽ: yuki." }, kana: "ゆき——もりをつつむしろいあめだよ。そっといってみて：ゆき。" },
        { who: "mori", text: { en: "Once your hand remembers it, the snow will remember how to melt. The Calligraphy Desk is ready.", ja: "手が覚えれば、雪も溶け方を思い出すよ。書道机の準備はできている。", vi: "Một khi đôi tay ghi nhớ nó, tuyết cũng sẽ nhớ cách tan chảy. Bàn Thư Pháp đã sẵn sàng." }, kana: "てがおぼえれば、ゆきもとけかたをおもいだすよ。しょどうづくえのじゅんびはできている。" },
      ],
      restore: [
        { who: "mori", text: { en: "Gentle strokes! Watch the falling snow…", ja: "優しい筆さばきだ！降る雪を見ていてごらん……", vi: "Nét bút thật dịu dàng! Hãy nhìn tuyết rơi…" }, kana: "やさしいふでさばきだ！ふるゆきをみていてごらん……" },
        { who: "mori", text: { en: "The flakes slow, then stop — 雪 has returned to the sky. Level 6!", ja: "雪が静まり、やがて止む——雪が空に戻ってきたよ。レベル6到達だ！", vi: "Những bông tuyết chậm lại rồi ngừng hẳn — 雪 đã trở về bầu trời. Con đã đạt Cấp 6!" }, kana: "ゆきがしずまり、やがてやむ——ゆきがそらにもどってきたよ。レベル6とうたつだ！" },
      ],
      done: [{ who: "mori", text: { en: "The forest glitters under fresh snow! Rest by the hearth, and I'll teach you winter phrases.", ja: "森が新雪に輝いているね！暖炉のそばで休んで、冬のフレーズを教えてあげるよ。", vi: "Khu rừng lấp lánh dưới lớp tuyết mới! Hãy nghỉ ngơi bên lò sưởi, ta sẽ dạy con những câu về mùa đông." }, kana: "もりがしんせつにかがやいているね！だんろのそばでやすんで、ふゆのフレーズをおしえてあげるよ。" }],
>>>>>>> Stashed changes
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
  "寺": { name: "てら", meaning: { en: "temple", ja: "寺", vi: "chùa" } },
  "田": { name: "た", meaning: { en: "rice field", ja: "田", vi: "ruộng" } },
  "力": { name: "ちから", meaning: { en: "power / strength", ja: "力", vi: "sức mạnh" } },
  "雨": { name: "あめ", meaning: { en: "rain", ja: "雨", vi: "mưa" } },
  "彐": { name: "けい", meaning: { en: "rake / bristle", ja: "彐（けい）", vi: "cái cào" } },
};

export const CATALOG = [
  {
    level: 1,
    title: { en: "Taking a break", ja: "ひと休みしよう", vi: "Nghỉ giải lao" },
    lines: [
      { who: "Mori", jp: "ちょっと休みましょう。", kana: "ちょっとやすみましょう。", romaji: "Chotto yasumimashō.", en: { en: "Let's rest a little.", ja: "ちょっと休みましょう。", vi: "Chúng ta nghỉ một chút nhé." } },
      { who: "Tanuki", jp: "はい、休みます！", kana: "はい、やすみます！", romaji: "Hai, yasumimasu!", en: { en: "Okay, I'll rest!", ja: "はい、休みます！", vi: "Vâng, tôi sẽ nghỉ!" } },
    ],
  },
  {
    level: 1,
    title: { en: "Day off", ja: "休日", vi: "Ngày nghỉ" },
    lines: [
      { who: "Mori", jp: "明日は休日ですか。", kana: "あしたはきゅうじつですか。", romaji: "Ashita wa kyūjitsu desu ka.", en: { en: "Is tomorrow a day off?", ja: "明日は休日ですか。", vi: "Ngày mai có phải là ngày nghỉ không?" } },
      { who: "Tanuki", jp: "はい、休日です。", kana: "はい、きゅうじつです。", romaji: "Hai, kyūjitsu desu.", en: { en: "Yes, it's a day off.", ja: "はい、休日です。", vi: "Vâng, là ngày nghỉ." } },
    ],
  },
  {
    level: 1,
    title: { en: "Good night", ja: "おやすみ", vi: "Chúc ngủ ngon" },
    lines: [
      { who: "Mori", jp: "お休みなさい。", kana: "おやすみなさい。", romaji: "Oyasumi nasai.", en: { en: "Good night (rest well).", ja: "お休みなさい。", vi: "Chúc ngủ ngon (nghỉ ngơi tốt)." } },
      { who: "Tanuki", jp: "お休み〜！", kana: "おやすみ〜！", romaji: "Oyasumi~!", en: { en: "Night night!", ja: "お休み〜！", vi: "Ngủ ngon nhé!" } },
    ],
  },
  {
    level: 2,
    title: { en: "Bright morning (明)", ja: "明るい朝（明）", vi: "Buổi sáng tươi sáng (明)" },
    lines: [
      { who: "Mori", jp: "今日は明るいですね。", kana: "きょうはあかるいですね。", romaji: "Kyō wa akarui desu ne.", en: { en: "It's bright today, isn't it?", ja: "今日は明るいですね。", vi: "Hôm nay trời sáng nhỉ?" } },
      { who: "Tanuki", jp: "明日も明るいといいな。", kana: "あしたもあかるいといいな。", romaji: "Ashita mo akarui to ii na.", en: { en: "I hope tomorrow is bright too.", ja: "明日も明るいといいな。", vi: "Mong ngày mai cũng sáng." } },
    ],
  },
  {
    level: 3,
    title: { en: "On the rocks (岩)", ja: "岩の上で（岩）", vi: "Trên tảng đá (岩)" },
    lines: [
      { who: "Mori", jp: "岩の上で休みましょう。", kana: "いわのうえでやすみましょう。", romaji: "Iwa no ue de yasumimashō.", en: { en: "Let's rest on the rock.", ja: "岩の上で休みましょう。", vi: "Chúng ta hãy nghỉ trên tảng đá." } },
      { who: "Tanuki", jp: "この岩は大きいですね。", kana: "このいわはおおきいですね。", romaji: "Kono iwa wa ōkii desu ne.", en: { en: "This rock is big, isn't it?", ja: "この岩は大きいですね。", vi: "Tảng đá này to nhỉ?" } },
<<<<<<< Updated upstream
=======
    ],
  },

  {
    level: 4,
    title: { en: "What time is it?", ja: "今何時ですか", vi: "Mấy giờ rồi?" },
    lines: [
      { who: "Mori", jp: "今、何時ですか。", kana: "いま、なんじですか。", romaji: "Ima, nanji desu ka.", en: { en: "What time is it now?", ja: "今、何時ですか。", vi: "Bây giờ là mấy giờ?" } },
      { who: "Tanuki", jp: "三時です。", kana: "さんじです。", romaji: "Sanji desu.", en: { en: "It's three o'clock.", ja: "三時です。", vi: "Ba giờ." } },
    ],
  },
  {
    level: 4,
    title: { en: "Every day", ja: "毎日", vi: "Mỗi ngày" },
    lines: [
      { who: "Mori", jp: "毎日、寺で時間を過ごします。", kana: "まいにち、てらでじかんをすごします。", romaji: "Mainichi, tera de jikan wo sugoshimasu.", en: { en: "I spend time at the temple every day.", ja: "毎日、寺で時間を過ごします。", vi: "Mỗi ngày tôi dành thời gian ở chùa." } },
      { who: "Tanuki", jp: "時々、昼寝をします。", kana: "ときどき、ひるねをします。", romaji: "Tokidoki, hirune wo shimasu.", en: { en: "Sometimes I take a nap.", ja: "時々、昼寝をします。", vi: "Thỉnh thoảng tôi ngủ trưa." } },
    ],
  },
  {
    level: 4,
    title: { en: "Time to rest", ja: "休む時間", vi: "Giờ nghỉ ngơi" },
    lines: [
      { who: "Mori", jp: "休む時間ですよ。", kana: "やすむじかんですよ。", romaji: "Yasumu jikan desu yo.", en: { en: "It's time to rest.", ja: "休む時間ですよ。", vi: "Đến giờ nghỉ ngơi rồi." } },
      { who: "Tanuki", jp: "はい、ありがとう！", kana: "はい、ありがとう！", romaji: "Hai, arigatou!", en: { en: "Yes, thank you!", ja: "はい、ありがとう！", vi: "Vâng, cảm ơn!" } },
    ],
  },

  {
    level: 5,
    title: { en: "Who is that man?", ja: "あの男の人は誰ですか", vi: "Người đàn ông đó là ai?" },
    lines: [
      { who: "Mori", jp: "あの男の人は誰ですか。", kana: "あのおとこのひとはだれですか。", romaji: "Ano otoko no hito wa dare desu ka.", en: { en: "Who is that man?", ja: "あの男の人は誰ですか。", vi: "Người đàn ông đó là ai?" } },
      { who: "Tanuki", jp: "彼は父です。", kana: "かれはちちです。", romaji: "Kare wa chichi desu.", en: { en: "He is my father.", ja: "彼は父です。", vi: "Ông ấy là cha tôi." } },
    ],
  },
  {
    level: 5,
    title: { en: "Working the fields", ja: "畑仕事", vi: "Việc đồng áng" },
    lines: [
      { who: "Mori", jp: "男の人たちは田んぼで働きます。", kana: "おとこのひとたちはたんぼではたらきます。", romaji: "Otoko no hitotachi wa tanbo de hatarakimasu.", en: { en: "The men work in the fields.", ja: "男の人たちは田んぼで働きます。", vi: "Những người đàn ông làm việc ngoài đồng." } },
      { who: "Tanuki", jp: "力がありますね。", kana: "ちからがありますね。", romaji: "Chikara ga arimasu ne.", en: { en: "They are strong, aren't they?", ja: "力がありますね。", vi: "Họ khỏe thật nhỉ?" } },
    ],
  },
  {
    level: 5,
    title: { en: "Strong and kind", ja: "強くて優しい", vi: "Mạnh mẽ và tốt bụng" },
    lines: [
      { who: "Mori", jp: "男の人は力が強いです。", kana: "おとこのひとはちからがつよいです。", romaji: "Otoko no hito wa chikara ga tsuyoi desu.", en: { en: "Men are strong.", ja: "男の人は力が強いです。", vi: "Người đàn ông rất khỏe." } },
      { who: "Tanuki", jp: "でも、優しいです。", kana: "でも、やさしいです。", romaji: "Demo, yasashii desu.", en: { en: "But they are kind.", ja: "でも、優しいです。", vi: "Nhưng họ rất tốt bụng." } },
    ],
  },

  {
    level: 6,
    title: { en: "It's snowing", ja: "雪が降っています", vi: "Trời đang mưa tuyết" },
    lines: [
      { who: "Mori", jp: "雪が降っています。", kana: "ゆきがふっています。", romaji: "Yuki ga futte imasu.", en: { en: "It is snowing.", ja: "雪が降っています。", vi: "Trời đang mưa tuyết." } },
      { who: "Tanuki", jp: "寒いですね。", kana: "さむいですね。", romaji: "Samui desu ne.", en: { en: "It's cold, isn't it?", ja: "寒いですね。", vi: "Trời lạnh nhỉ?" } },
    ],
  },
  {
    level: 6,
    title: { en: "Winter fun", ja: "冬の楽しみ", vi: "Niềm vui mùa đông" },
    lines: [
      { who: "Mori", jp: "雪だるまを作りましょう。", kana: "ゆきだるまをつくりましょう。", romaji: "Yukidaruma wo tsukurimashou.", en: { en: "Let's make a snowman.", ja: "雪だるまを作りましょう。", vi: "Chúng ta hãy đắp người tuyết." } },
      { who: "Tanuki", jp: "楽しいです！", kana: "たのしいです！", romaji: "Tanoshii desu!", en: { en: "Fun!", ja: "楽しいです！", vi: "Vui quá!" } },
    ],
  },
  {
    level: 6,
    title: { en: "Heavy snow", ja: "大雪", vi: "Tuyết lớn" },
    lines: [
      { who: "Mori", jp: "今夜は大雪でしょう。", kana: "こんやはおおゆきでしょう。", romaji: "Kon'ya wa ooyuki deshou.", en: { en: "It will snow heavily tonight.", ja: "今夜は大雪でしょう。", vi: "Đêm nay chắc sẽ có tuyết lớn." } },
      { who: "Tanuki", jp: "気をつけてください。", kana: "きをつけてください。", romaji: "Ki wo tsukete kudasai.", en: { en: "Please be careful.", ja: "気をつけてください。", vi: "Xin hãy cẩn thận." } },
>>>>>>> Stashed changes
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