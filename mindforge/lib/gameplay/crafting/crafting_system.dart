import 'package:mindforge_academy/data/element_catalog.dart';
import 'package:mindforge_academy/models/element_data.dart';

class CraftingSystem {
  CraftingSystem({Map<String, List<String>>? formulas})
      : _formulas = formulas ?? ElementCatalog.formulas();

  final Map<String, List<String>> _formulas;

  ElementData? combine(ElementData a, ElementData b) {
    final key = _sortedKey(a.id, b.id);
    final entry = _formulas[key];
    if (entry == null) return null;
    return ElementCatalog.byId(entry.first);
  }

  static String _sortedKey(String a, String b) =>
      a.compareTo(b) < 0 ? '$a|$b' : '$b|$a';
}