import 'dart:math';

import 'puzzle_controller.dart';
import 'puzzle_question.dart';

class PatternPuzzleController extends PuzzleController {
  PatternPuzzleController({required this.maxStart});

  final int maxStart;
  final Random _random = Random();
  late PuzzleQuestion _current;

  @override
  PuzzleQuestion get current => _current;

  @override
  void generate() {
    final start = _random.nextInt(maxStart) + 1;
    final step = _random.nextInt(4) + 1;
    final sequence = List.generate(4, (i) => start + step * i);
    final answer = sequence.last + step;
    final options = _buildOptions(answer, step);
    _current = PuzzleQuestion(
      prompt: 'What comes next?\n${sequence.join(', ')}, ?',
      options: options.map((v) => '$v').toList(),
      correctIndex: options.indexOf(answer),
      explanation: 'Add $step each step: $answer.',
    );
  }

  List<int> _buildOptions(int answer, int step) {
    final options = <int>{answer};
    for (final delta in [-step, step, -step * 2, step * 2]) {
      if (answer + delta >= 0) options.add(answer + delta);
    }
    var guard = 0;
    while (options.length < 4 && guard < 50) {
      guard++;
      final extra = answer + _random.nextInt(step * 3 + 1) - step;
      if (extra >= 0) options.add(extra);
    }
    return options.toList()..shuffle(_random);
  }
}