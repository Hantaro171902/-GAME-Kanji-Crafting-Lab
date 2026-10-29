import 'dart:math';

import 'puzzle_controller.dart';
import 'puzzle_question.dart';

class LogicPuzzleController extends PuzzleController {
  LogicPuzzleController({required this.gridSize});

  final int gridSize;
  final Random _random = Random();
  late PuzzleQuestion _current;

  @override
  PuzzleQuestion get current => _current;

  @override
  void generate() {
    final grid = List.generate(gridSize, (_) => List.filled(gridSize, 0));
    final sum = _random.nextInt(3) + 2;
    for (var row = 0; row < gridSize; row++) {
      for (var col = 0; col < gridSize; col++) {
        grid[row][col] = _random.nextInt(sum + 1);
      }
    }
    final missingRow = _random.nextInt(gridSize);
    final missingCol = _random.nextInt(gridSize);
    final target = sum * gridSize;
    final rowSum = grid[missingRow].fold<int>(0, (acc, v) => acc + v);
    final answer = target - rowSum;
    final options = _buildOptions(answer);
    _current = PuzzleQuestion(
      prompt: '${_renderGrid(grid, missingRow, missingCol, answer)}'
        '\nEach row sums to $target.\nWhat is the missing number?',
      options: options.map((v) => '$v').toList(),
      correctIndex: options.indexOf(answer),
      explanation: 'Row ${missingRow + 1} needs $answer to reach $target.',
    );
  }

  String _renderGrid(List<List<int>> grid, int row, int col, int answer) {
    final buffer = StringBuffer();
    for (var r = 0; r < grid.length; r++) {
      buffer.write('\n');
      for (var c = 0; c < grid[r].length; c++) {
        final value = (r == row && c == col) ? '?' : '${grid[r][c]}';
        buffer.write('$value  ');
      }
    }
    return buffer.toString();
  }

  List<int> _buildOptions(int answer) {
    final options = <int>{answer};
    var guard = 0;
    while (options.length < 4 && guard < 100) {
      guard++;
      final delta = _random.nextInt(3) + 1;
      final candidate = _random.nextBool() ? answer + delta : answer - delta;
      if (candidate >= 0) options.add(candidate);
    }
    return options.toList()..shuffle(_random);
  }
}