import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../data/level_catalog.dart';
import '../data/repositories/progress_repository.dart';
import '../widgets/level_card.dart';

class ChapterMapScreen extends ConsumerWidget {
  const ChapterMapScreen({super.key, required this.chapterId});

  final int chapterId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider);
    final levels = LevelCatalog.forChapter(chapterId);
    return Scaffold(
      appBar: AppBar(title: Text('Chapter $chapterId')),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 12),
        itemCount: levels.length,
        itemBuilder: (context, index) {
          final level = levels[index];
          final unlocked = profile?.isLevelUnlocked(
                level.id,
                level.chapter,
                index + 1,
              ) ??
              index == 0;
          return LevelCard(
            level: level,
            stars: profile?.starsForLevel(level.id) ?? 0,
            unlocked: unlocked,
            onTap: () => context.push('/puzzle', extra: level),
          );
        },
      ),
    );
  }
}