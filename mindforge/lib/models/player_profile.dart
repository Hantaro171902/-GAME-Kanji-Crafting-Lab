import 'package:mindforge_academy/core/constants/app_constants.dart';

class PlayerProfile {
  const PlayerProfile({
    required this.nickname,
    required this.chapter,
    required this.starsByLevel,
    required this.totalStars,
    required this.coins,
    required this.hintTokens,
    required this.discoveredElements,
    required this.soundOn,
    required this.musicOn,
    required this.hapticsOn,
  });

  factory PlayerProfile.newPlayer() => const PlayerProfile(
        nickname: 'Student',
        chapter: 1,
        starsByLevel: {},
        totalStars: 0,
        coins: 0,
        hintTokens: 3,
        discoveredElements: ['fire', 'water', 'earth', 'air'],
        soundOn: true,
        musicOn: true,
        hapticsOn: true,
      );

  factory PlayerProfile.fromJson(Map<String, dynamic> json) => PlayerProfile(
        nickname: json['nickname'] as String? ?? 'Student',
        chapter: json['chapter'] as int? ?? 1,
        starsByLevel: (json['starsByLevel'] as Map<String, dynamic>? ?? {})
            .map((k, v) => MapEntry(k, v as int)),
        totalStars: json['totalStars'] as int? ?? 0,
        coins: json['coins'] as int? ?? 0,
        hintTokens: json['hintTokens'] as int? ?? 3,
        discoveredElements:
            (json['discoveredElements'] as List<dynamic>? ?? const []).cast<String>(),
        soundOn: json['soundOn'] as bool? ?? true,
        musicOn: json['musicOn'] as bool? ?? true,
        hapticsOn: json['hapticsOn'] as bool? ?? true,
      );

  final String nickname;
  final int chapter;
  final Map<String, int> starsByLevel;
  final int totalStars;
  final int coins;
  final int hintTokens;
  final List<String> discoveredElements;
  final bool soundOn;
  final bool musicOn;
  final bool hapticsOn;

  bool get hasDiscovered => discoveredElements.length >= AppConstants.baseElements;

  int starsForLevel(String levelId) => starsByLevel[levelId] ?? 0;

  bool isLevelUnlocked(String levelId, int levelChapter, int levelIndex) {
    if (levelChapter < chapter) return true;
    if (levelChapter > chapter) return false;
    if (levelIndex == 0) return true;
    final previousId = '$levelChapter-$levelIndex';
    return starsForLevel(previousId) > 0;
  }

  PlayerProfile copyWith({
    String? nickname,
    int? chapter,
    Map<String, int>? starsByLevel,
    int? totalStars,
    int? coins,
    int? hintTokens,
    List<String>? discoveredElements,
    bool? soundOn,
    bool? musicOn,
    bool? hapticsOn,
  }) =>
      PlayerProfile(
        nickname: nickname ?? this.nickname,
        chapter: chapter ?? this.chapter,
        starsByLevel: starsByLevel ?? this.starsByLevel,
        totalStars: totalStars ?? this.totalStars,
        coins: coins ?? this.coins,
        hintTokens: hintTokens ?? this.hintTokens,
        discoveredElements: discoveredElements ?? this.discoveredElements,
        soundOn: soundOn ?? this.soundOn,
        musicOn: musicOn ?? this.musicOn,
        hapticsOn: hapticsOn ?? this.hapticsOn,
      );

  Map<String, dynamic> toJson() => {
        'nickname': nickname,
        'chapter': chapter,
        'starsByLevel': starsByLevel,
        'totalStars': totalStars,
        'coins': coins,
        'hintTokens': hintTokens,
        'discoveredElements': discoveredElements,
        'soundOn': soundOn,
        'musicOn': musicOn,
        'hapticsOn': hapticsOn,
      };
}