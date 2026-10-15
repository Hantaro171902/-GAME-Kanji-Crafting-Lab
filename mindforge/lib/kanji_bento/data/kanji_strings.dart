class KanjiStrings {
  KanjiStrings(this.language);

  final String language;

  static const _labels = <String, Map<String, String>>{
    'title': {'en': 'Kanji Bento', 'ja': '漢字べんとう', 'vi': 'Kanji Bento'},
    'subtitle': {'en': 'A little shade', 'ja': '木もれび', 'vi': 'Bóng cây nhỏ'},
    'play': {'en': 'Play', 'ja': 'あそぶ', 'vi': 'Chơi'},
    'settings': {'en': 'Settings', 'ja': 'せってい', 'vi': 'Cài đặt'},
    'components': {'en': 'Game pieces', 'ja': 'パーツ', 'vi': 'Mảnh ghép'},
    'level': {'en': 'Level 1 · Five little discoveries', 'ja': 'レベル1・5つの発見', 'vi': 'Màn 1 · Năm khám phá'},
    'picture': {'en': 'Picture', 'ja': '絵', 'vi': 'Tranh'},
    'reveal': {'en': 'Reveal picture', 'ja': '絵をめくる', 'vi': 'Lật tranh'},
    'question': {'en': 'Which kanji lives in this picture?', 'ja': 'この絵にいる漢字は？', 'vi': 'Kanji nào ẩn trong bức tranh?'},
    'choose': {'en': 'Choose pieces · パーツ', 'ja': 'パーツをえらぶ', 'vi': 'Chọn mảnh ghép'},
    'check': {'en': 'Check my bento', 'ja': 'こたえをみる', 'vi': 'Kiểm tra'},
    'next': {'en': 'Next picture', 'ja': 'つぎの絵へ', 'vi': 'Tranh tiếp theo'},
    'done': {'en': 'Level complete!', 'ja': 'レベルクリア！', 'vi': 'Hoàn thành màn chơi!'},
    'language': {'en': 'Language', 'ja': '言語', 'vi': 'Ngôn ngữ'},
    'sound': {'en': 'Sound effects', 'ja': '効果音', 'vi': 'Hiệu ứng âm thanh'},
    'music': {'en': 'Music', 'ja': '音楽', 'vi': 'Nhạc'},
    'readAloud': {'en': 'Read kanji aloud', 'ja': '漢字を読み上げる', 'vi': 'Đọc kanji thành tiếng'},
    'furigana': {'en': 'Show furigana', 'ja': 'ふりがなを表示', 'vi': 'Hiện furigana'},
    'vibration': {'en': 'Vibration', 'ja': 'しんどう', 'vi': 'Rung'},
    'volume': {'en': 'Volume', 'ja': '音量', 'vi': 'Âm lượng'},
    'reading': {'en': 'Reading', 'ja': 'よみかた', 'vi': 'Cách đọc'},
    'meaning': {'en': 'Meaning', 'ja': 'いみ', 'vi': 'Ý nghĩa'},
    'write': {'en': 'Write it', 'ja': '書いてみよう', 'vi': 'Thứ tự nét'},
    'words': {'en': 'Three ways to use it', 'ja': 'ことば', 'vi': 'Từ vựng'},
    'completeSlots': {'en': 'Fill every bento space first.', 'ja': 'おべんとうの場所を全部うめてね。', 'vi': 'Hãy điền đủ các ô trong hộp bento.'},
    'tryAgain': {'en': 'Not quite — try another combination!', 'ja': 'おしい！別の組み合わせをためそう。', 'vi': 'Chưa đúng — thử cách ghép khác nhé!'},
    'tapPlace': {'en': 'Tap a piece, then a space — or drag it in.', 'ja': 'パーツをタップして場所をえらぼう。ドラッグもできるよ。', 'vi': 'Chạm mảnh rồi chọn ô, hoặc kéo thả vào hộp.'},
    'revealHint': {'en': 'Reveal a picture, then build its kanji.', 'ja': '絵をめくって、漢字をつくろう。', 'vi': 'Lật tranh rồi ghép kanji nhé.'},
    'almost': {'en': 'Almost! Move the pieces and try again.', 'ja': 'おしい！パーツを動かしてもう一度。', 'vi': 'Gần đúng rồi! Đổi vị trí các mảnh và thử lại.'},
  };

  String text(String key) => _labels[key]?[language] ?? _labels[key]?['en'] ?? key;
}
