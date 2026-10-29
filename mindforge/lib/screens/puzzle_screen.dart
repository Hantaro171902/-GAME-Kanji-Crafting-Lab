import 'dart:async';

import 'package:flame/game.dart' show GameWidget;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_constants.dart';
import '../data/repositories/progress_repository.dart';
import '../gameplay/mindforge_game.dart';
import '../gameplay/puzzles/puzzle_controller.dart';
import '../gameplay/puzzles/puzzle_factory.dart';
import '../models/level_data.dart';
import '../widgets/hud_bar.dart';
import '../widgets/star_rating.dart';

class PuzzleScreen extends ConsumerStatefulWidget {
  const PuzzleScreen({super.key, required this.level});

  final LevelData level;

  @override
  ConsumerState<PuzzleScreen> createState() => _PuzzleScreenState();
}

class _PuzzleScreenState extends ConsumerState<PuzzleScreen> {
  late final PuzzleController _controller;
  late final MindForgeGame _game;
  Timer? _timer;
  int _timeLeft = 0;
  int _questionIndex = 0;
  int _correctCount = 0;
  int? _selectedIndex;
  int? _hintIndex;
  bool _finished = false;

  @override
  void initState() {
    super.initState();
    _controller = PuzzleFactory.create(widget.level);
    _controller.generate();
    _game = MindForgeGame();
    _timeLeft = widget.level.timeLimitSec;
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() {
        _timeLeft--;
        if (_timeLeft <= 0) _finish();
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _onAnswer(int index) {
    if (_finished || _selectedIndex != null) return;
    setState(() => _selectedIndex = index);
    final correct = _controller.checkAnswer(index);
    if (correct) {
      _correctCount++;
      _game.celebrate();
    } else {
      _game.frown();
    }
    Timer(const Duration(milliseconds: 950), () {
      if (!mounted) return;
      setState(() {
        _selectedIndex = null;
        _questionIndex++;
        if (_questionIndex >= AppConstants.questionsPerLevel) {
          _finish();
        } else {
          _controller.generate();
        }
      });
    });
  }

  void _useHint() {
    final profile = ref.read(profileProvider);
    if (profile == null ||
        profile.hintTokens < widget.level.hintCost ||
        _selectedIndex != null) {
      return;
    }
    final updated = profile.copyWith(
      hintTokens: profile.hintTokens - widget.level.hintCost,
    );
    ref.read(profileProvider.notifier).state = updated;
    ref.read(progressRepositoryProvider).save(updated);
    setState(() => _hintIndex = _controller.hintIndex());
    Timer(const Duration(milliseconds: 1400), () {
      if (mounted) setState(() => _hintIndex = null);
    });
  }

  void _finish() {
    if (_finished) return;
    _finished = true;
    _timer?.cancel();
    final profile = ref.read(profileProvider);
    if (profile == null) return;
    final stars = _computeStars();
    final previous = profile.starsForLevel(widget.level.id);
    final best = stars > previous ? stars : previous;
    final updated = profile.copyWith(
      starsByLevel: {...profile.starsByLevel, widget.level.id: best},
      totalStars: profile.totalStars + (best - previous),
      coins: profile.coins + stars,
    );
    ref.read(profileProvider.notifier).state = updated;
    ref.read(progressRepositoryProvider).save(updated);
    _showResult(stars, widget.level.shardsReward);
  }

  int _computeStars() {
    if (_correctCount >= AppConstants.threeStarThreshold) return 3;
    if (_correctCount >= AppConstants.twoStarThreshold) return 2;
    if (_correctCount >= AppConstants.oneStarThreshold) return 1;
    return 0;
  }

  void _showResult(int stars, int shards) {
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Level Complete'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            StarRating(count: stars, size: 40),
            const SizedBox(height: 12),
            Text(
              '$_correctCount / ${AppConstants.questionsPerLevel} correct',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              '+$shards shards earned',
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ],
        ),
        actions: [
          FilledButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              if (context.mounted) context.pop();
            },
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final question = _controller.current;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            HudBar(
              levelLabel: '${widget.level.category} · ${widget.level.title}',
              timeLeft: _timeLeft,
              questionIndex: _questionIndex,
              questionCount: AppConstants.questionsPerLevel,
              onPause: () => _pause(),
            ),
            SizedBox(
              height: 130,
              width: double.infinity,
              child: GameWidget(game: _game),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Text(
                          question.prompt,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            height: 1.5,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    ...List.generate(question.options.length, (i) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _optionButton(i, question.options[i]),
                      );
                    }),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.center,
                      child: TextButton.icon(
                        onPressed: _useHint,
                        icon: const Icon(Icons.lightbulb_outline_rounded),
                        label: const Text('Hint'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _optionButton(int index, String label) {
    Color? border;
    Color? background;
    if (_selectedIndex == index) {
      final correct = _controller.checkAnswer(index);
      border = correct ? const Color(0xFF2E7D32) : const Color(0xFFC62828);
      background = correct
          ? const Color(0xFF2E7D32).withValues(alpha: 0.12)
          : const Color(0xFFC62828).withValues(alpha: 0.12);
    } else if (_hintIndex == index) {
      border = const Color(0xFFFFB300);
      background = const Color(0xFFFFB300).withValues(alpha: 0.14);
    }
    return OutlinedButton(
      onPressed: () => _onAnswer(index),
      style: OutlinedButton.styleFrom(
        minimumSize: const Size.fromHeight(52),
        side: border != null
            ? BorderSide(color: border, width: 2.5)
            : BorderSide(color: Colors.grey.shade300),
        backgroundColor: background,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        textStyle: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
      ),
      child: Text(label),
    );
  }

  void _pause() {
    _timer?.cancel();
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Paused'),
        content: const Text('Take a breath, then continue.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              _resume();
            },
            child: const Text('Resume'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              if (context.mounted) context.pop();
            },
            child: const Text('Quit'),
          ),
        ],
      ),
    );
  }

  void _resume() {
    if (_finished) return;
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() {
        _timeLeft--;
        if (_timeLeft <= 0) _finish();
      });
    });
  }
}