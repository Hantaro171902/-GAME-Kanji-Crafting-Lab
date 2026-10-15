import 'dart:math' as math;
import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/repositories/progress_repository.dart';
import '../data/kanji_card.dart';
import '../data/kanji_catalog.dart';
import '../data/kanji_strings.dart';
import '../theme/kanji_palette.dart';
import '../widgets/kanji_game_button.dart';
import '../widgets/kanji_piece_tile.dart';
import '../widgets/kanji_scene_art.dart';

class KanjiGameScreen extends ConsumerStatefulWidget {
  const KanjiGameScreen({super.key});

  @override
  ConsumerState<KanjiGameScreen> createState() => _KanjiGameScreenState();
}

class _KanjiGameScreenState extends ConsumerState<KanjiGameScreen>
    with SingleTickerProviderStateMixin {
  int _cardIndex = 0;
  bool _revealed = false;
  String? _selectedPieceId;
  List<KanjiPiece?> _placements = [];
  bool _incorrect = false;
  late final AnimationController _shakeController;

  KanjiCard get _card => KanjiCatalog.levelOne[_cardIndex];

  @override
  void initState() {
    super.initState();
    _placements = List<KanjiPiece?>.filled(_card.parts.length, null);
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 430),
    );
  }

  @override
  void dispose() {
    _shakeController.dispose();
    super.dispose();
  }

  void _selectPiece(KanjiPiece piece) {
    if (!_revealed) return;
    setState(() {
      final previousSlot = _placements.indexWhere((item) => item?.id == piece.id);
      if (previousSlot >= 0) _placements[previousSlot] = null;
      _selectedPieceId = _selectedPieceId == piece.id ? null : piece.id;
      _incorrect = false;
    });
    _feedbackTick();
  }

  void _placePiece(int slot, KanjiPiece piece) {
    if (!_revealed || slot < 0 || slot >= _placements.length) return;
    setState(() {
      final previousSlot = _placements.indexWhere((item) => item?.id == piece.id);
      if (previousSlot >= 0) _placements[previousSlot] = null;
      _placements[slot] = piece;
      _selectedPieceId = null;
      _incorrect = false;
    });
    _feedbackTick();
  }

  void _tapSlot(int slot) {
    if (!_revealed) return;
    final selected = KanjiCatalog.pieces.where((p) => p.id == _selectedPieceId);
    if (selected.isNotEmpty) {
      _placePiece(slot, selected.first);
      return;
    }
    setState(() {
      _placements[slot] = null;
      _incorrect = false;
    });
  }

  Future<void> _feedbackTick() async {
    final profile = ref.read(profileProvider);
    if (profile?.hapticsOn ?? false) await HapticFeedback.selectionClick();
    if ((profile?.soundOn ?? false) && (profile?.soundVolume ?? 0) > 0) {
      await SystemSound.play(SystemSoundType.click);
    }
  }

  Future<void> _checkAnswer() async {
    if (_placements.any((piece) => piece == null)) {
      final strings = KanjiStrings(ref.read(profileProvider)?.language ?? 'en');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.text('completeSlots')),
          behavior: SnackBarBehavior.floating,
          backgroundColor: KanjiPalette.ink,
        ),
      );
      return;
    }
    final isCorrect = List.generate(_card.parts.length, (i) => _placements[i]!.glyph)
        .join() == _card.parts.map((part) => part.glyph).join();
    final profile = ref.read(profileProvider);
    final strings = KanjiStrings(profile?.language ?? 'en');
    if (!isCorrect) {
      setState(() => _incorrect = true);
      _shakeController.forward(from: 0);
      if (profile?.hapticsOn ?? false) await HapticFeedback.mediumImpact();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.text('tryAgain')),
          behavior: SnackBarBehavior.floating,
          backgroundColor: KanjiPalette.ink,
        ),
      );
      return;
    }
    if (profile?.hapticsOn ?? false) await HapticFeedback.mediumImpact();
    if (!mounted) return;
    await _showLearningCard();
  }

  Future<void> _showLearningCard() async {
    final completed = _cardIndex == KanjiCatalog.levelOne.length - 1;
    final next = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _LearningSheet(
        card: _card,
        language: ref.read(profileProvider)?.language ?? 'en',
        showFurigana: ref.read(profileProvider)?.showFurigana ?? true,
        completed: completed,
      ),
    );
    if (!mounted || next != true) return;
    if (completed) {
      context.go('/kanji-bento');
      return;
    }
    setState(() {
      _cardIndex++;
      _revealed = false;
      _selectedPieceId = null;
      _placements = List<KanjiPiece?>.filled(_card.parts.length, null);
      _incorrect = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(profileProvider)?.language ?? 'en';
    final strings = KanjiStrings(language);
    final pieceIdsInSlots = _placements.whereType<KanjiPiece>().map((p) => p.id).toSet();
    final width = MediaQuery.sizeOf(context).width;
    return Scaffold(
      backgroundColor: KanjiPalette.paper,
      body: SafeArea(
        child: Column(
          children: [
            _GameHeader(
              cardIndex: _cardIndex,
              count: KanjiCatalog.levelOne.length,
              language: language,
              onBack: () => context.pop(),
              onSettings: () => context.push('/kanji-bento/settings'),
            ),
            _LevelRibbon(cardIndex: _cardIndex, language: language),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(18, 12, 18, 14),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 560),
                    child: Column(
                      children: [
                        _PictureCard(
                          card: _card,
                          revealed: _revealed,
                          onReveal: () {
                            setState(() => _revealed = true);
                            _feedbackTick();
                          },
                          revealLabel: strings.text('reveal'),
                          questionLabel: strings.text('question'),
                          language: language,
                        ),
                        // Removed accidental learning-sheet content
                        _BentoBoard(
                          card: _card,
                          placements: _placements,
                          onAccept: _placePiece,
                          onTapSlot: _tapSlot,
                          width: width,
                          wrong: _incorrect,
                          shake: _shakeController,
                        ),
                        const SizedBox(height: 7),
                        Text(
                            _revealed ? strings.text('tapPlace') : strings.text('revealHint'),
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                        if (_incorrect) ...[
                          const SizedBox(height: 10),
                          _FeedbackPill(label: strings.text('almost'), success: false),
                        ],
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                            child: KanjiGameButton(
                            key: const ValueKey('kanji-primary-action'),
                            label: _revealed ? strings.text('check') : strings.text('reveal'),
                            icon: _revealed ? Icons.check_rounded : Icons.flip_rounded,
                            onPressed: _revealed ? _checkAnswer : () => setState(() => _revealed = true),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            _PieceTray(
              pieces: KanjiCatalog.pieces,
              placedIds: pieceIdsInSlots,
              selectedId: _selectedPieceId,
              onSelect: _selectPiece,
              strings: strings,
              language: language,
            ),
          ],
        ),
      ),
    );
  }
}

class _GameHeader extends StatelessWidget {
  const _GameHeader({required this.cardIndex, required this.count, required this.language, required this.onBack, required this.onSettings});
  final int cardIndex;
  final int count;
  final String language;
  final VoidCallback onBack;
  final VoidCallback onSettings;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(10, 3, 10, 7),
        child: Row(
          children: [
            IconButton(tooltip: 'Back to Kanji Bento', onPressed: onBack, icon: const Icon(Icons.arrow_back_rounded, color: KanjiPalette.ink)),
            const CircleAvatar(radius: 19, backgroundColor: Color(0xFFB6E7E8), child: Text('茶', style: TextStyle(color: KanjiPalette.teal, fontWeight: FontWeight.w900))),
            const SizedBox(width: 10),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(language == 'ja' ? '漢字べんとう' : '漢字べんとう', style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 11)),
                Text(language == 'ja' ? '木もれび' : language == 'vi' ? 'Bóng cây nhỏ' : 'A little shade', style: const TextStyle(color: KanjiPalette.ink, fontSize: 17, fontWeight: FontWeight.w900)),
              ]),
            ),
            IconButton(tooltip: 'Settings', onPressed: onSettings, icon: const Icon(Icons.settings_rounded, color: KanjiPalette.teal)),
          ],
        ),
      );
}

class _LevelRibbon extends StatelessWidget {
  const _LevelRibbon({required this.cardIndex, required this.language});
  final int cardIndex;
  final String language;

  @override
  Widget build(BuildContext context) {
    final current = language == 'ja' ? 'レベル1 · 木もれび' : language == 'vi' ? 'MÀN 1 · BÓNG CÂY' : 'LEVEL 1 · 木もれび';
    return Container(
      color: const Color(0xFFE7C99E),
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 12),
      child: Column(
        children: [
          Row(children: [Expanded(child: Text(current, style: const TextStyle(color: KanjiPalette.ink, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: .3))), Text('${language == 'ja' ? '絵' : language == 'vi' ? 'Tranh' : 'Picture'} ${cardIndex + 1} / ${KanjiCatalog.levelOne.length}', style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 11))]),
          const SizedBox(height: 8),
          ClipRRect(borderRadius: BorderRadius.circular(5), child: LinearProgressIndicator(value: (cardIndex + 1) / KanjiCatalog.levelOne.length, minHeight: 4, backgroundColor: KanjiPalette.paper, valueColor: const AlwaysStoppedAnimation(KanjiPalette.teal))),
        ],
      ),
    );
  }
}

class _PictureCard extends StatelessWidget {
  const _PictureCard({required this.card, required this.revealed, required this.onReveal, required this.revealLabel, required this.questionLabel, required this.language});
  final KanjiCard card;
  final bool revealed;
  final VoidCallback onReveal;
  final String revealLabel;
  final String questionLabel;
  final String language;

  @override
  Widget build(BuildContext context) => Column(
        children: [
          SizedBox(
            width: math.min(MediaQuery.sizeOf(context).width - 54, 270).toDouble(),
            height: 220,
            child: TweenAnimationBuilder<double>(
              key: ValueKey('${card.id}-$revealed'),
              tween: Tween(begin: 0, end: revealed ? 1 : 0),
              duration: const Duration(milliseconds: 540),
              curve: Curves.easeOutCubic,
              builder: (context, progress, _) {
                final showFront = progress >= .5;
                final rotation = showFront ? math.pi * (progress - 1) : math.pi * progress;
                return Transform(
                  alignment: Alignment.center,
                  transform: Matrix4.identity()..setEntry(3, 2, .001)..rotateY(rotation),
                  child: showFront
                      ? _PictureFront(card: card, language: language)
                      : _PictureBack(onReveal: onReveal, revealLabel: revealLabel),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          Text(revealed ? card.sceneHintFor(language) : (language == 'ja' ? '絵が待っているよ' : language == 'vi' ? 'Một bức tranh đang chờ bạn' : 'A picture is waiting for you.'), textAlign: TextAlign.center, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12)),
          if (revealed) ...[
            const SizedBox(height: 4),
            Text(questionLabel, style: const TextStyle(color: KanjiPalette.ink, fontSize: 15, fontWeight: FontWeight.w900)),
          ],
        ],
      );
}

class _PictureBack extends StatelessWidget {
  const _PictureBack({required this.onReveal, required this.revealLabel});
  final VoidCallback onReveal;
  final String revealLabel;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onReveal,
          child: Stack(
            children: [
              Positioned.fill(
                left: 10,
                top: 8,
                right: 0,
                bottom: 0,
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8D8B8),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: KanjiPalette.woodDark, width: 1.5),
                  ),
                ),
              ),
              Positioned.fill(
                left: 5,
                top: 4,
                right: 3,
                bottom: 3,
                child: Container(
                  decoration: BoxDecoration(
                    color: KanjiPalette.cream,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: KanjiPalette.woodDark, width: 1.5),
                  ),
                ),
              ),
              Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: KanjiPalette.paper, borderRadius: BorderRadius.circular(24), border: Border.all(color: KanjiPalette.ink, width: 2), boxShadow: const [BoxShadow(color: KanjiPalette.wood, offset: Offset(0, 5), blurRadius: 0)]),
          child: Container(
            decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFDEF0EF), Color(0xFFCBE5E5)]), borderRadius: BorderRadius.circular(18), border: Border.all(color: Colors.white, width: 3)),
            child: Stack(
              children: [
                Positioned.fill(child: CustomPaint(painter: _CardLinesPainter())),
                Center(child: Container(width: 82, height: 82, alignment: Alignment.center, decoration: BoxDecoration(color: KanjiPalette.paper, shape: BoxShape.circle, border: Border.all(color: KanjiPalette.teal, width: 1.5)), child: const Text('弁', style: TextStyle(color: KanjiPalette.teal, fontSize: 42, fontWeight: FontWeight.w500)))),
                Positioned(left: 0, right: 0, bottom: 11, child: Text(revealLabel, textAlign: TextAlign.center, style: const TextStyle(color: KanjiPalette.inkSoft, fontWeight: FontWeight.w800, fontSize: 13))),
              ],
            ),
          ),
          ),
          ],
        ),
      );
}

class _PictureFront extends StatelessWidget {
  const _PictureFront({required this.card, required this.language});
  final KanjiCard card;
  final String language;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: KanjiPalette.paper, borderRadius: BorderRadius.circular(23), border: Border.all(color: KanjiPalette.ink, width: 2), boxShadow: const [BoxShadow(color: KanjiPalette.wood, offset: Offset(0, 5), blurRadius: 0)]),
        child: KanjiSceneArt(card: card, language: language),
      );
}

class _CardLinesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white.withValues(alpha: .52)..strokeWidth = 1.4;
    for (var x = 18.0; x < size.width; x += 30) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _BentoBoard extends StatelessWidget {
  const _BentoBoard({required this.card, required this.placements, required this.onAccept, required this.onTapSlot, required this.width, required this.wrong, required this.shake});
  final KanjiCard card;
  final List<KanjiPiece?> placements;
  final void Function(int, KanjiPiece) onAccept;
  final ValueChanged<int> onTapSlot;
  final double width;
  final bool wrong;
  final Animation<double> shake;

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: shake,
        builder: (context, child) {
          final offset = wrong ? math.sin(shake.value * math.pi * 8) * 7 * (1 - shake.value) : 0.0;
          return Transform.translate(offset: Offset(offset, 0), child: child);
        },
        child: Container(
          width: math.min(width - 52, 430).toDouble(),
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: KanjiPalette.coral, borderRadius: BorderRadius.circular(25), border: Border.all(color: KanjiPalette.ink, width: 2.5), boxShadow: const [BoxShadow(color: KanjiPalette.ink, offset: Offset(0, 5), blurRadius: 0)]),
          child: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: const Color(0xFFF6E3BD), borderRadius: BorderRadius.circular(18), border: Border.all(color: KanjiPalette.ink, width: 2)),
            child: Row(
              children: List.generate(card.parts.length, (index) {
                final placed = placements[index];
                return Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(left: index == 0 ? 0 : 5),
                    child: DragTarget<KanjiPiece>(
                      onWillAcceptWithDetails: (_) => true,
                      onAcceptWithDetails: (details) => onAccept(index, details.data),
                      builder: (context, candidates, rejected) {
                        final isHovering = candidates.isNotEmpty;
                        return GestureDetector(
                          key: ValueKey('kanji-slot-$index'),
                          onTap: () => onTapSlot(index),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            height: 92,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: placed == null ? const Color(0xFFFFFCF4) : KanjiPalette.cream,
                              borderRadius: BorderRadius.circular(15),
                              border: Border.all(color: isHovering ? KanjiPalette.teal : KanjiPalette.woodDark, width: isHovering ? 3 : 1.6, style: placed == null ? BorderStyle.solid : BorderStyle.solid),
                              boxShadow: placed == null ? null : const [BoxShadow(color: KanjiPalette.green, offset: Offset(0, 4), blurRadius: 0)],
                            ),
                            child: placed == null
                                ? Column(mainAxisAlignment: MainAxisAlignment.center, children: [Text('${index + 1}', style: const TextStyle(color: Color(0xFFBDAA88), fontSize: 11, fontWeight: FontWeight.w800)), Text(card.parts[index].hint, style: const TextStyle(color: Color(0xFFBDAA88), fontSize: 9))])
                                : Text(placed.glyph, style: const TextStyle(color: KanjiPalette.ink, fontSize: 44, height: 1)),
                          ),
                        );
                      },
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      );
}

class _PieceTray extends StatelessWidget {
  const _PieceTray({required this.pieces, required this.placedIds, required this.selectedId, required this.onSelect, required this.strings, required this.language});
  final List<KanjiPiece> pieces;
  final Set<String> placedIds;
  final String? selectedId;
  final ValueChanged<KanjiPiece> onSelect;
  final KanjiStrings strings;
  final String language;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.fromLTRB(18, 11, 18, 12),
        decoration: const BoxDecoration(color: Color(0xFFEAF4EF), border: Border(top: BorderSide(color: Color(0xFFD2E4DC), width: 1.5))),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(children: [Expanded(child: Text(strings.text('choose'), style: const TextStyle(color: KanjiPalette.ink, fontSize: 12, fontWeight: FontWeight.w800))), Text('1–${pieces.length} / ${pieces.length} →', style: const TextStyle(color: KanjiPalette.teal, fontSize: 11, fontWeight: FontWeight.w800))]),
              const SizedBox(height: 9),
              SizedBox(
                height: 78,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: pieces.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final piece = pieces[index];
                    return Opacity(
                      opacity: placedIds.contains(piece.id) ? .55 : 1,
                      child: KanjiPieceTile(key: ValueKey('kanji-piece-${piece.id}'), piece: piece, selected: selectedId == piece.id, onTap: () => onSelect(piece)),
                    );
                  },
                ),
              ),
              const SizedBox(height: 4),
              Text(language == 'ja' ? '左右にスワイプしてパーツをさがそう' : language == 'vi' ? 'Vuốt ngang để xem thêm mảnh ghép' : 'Swipe sideways to find all 10 pieces', style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 10)),
            ],
        ),
      ),
    );
}

class _LearningSheet extends StatelessWidget {
  const _LearningSheet({required this.card, required this.language, required this.showFurigana, required this.completed});
  final KanjiCard card;
  final String language;
  final bool showFurigana;
  final bool completed;

  @override
  Widget build(BuildContext context) {
    final strings = KanjiStrings(language);
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 9, sigmaY: 9),
        child: Container(
          constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * .91),
          decoration: BoxDecoration(color: KanjiPalette.paper, border: Border.all(color: KanjiPalette.ink.withValues(alpha: .35)), borderRadius: const BorderRadius.vertical(top: Radius.circular(28))),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 15, 18, 8),
                child: Row(children: [const Icon(Icons.check_circle_outline_rounded, color: KanjiPalette.green), const SizedBox(width: 8), Expanded(child: Text(language == 'ja' ? '正解！きれいにできたね。' : language == 'vi' ? 'Chính xác! Ghép thật đẹp.' : 'Correct! Nicely pieced together.', style: const TextStyle(color: KanjiPalette.green, fontWeight: FontWeight.w900))), IconButton(tooltip: 'Close', onPressed: () => Navigator.of(context).pop(false), icon: const Icon(Icons.close_rounded, color: KanjiPalette.teal))]),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 4, 20, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Container(width: 82, height: 82, alignment: Alignment.center, decoration: BoxDecoration(color: const Color(0xFFE6EDD9), borderRadius: BorderRadius.circular(18)), child: Text(card.kanji, style: const TextStyle(color: KanjiPalette.ink, fontSize: 56, height: 1))),
                        const SizedBox(width: 15),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(card.meaningFor(language), style: const TextStyle(color: KanjiPalette.ink, fontSize: 24, fontWeight: FontWeight.w900)), const SizedBox(height: 3), Text('${card.onReading}  ·  ${card.kunReading}', style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12, height: 1.5)), Text('${card.strokeCount} strokes · ${card.strokeCount} 画', style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 11)), const SizedBox(height: 4), Text('Composition: ${card.parts.map((part) => part.glyph).join(' + ')}', style: const TextStyle(color: KanjiPalette.teal, fontSize: 12, fontWeight: FontWeight.w700))])),
                      ]),
                      const SizedBox(height: 12),
                      Container(width: double.infinity, padding: const EdgeInsets.all(13), decoration: BoxDecoration(color: KanjiPalette.tealPale, borderRadius: BorderRadius.circular(15)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('${strings.text('reading')} · ${card.onReading}', style: const TextStyle(color: KanjiPalette.ink, fontSize: 12, fontWeight: FontWeight.w800)), const SizedBox(height: 4), Text(card.componentNoteFor(language), style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12, height: 1.4))])),
                      const SizedBox(height: 13),
                      Row(children: [Expanded(child: Text('${strings.text('write')} · 書いてみよう', style: const TextStyle(color: KanjiPalette.ink, fontWeight: FontWeight.w900, fontSize: 14))), Text('${card.strokeCount} strokes', style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 11))]),
                      const SizedBox(height: 7),
                      Wrap(spacing: 6, runSpacing: 6, children: List.generate(card.strokeSteps.length, (index) => _StrokeStep(number: index + 1, text: card.strokeSteps[index]))),
                      const SizedBox(height: 14),
                      Text('${strings.text('words')} · ことば', style: const TextStyle(color: KanjiPalette.ink, fontWeight: FontWeight.w900, fontSize: 14)),
                      const SizedBox(height: 5),
                      ...card.vocabulary.map((word) => Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(children: [Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(word.word, style: const TextStyle(color: KanjiPalette.ink, fontWeight: FontWeight.w800)), if (showFurigana) Text(word.reading, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 11))])), const SizedBox(width: 8), Text(word.meanings[language] ?? word.meanings['en']!, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12))]))),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                child: SizedBox(width: double.infinity, child: KanjiGameButton(label: completed ? strings.text('done') : '${strings.text('next')} · つぎへ', icon: completed ? Icons.celebration_rounded : Icons.arrow_forward_rounded, onPressed: () => Navigator.of(context).pop(true))),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StrokeStep extends StatelessWidget {
  const _StrokeStep({required this.number, required this.text});
  final int number;
  final String text;

  @override
  Widget build(BuildContext context) => Container(
        width: (MediaQuery.sizeOf(context).width - 52) / 2,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 7),
        decoration: BoxDecoration(color: KanjiPalette.cream, borderRadius: BorderRadius.circular(10), border: Border.all(color: KanjiPalette.wood.withValues(alpha: .6))),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [Container(width: 18, height: 18, alignment: Alignment.center, decoration: const BoxDecoration(color: KanjiPalette.yellow, shape: BoxShape.circle), child: Text('$number', style: const TextStyle(color: KanjiPalette.ink, fontSize: 10, fontWeight: FontWeight.w900))), const SizedBox(width: 6), Expanded(child: Text(text, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 10, height: 1.25)))]),
      );
}

class _FeedbackPill extends StatelessWidget {
  const _FeedbackPill({required this.label, required this.success});
  final String label;
  final bool success;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 8),
        decoration: BoxDecoration(color: success ? KanjiPalette.tealPale : const Color(0xFFFFE6D9), borderRadius: BorderRadius.circular(30)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [Icon(success ? Icons.check_circle_rounded : Icons.favorite_rounded, size: 16, color: success ? KanjiPalette.green : KanjiPalette.coral), const SizedBox(width: 6), Text(label, style: TextStyle(color: success ? KanjiPalette.green : KanjiPalette.inkSoft, fontSize: 11, fontWeight: FontWeight.w800))]),
      );
}
