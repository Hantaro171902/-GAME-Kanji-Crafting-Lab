import 'package:flutter/material.dart';

import '../data/kanji_card.dart';
import '../theme/kanji_palette.dart';

class KanjiPieceTile extends StatelessWidget {
  const KanjiPieceTile({
    super.key,
    required this.piece,
    required this.selected,
    required this.onTap,
  });

  final KanjiPiece piece;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final tile = Material(
      color: selected ? KanjiPalette.yellow : KanjiPalette.paper,
      borderRadius: BorderRadius.circular(15),
      child: InkWell(
        borderRadius: BorderRadius.circular(15),
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: 66,
          height: 72,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(15),
            border: Border.all(
              color: selected ? KanjiPalette.teal : KanjiPalette.woodDark,
              width: selected ? 3 : 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: KanjiPalette.woodDark.withValues(alpha: .32),
                offset: Offset(0, selected ? 1 : 4),
                blurRadius: 0,
              ),
            ],
          ),
          child: Text(
            piece.glyph,
            semanticsLabel: '${piece.label}, ${piece.glyph}',
            style: const TextStyle(
              color: KanjiPalette.ink,
              fontSize: 36,
              fontWeight: FontWeight.w600,
              height: 1,
            ),
          ),
        ),
      ),
    );

    return Draggable<KanjiPiece>(
      data: piece,
      feedback: Material(
        color: Colors.transparent,
        child: Transform.scale(scale: 1.08, child: tile),
      ),
      childWhenDragging: Opacity(opacity: .32, child: tile),
      child: tile,
    );
  }
}
