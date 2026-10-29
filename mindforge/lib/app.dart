import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'data/repositories/progress_repository.dart';

class MindForgeApp extends StatelessWidget {
  const MindForgeApp({super.key, required this.repository});

  final ProgressRepository repository;

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      overrides: [
        progressRepositoryProvider.overrideWithValue(repository),
        profileProvider.overrideWith((ref) => repository.load()),
      ],
      child: Consumer(builder: (context, ref, _) {
        final router = ref.watch(appRouterProvider);
        return MaterialApp.router(
          title: 'MindForge Academy',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.light(),
          routerConfig: router,
        );
      }),
    );
  }
}