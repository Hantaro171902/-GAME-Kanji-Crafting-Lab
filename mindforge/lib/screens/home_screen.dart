import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_constants.dart';
import '../data/repositories/progress_repository.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider);
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome back, ${profile?.nickname ?? 'Student'}!',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Chapter ${profile?.chapter ?? 1} unlocked',
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  ),
                  _StatChip(
                    icon: Icons.star_rounded,
                    color: const Color(0xFFFFB300),
                    value: '${profile?.totalStars ?? 0}',
                  ),
                  const SizedBox(width: 8),
                  _StatChip(
                    icon: Icons.token_rounded,
                    color: const Color(0xFF4F46E5),
                    value: '${profile?.hintTokens ?? 0}',
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  children: [
                    _MenuCard(
                      icon: Icons.play_circle_fill_rounded,
                      label: 'Play',
                      subtitle: 'Chapter 1',
                      color: const Color(0xFF4F46E5),
                      onTap: () => context.go('/chapter/1'),
                    ),
                    _MenuCard(
                      icon: Icons.science_rounded,
                      label: 'Alchemy Lab',
                      subtitle: '${profile?.discoveredElements.length ?? 0} elements',
                      color: const Color(0xFF00897B),
                      onTap: () => context.go('/lab'),
                    ),
                    _MenuCard(
                      icon: Icons.menu_book_rounded,
                      label: 'Encyclopedia',
                      subtitle: 'Element catalog',
                      color: const Color(0xFFF57C00),
                      onTap: () => context.go('/encyclopedia'),
                    ),
                    _MenuCard(
                      icon: Icons.settings_rounded,
                      label: 'Settings',
                      subtitle: 'Sound & haptics',
                      color: const Color(0xFF546E7A),
                      onTap: () => context.go('/settings'),
                    ),
                  ],
                ),
              ),
              Center(
                child: Text(
                  '${AppConstants.appName} v0.1.0',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({required this.icon, required this.color, required this.value});

  final IconData icon;
  final Color color;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: 6),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}

class _MenuCard extends StatelessWidget {
  const _MenuCard({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.14),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const Spacer(),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}