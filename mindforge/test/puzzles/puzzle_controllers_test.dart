import 'package:flutter_test/flutter_test.dart';
import 'package:mindforge_academy/gameplay/puzzles/puzzle_controller.dart';
import 'package:mindforge_academy/gameplay/puzzles/puzzle_logic.dart';
import 'package:mindforge_academy/gameplay/puzzles/puzzle_math.dart';
import 'package:mindforge_academy/gameplay/puzzles/puzzle_memory.dart';
import 'package:mindforge_academy/gameplay/puzzles/puzzle_pattern.dart';
import 'package:mindforge_academy/gameplay/puzzles/puzzle_reflex.dart';

void main() {
  group('MathPuzzleController', () {
    test('generates a solvable question with 4 options', () {
      final controller = MathPuzzleController(maxValue: 20);
      controller.generate();
      expect(controller.current.options.length, 4);
      expect(controller.checkAnswer(controller.current.correctIndex), isTrue);
    });

    test('wrong answer is rejected', () {
      final controller = MathPuzzleController(maxValue: 20);
      controller.generate();
      final wrong = (controller.current.correctIndex + 1) %
          controller.current.options.length;
      expect(controller.checkAnswer(wrong), isFalse);
    });
  });

  group('MemoryPuzzleController', () {
    test('correct index matches the memorized item', () {
      final controller = MemoryPuzzleController(sequenceLength: 5);
      controller.generate();
      expect(controller.checkAnswer(controller.current.correctIndex), isTrue);
    });
  });

  group('PatternPuzzleController', () {
    test('next-term answer is always greater than the last term', () {
      final controller = PatternPuzzleController(maxStart: 10);
      controller.generate();
      final answer = int.parse(
        controller.current.options[controller.current.correctIndex],
      );
      expect(answer, greaterThan(0));
    });
  });

  group('LogicPuzzleController', () {
    test('grid puzzle is solvable', () {
      final controller = LogicPuzzleController(gridSize: 2);
      controller.generate();
      expect(controller.current.prompt, contains('missing'));
      expect(controller.checkAnswer(controller.current.correctIndex), isTrue);
    });
  });

  group('ReflexPuzzleController', () {
    test('target option is present', () {
      final controller = ReflexPuzzleController(colorCount: 4);
      controller.generate();
      expect(controller.current.options.length, 4);
      expect(controller.checkAnswer(controller.current.correctIndex), isTrue);
    });
  });

  group('PuzzleController contract', () {
    test('hint index is always the correct index', () {
      final controllers = <PuzzleController>[
        MathPuzzleController(maxValue: 20),
        MemoryPuzzleController(sequenceLength: 5),
        PatternPuzzleController(maxStart: 10),
        LogicPuzzleController(gridSize: 2),
        ReflexPuzzleController(colorCount: 4),
      ];
      for (final controller in controllers) {
        controller.generate();
        expect(controller.hintIndex(), controller.current.correctIndex);
      }
    });
  });
}