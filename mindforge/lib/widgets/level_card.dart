import 'package:flutter/material.dart';

import '../models/level_data.dart';
import 'star_rating.dart';

class LevelCard extends StatelessWidget {
  const LevelCard({
    super.key,
    required this.level,
    required this.stars,
    required this.unlocked,
    required this.onTap,
  });

  final LevelData level;
  final int stars;
  final bool unlocked;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      color: unlocked ? scheme.surface : scheme.surfaceContainerHighest,
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: unlocked ? onTap : null,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: unlocked
                    ? scheme.primaryContainer
                    : Colors.black12,
                child: unlocked
                    ? Text(
                        level.id.split('-').last,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: scheme.onPrimaryContainer,
                        ),
                      )
                    : const Icon(Icons.lock_outline, color: Colors.black38),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${level.category.toUpperCase()} · ${level.title}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Difficulty ${level.difficulty} · '
                      '${level.timeLimitSec}s',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              StarRating(count: stars),
            ],
          ),
        ),
      ),
    );
  }
}