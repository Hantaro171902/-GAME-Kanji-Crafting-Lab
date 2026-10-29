import 'package:mindforge_academy/models/element_data.dart';

class ElementCatalog {
  static const List<ElementData> _elements = [
    ElementData(id: 'fire', name: 'Fire', family: 'Classic', colorHex: 'FF5722', discoverOrder: 1),
    ElementData(id: 'water', name: 'Water', family: 'Classic', colorHex: '2196F3', discoverOrder: 2),
    ElementData(id: 'earth', name: 'Earth', family: 'Classic', colorHex: '795548', discoverOrder: 3),
    ElementData(id: 'air', name: 'Air', family: 'Classic', colorHex: '9E9E9E', discoverOrder: 4),
    ElementData(id: 'steam', name: 'Steam', family: 'Nature', colorHex: 'B0BEC5', discoverOrder: 5, formula: ['water', 'fire']),
    ElementData(id: 'mud', name: 'Mud', family: 'Nature', colorHex: '8D6E63', discoverOrder: 6, formula: ['water', 'earth']),
    ElementData(id: 'dust', name: 'Dust', family: 'Nature', colorHex: 'CFD8DC', discoverOrder: 7, formula: ['air', 'earth']),
    ElementData(id: 'energy', name: 'Energy', family: 'Science', colorHex: 'FFC107', discoverOrder: 8, formula: ['fire', 'air']),
    ElementData(id: 'plant', name: 'Plant', family: 'Life', colorHex: '4CAF50', discoverOrder: 9, formula: ['earth', 'water']),
    ElementData(id: 'stone', name: 'Stone', family: 'Nature', colorHex: '607D8B', discoverOrder: 10, formula: ['fire', 'earth']),
    ElementData(id: 'rain', name: 'Rain', family: 'Weather', colorHex: '03A9F4', discoverOrder: 11, formula: ['water', 'air']),
    ElementData(id: 'storm', name: 'Storm', family: 'Weather', colorHex: '673AB7', discoverOrder: 12, formula: ['rain', 'energy']),
    ElementData(id: 'tree', name: 'Tree', family: 'Life', colorHex: '388E3C', discoverOrder: 13, formula: ['plant', 'earth']),
    ElementData(id: 'wood', name: 'Wood', family: 'Material', colorHex: '6D4C41', discoverOrder: 14, formula: ['tree', 'fire']),
    ElementData(id: 'lava', name: 'Lava', family: 'Nature', colorHex: 'D84315', discoverOrder: 15, formula: ['fire', 'stone']),
    ElementData(id: 'glass', name: 'Glass', family: 'Material', colorHex: '90CAF9', discoverOrder: 16, formula: ['sand', 'fire']),
    ElementData(id: 'sand', name: 'Sand', family: 'Nature', colorHex: 'F5DEB3', discoverOrder: 17, formula: ['stone', 'air']),
    ElementData(id: 'life', name: 'Life', family: 'Life', colorHex: '00BCD4', discoverOrder: 18, formula: ['energy', 'water']),
  ];

  static List<ElementData> all() => List.unmodifiable(_elements);

  static List<ElementData> base() =>
      _elements.where((e) => e.isBase).toList();

  static List<ElementData> discoverable() =>
      _elements.where((e) => !e.isBase).toList();

  static ElementData? byId(String id) {
    for (final element in _elements) {
      if (element.id == id) return element;
    }
    return null;
  }

  static Map<String, List<String>> formulas() {
    final map = <String, List<String>>{};
    for (final element in _elements) {
      final formula = element.formula;
      if (formula == null) continue;
      final key = _sortedKey(formula[0], formula[1]);
      map[key] = [element.id, formula[0], formula[1]];
    }
    return map;
  }

  static String _sortedKey(String a, String b) =>
      a.compareTo(b) < 0 ? '$a|$b' : '$b|$a';
}