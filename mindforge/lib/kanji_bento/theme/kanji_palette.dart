import 'package:flutter/material.dart';

class KanjiPalette {
  static const paper = Color(0xFFFFF9EC);
  static const cream = Color(0xFFFFF2D8);
  static const wood = Color(0xFFD8A36E);
  static const woodDark = Color(0xFF9D6947);
  static const ink = Color(0xFF503225);
  static const inkSoft = Color(0xFF79533F);
  static const teal = Color(0xFF4D9E9A);
  static const tealPale = Color(0xFFE3F2EC);
  static const coral = Color(0xFFE27F69);
  static const yellow = Color(0xFFF7C95D);
  static const green = Color(0xFF91B985);
  static const canvas = Color(0xFFF2DEBC);

  static const border = BorderSide(color: ink, width: 2.4);

  static BoxDecoration panel({Color color = paper, double radius = 22}) =>
      BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: ink, width: 2.4),
        boxShadow: const [
          BoxShadow(color: ink, offset: Offset(0, 5), blurRadius: 0),
        ],
      );
}
