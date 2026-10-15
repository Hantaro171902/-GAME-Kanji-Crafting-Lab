import 'package:flutter/material.dart';

import '../data/kanji_card.dart';
import '../theme/kanji_palette.dart';

class KanjiSceneArt extends StatelessWidget {
  const KanjiSceneArt({super.key, required this.card, required this.language});

  final KanjiCard card;
  final String language;

  static const _backdrops = [
    [Color(0xFFB7D7BF), Color(0xFFEAF0C8)],
    [Color(0xFFFFD18A), Color(0xFFC2D8EB)],
    [Color(0xFFC7D7AA), Color(0xFFECDFB5)],
    [Color(0xFF9BB58B), Color(0xFFD6E1AE)],
    [Color(0xFFF5C8AE), Color(0xFFF9E5BD)],
  ];

  @override
  Widget build(BuildContext context) {
    final cardIndex = KanjiCardIndex.indexOf(card.id);
    final colors = _backdrops[cardIndex < 0 ? 0 : cardIndex];
    return Container(
      width: double.infinity,
      height: 205,
      decoration: BoxDecoration(
        gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: colors),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: KanjiPalette.woodDark, width: 2),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Positioned(left: -25, top: 102, child: _hill(color: Colors.white.withValues(alpha: .22), size: 220)),
          Positioned(right: -40, top: 119, child: _hill(color: Colors.white.withValues(alpha: .26), size: 240)),
          Positioned(left: 0, right: 0, bottom: 0, child: Container(height: 58, color: const Color(0x6695A968))),
          Positioned(left: 18, bottom: 12, child: Text(card.sceneEmojis.first, style: const TextStyle(fontSize: 48))),
          Positioned(right: 18, bottom: 12, child: Text(card.sceneEmojis.last, style: const TextStyle(fontSize: 48))),
          if (card.sceneEmojis.length > 2)
            Positioned(left: 0, right: 0, bottom: 18, child: Text(card.sceneEmojis[1], textAlign: TextAlign.center, style: const TextStyle(fontSize: 42))),
          Positioned(left: 0, right: 0, top: 13, child: Text(card.sceneTitleFor(language), textAlign: TextAlign.center, style: const TextStyle(color: KanjiPalette.ink, fontWeight: FontWeight.w900, fontSize: 14, shadows: [Shadow(color: Colors.white70, blurRadius: 6)]))),
          Positioned(left: 12, top: 9, child: _cloud()),
          Positioned(right: 20, top: 50, child: _cloud()),
        ],
      ),
    );
  }

  Widget _hill({required Color color, required double size}) => Container(
        width: size,
        height: 90,
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(size)),
      );

  Widget _cloud() => Container(
        width: 40,
        height: 15,
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: .48), borderRadius: BorderRadius.circular(12)),
      );
}

class KanjiCardIndex {
  static const _ids = ['rest', 'bright', 'grove', 'forest', 'like'];
  static int indexOf(String id) => _ids.indexOf(id);
}
