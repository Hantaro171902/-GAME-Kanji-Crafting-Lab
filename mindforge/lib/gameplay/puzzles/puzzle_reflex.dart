import 'dart:math';

import 'puzzle_controller.dart';
import 'puzzle_question.dart';

class ReflexPuzzleController extends PuzzleController {
  ReflexPuzzleController({required this.colorCount});

  final int colorCount;
  final Random _random = Random();
  late PuzzleQuestion _current;

  static const List<String> _colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Orange',
  ];

  @override
  PuzzleQuestion get current => _current;

  @override
  void generate() {
    final pool = _colors.take(colorCount).toList();
    final target = pool[_random.nextInt(pool.length)];
    final options = [...pool]..shuffle(_random);
    _current = PuzzleQuestion(
      prompt: 'Tap the $target item!',
      options: options,
      correctIndex: options.indexOf(target),
      explanation: 'You tapped $target.',
    );
  }
}