class LevelData {
  const LevelData({
    required this.id,
    required this.chapter,
    required this.category,
    required this.mechanic,
    required this.title,
    required this.difficulty,
    required this.timeLimitSec,
    required this.hintCost,
    required this.shardsReward,
    this.config = const {},
  });

  factory LevelData.fromJson(Map<String, dynamic> json) => LevelData(
        id: json['id'] as String,
        chapter: json['chapter'] as int,
        category: json['category'] as String,
        mechanic: json['mechanic'] as String,
        title: json['title'] as String,
        difficulty: json['difficulty'] as int? ?? 1,
        timeLimitSec: json['timeLimitSec'] as int? ?? 180,
        hintCost: json['hintCost'] as int? ?? 1,
        shardsReward: json['shardsReward'] as int? ?? 10,
        config: (json['config'] as Map<String, dynamic>?) ?? const {},
      );

  final String id;
  final int chapter;
  final String category;
  final String mechanic;
  final String title;
  final int difficulty;
  final int timeLimitSec;
  final int hintCost;
  final int shardsReward;
  final Map<String, dynamic> config;

  Map<String, dynamic> toJson() => {
        'id': id,
        'chapter': chapter,
        'category': category,
        'mechanic': mechanic,
        'title': title,
        'difficulty': difficulty,
        'timeLimitSec': timeLimitSec,
        'hintCost': hintCost,
        'shardsReward': shardsReward,
        'config': config,
      };
}