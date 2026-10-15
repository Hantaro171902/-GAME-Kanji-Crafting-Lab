import 'package:flutter_test/flutter_test.dart';
import 'package:mindforge_academy/kanji_bento/data/kanji_catalog.dart';
import 'package:mindforge_academy/models/player_profile.dart';

void main() {
  group('Kanji Bento level-one content', () {
    test('contains five picture puzzles with three vocabulary examples each', () {
      expect(KanjiCatalog.levelOne, hasLength(5));
      for (final card in KanjiCatalog.levelOne) {
        expect(card.kanji, isNotEmpty);
        expect(card.parts, isNotEmpty);
        expect(card.vocabulary, hasLength(3));
      }
    });

    test('the ten-piece tray can build every level-one answer', () {
      expect(KanjiCatalog.pieces, hasLength(10));
      for (final card in KanjiCatalog.levelOne) {
        final available = KanjiCatalog.pieces.map((piece) => piece.glyph).toList();
        for (final part in card.parts) {
          expect(available, contains(part.glyph), reason: '${card.kanji} needs ${part.glyph}');
          available.remove(part.glyph);
        }
      }
    });

    test('starts with the supplied person-plus-tree example', () {
      final first = KanjiCatalog.levelOne.first;
      expect(first.kanji, '休');
      expect(first.parts.map((part) => part.glyph).toList(), ['亻', '木']);
      expect(first.strokeCount, 6);
    });
  });

  test('older saved profiles receive defaults for new Kanji Bento settings', () {
    final profile = PlayerProfile.fromJson(const {});

    expect(profile.language, 'en');
    expect(profile.musicVolume, 0.65);
    expect(profile.soundVolume, 0.75);
    expect(profile.readKanjiAloud, isFalse);
    expect(profile.showFurigana, isTrue);
  });

  test('Kanji Bento preferences survive profile serialization', () {
    final profile = PlayerProfile.newPlayer().copyWith(
      language: 'ja',
      musicVolume: 0.3,
      soundVolume: 0.9,
      readKanjiAloud: true,
      showFurigana: false,
    );
    final restored = PlayerProfile.fromJson(profile.toJson());

    expect(restored.language, 'ja');
    expect(restored.musicVolume, 0.3);
    expect(restored.soundVolume, 0.9);
    expect(restored.readKanjiAloud, isTrue);
    expect(restored.showFurigana, isFalse);
  });

  test('the example puzzle has Japanese and Vietnamese copy', () {
    final card = KanjiCatalog.levelOne.first;

    expect(card.sceneTitleFor('ja'), '木の下でひと休み');
    expect(card.sceneHintFor('vi'), 'Một người nghỉ bên cạnh cái cây.');
    expect(card.componentNoteFor('ja'), contains('人'));
  });
}
