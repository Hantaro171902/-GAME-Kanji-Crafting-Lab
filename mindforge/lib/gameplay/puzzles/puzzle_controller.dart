import 'puzzle_question.dart';

abstract class PuzzleController {
  PuzzleQuestion get current;

  void generate();

  bool checkAnswer(int selectedIndex) => selectedIndex == current.correctIndex;

  int hintIndex() => current.correctIndex;
}