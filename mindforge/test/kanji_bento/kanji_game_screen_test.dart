import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mindforge_academy/kanji_bento/screens/kanji_game_screen.dart';

void main() {
  testWidgets('reveals the first picture and accepts the correct pieces', (tester) async {
    await tester.binding.setSurfaceSize(const Size(430, 932));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: KanjiGameScreen()),
      ),
    );

    expect(find.text('Picture 1 / 5'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('kanji-primary-action')));
    await tester.pumpAndSettle();
    expect(find.text('A person takes a break beside a tree.'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('kanji-piece-person-side')));
    await tester.tap(find.byKey(const ValueKey('kanji-slot-0')));
    await tester.tap(find.byKey(const ValueKey('kanji-piece-tree-a')));
    await tester.tap(find.byKey(const ValueKey('kanji-slot-1')));
    await tester.tap(find.byKey(const ValueKey('kanji-primary-action')));
    await tester.pumpAndSettle();

    expect(find.text('Correct! Nicely pieced together.'), findsOneWidget);
    expect(find.text('休'), findsWidgets);
  });
}
