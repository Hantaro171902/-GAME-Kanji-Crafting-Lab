import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/element_catalog.dart';
import '../data/repositories/progress_repository.dart';
import '../widgets/element_tile.dart';

class EncyclopediaScreen extends ConsumerWidget {
  const EncyclopediaScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider);
    final discovered = profile?.discoveredElements ?? const <String>[];
    final elements = ElementCatalog.all();
    return Scaffold(
      appBar: AppBar(title: const Text('Encyclopedia')),
      body: GridView.builder(
        padding: const EdgeInsets.all(20),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 0.85,
        ),
        itemCount: elements.length,
        itemBuilder: (context, index) {
          final element = elements[index];
          return ElementTile(
            element: element,
            discovered: discovered.contains(element.id),
          );
        },
      ),
    );
  }
}