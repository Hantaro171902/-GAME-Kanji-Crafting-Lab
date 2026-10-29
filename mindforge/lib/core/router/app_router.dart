import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/level_data.dart';
import '../../screens/chapter_map_screen.dart';
import '../../screens/crafting_screen.dart';
import '../../screens/encyclopedia_screen.dart';
import '../../screens/home_screen.dart';
import '../../screens/puzzle_screen.dart';
import '../../screens/settings_screen.dart';
import '../../screens/splash_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/chapter/:chapterId',
        name: 'chapter',
        builder: (context, state) => ChapterMapScreen(
          chapterId: int.parse(state.pathParameters['chapterId']!),
        ),
      ),
      GoRoute(
        path: '/puzzle',
        name: 'puzzle',
        builder: (context, state) =>
            PuzzleScreen(level: state.extra! as LevelData),
      ),
      GoRoute(
        path: '/lab',
        name: 'lab',
        builder: (context, state) => const CraftingScreen(),
      ),
      GoRoute(
        path: '/encyclopedia',
        name: 'encyclopedia',
        builder: (context, state) => const EncyclopediaScreen(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});