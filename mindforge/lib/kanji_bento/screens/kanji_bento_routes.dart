import 'package:go_router/go_router.dart';

import 'kanji_bento_menu_screen.dart';
import 'kanji_component_gallery_screen.dart';
import 'kanji_game_screen.dart';
import 'kanji_settings_screen.dart';

List<GoRoute> kanjiBentoRoutes() => [
      GoRoute(path: '/kanji-bento', builder: (context, state) => const KanjiBentoMenuScreen()),
      GoRoute(path: '/kanji-bento/play', builder: (context, state) => const KanjiGameScreen()),
      GoRoute(path: '/kanji-bento/settings', builder: (context, state) => const KanjiSettingsScreen()),
      GoRoute(path: '/kanji-bento/components', builder: (context, state) => const KanjiComponentGalleryScreen()),
    ];
