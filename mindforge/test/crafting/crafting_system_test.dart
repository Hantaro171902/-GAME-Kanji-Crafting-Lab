import 'package:flutter_test/flutter_test.dart';
import 'package:mindforge_academy/data/element_catalog.dart';
import 'package:mindforge_academy/gameplay/crafting/crafting_system.dart';

void main() {
  group('CraftingSystem', () {
    test('water + fire discovers steam', () {
      final system = CraftingSystem();
      final result = system.combine(
        ElementCatalog.byId('water')!,
        ElementCatalog.byId('fire')!,
      );
      expect(result?.id, 'steam');
    });

    test('combination order does not matter', () {
      final system = CraftingSystem();
      final a = system.combine(
        ElementCatalog.byId('water')!,
        ElementCatalog.byId('fire')!,
      );
      final b = system.combine(
        ElementCatalog.byId('fire')!,
        ElementCatalog.byId('water')!,
      );
      expect(a?.id, b?.id);
    });

    test('unknown combination returns null', () {
      final system = CraftingSystem();
      final result = system.combine(
        ElementCatalog.byId('fire')!,
        ElementCatalog.byId('fire')!,
      );
      expect(result, isNull);
    });

    test('every formula references real elements', () {
      final formulas = ElementCatalog.formulas();
      for (final entry in formulas.values) {
        expect(ElementCatalog.byId(entry[0]), isNotNull,
            reason: 'result ${entry[0]} must exist');
        expect(ElementCatalog.byId(entry[1]), isNotNull,
            reason: 'ingredient ${entry[1]} must exist');
        expect(ElementCatalog.byId(entry[2]), isNotNull,
            reason: 'ingredient ${entry[2]} must exist');
      }
    });
  });
}