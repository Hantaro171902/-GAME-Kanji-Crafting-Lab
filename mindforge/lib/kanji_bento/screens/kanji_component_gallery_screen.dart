import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../data/kanji_catalog.dart';
import '../theme/kanji_palette.dart';
import '../widgets/kanji_game_button.dart';
import '../widgets/kanji_piece_tile.dart';

class KanjiComponentGalleryScreen extends StatelessWidget {
  const KanjiComponentGalleryScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: KanjiPalette.canvas,
        appBar: AppBar(
          backgroundColor: KanjiPalette.canvas,
          foregroundColor: KanjiPalette.ink,
          title: const Text('Game pieces & UI', style: TextStyle(fontWeight: FontWeight.w900)),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 28),
          children: [
            const Text('KANJI BENTO · STYLE GUIDE', style: TextStyle(color: KanjiPalette.woodDark, fontSize: 11, letterSpacing: 1.4, fontWeight: FontWeight.w900)),
            const SizedBox(height: 6),
            const Text('A small shelf of the pieces that make the game.', style: TextStyle(color: KanjiPalette.ink, fontSize: 19, fontWeight: FontWeight.w900)),
            const SizedBox(height: 20),
            _section('Color palette · いろ'),
            const SizedBox(height: 10),
            const Wrap(spacing: 9, runSpacing: 9, children: [
              _ColorSwatch(name: 'Paper', color: KanjiPalette.paper),
              _ColorSwatch(name: 'Wood', color: KanjiPalette.wood),
              _ColorSwatch(name: 'Ink', color: KanjiPalette.ink),
              _ColorSwatch(name: 'Teal', color: KanjiPalette.teal),
              _ColorSwatch(name: 'Coral', color: KanjiPalette.coral),
              _ColorSwatch(name: 'Bento yellow', color: KanjiPalette.yellow),
              _ColorSwatch(name: 'Leaf', color: KanjiPalette.green),
            ]),
            const SizedBox(height: 22),
            _section('Buttons · ボタン'),
            const SizedBox(height: 12),
            KanjiGameButton(label: 'Play · あそぶ', icon: Icons.play_arrow_rounded, onPressed: () => context.push('/kanji-bento/play')),
            const SizedBox(height: 14),
            KanjiGameButton(label: 'Secondary action', icon: Icons.grid_view_rounded, secondary: true, onPressed: () => _showDialog(context)),
            const SizedBox(height: 22),
            _section('Mahjong-like pieces · パーツ'),
            const SizedBox(height: 10),
            SizedBox(
              height: 92,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: KanjiCatalog.pieces.length,
                separatorBuilder: (_, __) => const SizedBox(width: 9),
                itemBuilder: (context, index) => KanjiPieceTile(piece: KanjiCatalog.pieces[index], selected: index == 1, onTap: () {}),
              ),
            ),
            const SizedBox(height: 8),
            const Text('Tap to select; drag or tap an empty bento space to place. A used piece can be moved.', style: TextStyle(color: KanjiPalette.inkSoft, fontSize: 12, height: 1.4)),
            const SizedBox(height: 22),
            _section('Bento spaces · おべんとう'),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: KanjiPalette.panel(color: KanjiPalette.coral, radius: 21),
              child: Row(children: [
                Expanded(child: _slot('亻', filled: true)),
                const SizedBox(width: 7),
                Expanded(child: _slot('tree', filled: false)),
              ]),
            ),
            const SizedBox(height: 22),
            _section('Feedback · はんのう'),
            const SizedBox(height: 10),
            _feedback(Icons.check_circle_rounded, 'Correct · Nicely pieced together!', KanjiPalette.tealPale, KanjiPalette.green),
            const SizedBox(height: 8),
            _feedback(Icons.favorite_rounded, 'Not quite · Try another combination.', const Color(0xFFFFE6D9), KanjiPalette.coral),
            const SizedBox(height: 22),
            _section('Learning card · まなび'),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: KanjiPalette.panel(color: KanjiPalette.paper, radius: 20),
              child: Row(children: [Container(width: 58, height: 58, alignment: Alignment.center, decoration: BoxDecoration(color: KanjiPalette.tealPale, borderRadius: BorderRadius.circular(14)), child: const Text('休', style: TextStyle(fontSize: 39, color: KanjiPalette.ink))), const SizedBox(width: 12), const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('rest · take a break', style: TextStyle(color: KanjiPalette.ink, fontWeight: FontWeight.w900)), Text('きゅう · kyū  /  やすむ · yasumu', style: TextStyle(color: KanjiPalette.inkSoft, fontSize: 12)), Text('6 strokes · 亻 + 木', style: TextStyle(color: KanjiPalette.teal, fontSize: 12, fontWeight: FontWeight.w800))]))]),
            ),
            const SizedBox(height: 22),
            _section('Typography · 文字'),
            const SizedBox(height: 8),
            const Text('Kanji Bento', style: TextStyle(color: KanjiPalette.ink, fontSize: 32, fontWeight: FontWeight.w900)),
            const Text('漢字べんとう · 休む · 休日', style: TextStyle(color: KanjiPalette.inkSoft, fontSize: 20, fontWeight: FontWeight.w700)),
          ],
        ),
      );

  static Widget _section(String title) => Text(title, style: const TextStyle(color: KanjiPalette.ink, fontSize: 16, fontWeight: FontWeight.w900));

  static Widget _slot(String label, {required bool filled}) => Container(
        height: 82,
        alignment: Alignment.center,
        decoration: BoxDecoration(color: KanjiPalette.paper, borderRadius: BorderRadius.circular(15), border: Border.all(color: KanjiPalette.woodDark, width: 1.5)),
        child: Text(label, style: TextStyle(color: filled ? KanjiPalette.ink : KanjiPalette.woodDark, fontSize: filled ? 42 : 12, fontWeight: FontWeight.w700)),
      );

  static Widget _feedback(IconData icon, String text, Color background, Color accent) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 12),
        decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(16)),
        child: Row(children: [Icon(icon, color: accent, size: 19), const SizedBox(width: 8), Expanded(child: Text(text, style: TextStyle(color: accent, fontSize: 12, fontWeight: FontWeight.w800)))]),
      );

  static void _showDialog(BuildContext context) => showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: KanjiPalette.paper,
          title: const Text('A little discovery!'),
          content: const Text('This is the friendly confirmation style used in Kanji Bento.'),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Got it'))],
        ),
      );
}

class _ColorSwatch extends StatelessWidget {
  const _ColorSwatch({required this.name, required this.color});
  final String name;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
        width: 92,
        padding: const EdgeInsets.all(7),
        decoration: BoxDecoration(color: KanjiPalette.paper, borderRadius: BorderRadius.circular(13)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Container(height: 35, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8), border: Border.all(color: KanjiPalette.ink.withValues(alpha: .2)))), const SizedBox(height: 5), Text(name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 10, fontWeight: FontWeight.w700))]),
      );
}
