import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/repositories/progress_repository.dart';
import '../data/kanji_strings.dart';
import '../theme/kanji_palette.dart';
import '../widgets/kanji_game_button.dart';

class KanjiBentoMenuScreen extends ConsumerWidget {
  const KanjiBentoMenuScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(profileProvider)?.language ?? 'en';
    final strings = KanjiStrings(language);
    return Scaffold(
      backgroundColor: KanjiPalette.canvas,
      body: SafeArea(
        child: Stack(
          children: [
            const Positioned.fill(child: _WoodTable()),
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: _RoundIconButton(
                  icon: Icons.settings_rounded,
                  label: strings.text('settings'),
                  onTap: () => context.push('/kanji-bento/settings'),
                ),
              ),
            ),
            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 76, 24, 28),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 480),
                  child: Column(
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 24),
                        decoration: KanjiPalette.panel(color: KanjiPalette.cream, radius: 26),
                        child: Column(
                          children: [
                            Text(strings.text('subtitle'), style: const TextStyle(color: KanjiPalette.inkSoft, fontWeight: FontWeight.w800, letterSpacing: 2)),
                            const SizedBox(height: 3),
                            Text(strings.text('title'), textAlign: TextAlign.center, style: const TextStyle(color: KanjiPalette.ink, fontSize: 38, fontWeight: FontWeight.w900, height: 1.15)),
                            const SizedBox(height: 5),
                            const Text('漢字べんとう', style: TextStyle(color: KanjiPalette.inkSoft, fontSize: 21, letterSpacing: 3, fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 26),
                      const _BentoPreview(),
                      const SizedBox(height: 28),
                      SizedBox(
                        width: double.infinity,
                        child: KanjiGameButton(label: '${strings.text('play')} · あそぶ', icon: Icons.play_arrow_rounded, onPressed: () => context.push('/kanji-bento/play')),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: KanjiGameButton(label: strings.text('components'), icon: Icons.grid_view_rounded, secondary: true, onPressed: () => context.push('/kanji-bento/components')),
                      ),
                      const SizedBox(height: 18),
                      Text(strings.text('level'), textAlign: TextAlign.center, style: const TextStyle(color: KanjiPalette.inkSoft, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _WoodTable extends StatelessWidget {
  const _WoodTable();

  @override
  Widget build(BuildContext context) => CustomPaint(painter: _WoodTablePainter());
}

class _WoodTablePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFEDC18D);
    canvas.drawRect(Offset.zero & size, paint);
    final line = Paint()..color = const Color(0xFFD5A46F)..strokeWidth = 3;
    for (var y = 30.0; y < size.height; y += 96) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), line);
    }
    final stripe = Paint()..color = Colors.white.withValues(alpha: .07);
    for (var x = 20.0; x < size.width; x += 80) {
      canvas.drawRect(Rect.fromLTWH(x, 0, 3, size.height), stripe);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _BentoPreview extends StatelessWidget {
  const _BentoPreview();

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(14),
        decoration: KanjiPalette.panel(color: KanjiPalette.coral, radius: 28),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _PreviewTile(glyph: '亻', width: 84),
            SizedBox(width: 10),
            _PreviewTile(glyph: '木', width: 112),
          ],
        ),
      );
}

class _PreviewTile extends StatelessWidget {
  const _PreviewTile({required this.glyph, required this.width});
  final String glyph;
  final double width;

  @override
  Widget build(BuildContext context) => Container(
        width: width,
        height: 105,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: KanjiPalette.paper,
          borderRadius: BorderRadius.circular(17),
          border: Border.all(color: KanjiPalette.ink, width: 2.3),
          boxShadow: const [BoxShadow(color: KanjiPalette.green, offset: Offset(0, 5), blurRadius: 0)],
        ),
        child: Text(glyph, style: const TextStyle(color: KanjiPalette.ink, fontSize: 56)),
      );
}

class _RoundIconButton extends StatelessWidget {
  const _RoundIconButton({required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Tooltip(
        message: label,
        child: Material(
          color: KanjiPalette.teal,
          shape: const CircleBorder(side: BorderSide(color: KanjiPalette.ink, width: 2)),
          child: InkWell(
            customBorder: const CircleBorder(),
            onTap: onTap,
            child: Padding(padding: const EdgeInsets.all(13), child: Icon(icon, color: Colors.white, size: 24)),
          ),
        ),
      );
}
