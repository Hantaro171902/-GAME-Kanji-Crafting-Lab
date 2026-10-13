import 'dart:math';

import 'puzzle_controller.dart';
import 'puzzle_question.dart';

class MemoryPuzzleController extends PuzzleController {
  MemoryPuzzleController({required this.sequenceLength});

  final int sequenceLength;
  final Random _random = Random();
  late PuzzleQuestion _current;

  @override
  PuzzleQuestion get current => _current;

  @override
  void generate() {
    final sequence = List.generate(
      sequenceLength,
      (_) => _random.nextInt(9),
    );
    final askIndex = _random.nextInt(sequenceLength);
    final correct = sequence[askIndex];
    final options = _buildOptions(correct);
    _current = PuzzleQuestion(
      prompt: 'Memorize the sequence:\n${sequence.join(' ')}\n\n'
          'What was item ${askIndex + 1}?',
      options: options.map((v) => '$v').toList(),
      correctIndex: options.indexOf(correct),
      explanation: 'Item ${askIndex + 1} was $correct.',
    );
  }

  List<int> _buildOptions(int correct) {
    final options = <int>{correct};
    var guard = 0;
    while (options.length < 4 && guard < 100) {
      guard++;
      final candidate = (_random.nextInt(9) + 10) % 10;
      options.add(candidate);
    }
    return options.toList()..shuffle(_random);
  }
}