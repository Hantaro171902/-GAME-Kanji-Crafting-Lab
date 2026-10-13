class ElementData {
  const ElementData({
    required this.id,
    required this.name,
    required this.family,
    required this.colorHex,
    required this.discoverOrder,
    this.formula,
  });

  final String id;
  final String name;
  final String family;
  final String colorHex;
  final int discoverOrder;
  final List<String>? formula;

  bool get isBase => formula == null;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'family': family,
        'colorHex': colorHex,
        'discoverOrder': discoverOrder,
        'formula': formula,
      };
}