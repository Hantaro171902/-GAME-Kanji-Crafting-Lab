import 'package:mindforge_academy/core/constants/app_constants.dart';
import 'package:mindforge_academy/models/level_data.dart';

class LevelCatalog {
  static const List<String> _categories = [
    'logic',
    'math',
    'memory',
    'pattern',
    'reflex',
  ];

  static const Map<String, String> _titles = {
    'logic': 'Logic Trail',
    'math': 'Number Gym',
    'memory': 'Memory Hall',
    'pattern': 'Pattern Garden',
    'reflex': 'Reflex Arena',
  };

  static const Map<String, String> _mechanics = {
    'logic': 'sudoku_lite',
    'math': 'quick_arithmetic',
    'memory': 'sequence_memory',
    'pattern': 'next_in_sequence',
    'reflex': 'pick_the_color',
  };

  static List<LevelData> all() {
    final levels = <LevelData>[];
    for (var chapter = 1; chapter <= AppConstants.chaptersAtLaunch; chapter++) {
      for (var i = 0; i < AppConstants.levelsPerChapter; i++) {
        final category = _categories[i % _categories.length];
        levels.add(LevelData(
          id: '$chapter-${i + 1}',
          chapter: chapter,
          category: category,
          mechanic: _mechanics[category]!,
          title: _titles[category]!,
          difficulty: chapter + (i ~/ 5),
          timeLimitSec: 180 - (chapter - 1) * 20,
          hintCost: AppConstants.hintCost,
          shardsReward: 8 + chapter * 2,
          config: {'range': 10 + chapter * 5, 'length': 4 + (i % 3)},
        ));
      }
    }
    return levels;
  }

  static List<LevelData> forChapter(int chapter) =>
      all().where((l) => l.chapter == chapter).toList();

  static LevelData? byId(String id) {
    for (final level in all()) {
      if (level.id == id) return level;
    }
    return null;
  }
}