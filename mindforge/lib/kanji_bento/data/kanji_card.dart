class KanjiPart {
  const KanjiPart({required this.glyph, required this.hint});

  final String glyph;
  final String hint;
}

class KanjiVocabulary {
  const KanjiVocabulary({
    required this.word,
    required this.reading,
    required this.meanings,
  });

  final String word;
  final String reading;
  final Map<String, String> meanings;
}

class KanjiCard {
  const KanjiCard({
    required this.id,
    required this.kanji,
    required this.sceneTitle,
    required this.sceneHint,
    required this.sceneEmojis,
    required this.parts,
    required this.meanings,
    required this.onReading,
    required this.kunReading,
    required this.strokeCount,
    required this.strokeSteps,
    required this.componentNote,
    required this.vocabulary,
    this.sceneTitles = const {},
    this.sceneHints = const {},
    this.componentNotes = const {},
  });

  final String id;
  final String kanji;
  final String sceneTitle;
  final String sceneHint;
  final List<String> sceneEmojis;
  final List<KanjiPart> parts;
  final Map<String, String> meanings;
  final String onReading;
  final String kunReading;
  final int strokeCount;
  final List<String> strokeSteps;
  final String componentNote;
  final List<KanjiVocabulary> vocabulary;
  final Map<String, String> sceneTitles;
  final Map<String, String> sceneHints;
  final Map<String, String> componentNotes;

  String meaningFor(String language) => meanings[language] ?? meanings['en']!;
  String sceneTitleFor(String language) => sceneTitles[language] ?? sceneTitle;
  String sceneHintFor(String language) => sceneHints[language] ?? sceneHint;
  String componentNoteFor(String language) => componentNotes[language] ?? componentNote;
}

class KanjiPiece {
  const KanjiPiece({required this.id, required this.glyph, required this.label});

  final String id;
  final String glyph;
  final String label;
}
