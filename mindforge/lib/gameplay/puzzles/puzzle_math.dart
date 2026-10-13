import 'dart:math';

import 'puzzle_controller.dart';
import 'puzzle_question.dart';

class MathPuzzleController extends PuzzleController {
  MathPuzzleController({required this.maxValue});

  final int maxValue;
  final Random _random = Random();
  late PuzzleQuestion _current;

  @override
  PuzzleQuestion get current => _current;

  @override
  void generate() {
    final a = _random.nextInt(maxValue) + 1;
    final b = _random.nextInt(maxValue) + 1;
    final op = _operators[_random.nextInt(_operators.length)];
    final answer = _apply(op, a, b);
    final options = _buildOptions(answer);
    _current = PuzzleQuestion(
      prompt: '$a $op $b = ?',
      options: options.map((v) => '$v').toList(),
      correctIndex: options.indexOf(answer),
      explanation: '$a $op $b = $answer',
    );
  }

  static const List<String> _operators = ['+', '-', 'x'];

  int _apply(String op, int a, int b) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a >= b ? a - b : b - a;
      default:
        return a * b;
    }
  }

  List<int> _buildOptions(int answer) {
    final options = <int>{answer};
    var guard = 0;
    while (options.length < 4 && guard < 100) {
      guard++;
      final delta = _random.nextInt(5) + 1;
      final candidate = _random.nextBool()
          ? answer + delta
          : answer - delta;
      if (candidate >= 0) options.add(candidate);
    }
    final list = options.toList()..shuffle(_random);
    return list;
  }
}