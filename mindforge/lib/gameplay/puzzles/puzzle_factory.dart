import 'package:mindforge_academy/models/level_data.dart';

import 'puzzle_controller.dart';
import 'puzzle_logic.dart';
import 'puzzle_math.dart';
import 'puzzle_memory.dart';
import 'puzzle_pattern.dart';
import 'puzzle_reflex.dart';

class PuzzleFactory {
  static PuzzleController create(LevelData level) {
    final range = level.config['range'] as int? ?? 15;
    final length = level.config['length'] as int? ?? 4;
    switch (level.mechanic) {
      case 'sudoku_lite':
        return LogicPuzzleController(gridSize: length.clamp(2, 3));
      case 'quick_arithmetic':
        return MathPuzzleController(maxValue: range);
      case 'sequence_memory':
        return MemoryPuzzleController(sequenceLength: length.clamp(4, 6));
      case 'next_in_sequence':
        return PatternPuzzleController(maxStart: range);
      case 'pick_the_color':
        return ReflexPuzzleController(colorCount: length.clamp(3, 6));
      default:
        return MathPuzzleController(maxValue: range);
    }
  }
}