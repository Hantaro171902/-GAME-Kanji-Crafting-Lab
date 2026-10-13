import 'package:flutter/material.dart';

import '../models/element_data.dart';

class ElementTile extends StatelessWidget {
  const ElementTile({
    super.key,
    required this.element,
    required this.discovered,
    this.onTap,
  });

  final ElementData element;
  final bool discovered;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final color = _parseColor(element.colorHex);
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: discovered ? onTap : null,
      child: Container(
        decoration: BoxDecoration(
          color: discovered ? color.withValues(alpha: 0.14) : Colors.black12,
          borderRadius: BorderRadius.circular(16),
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: discovered ? color : Colors.grey.shade400,
                shape: BoxShape.circle,
              ),
              child: Text(
                discovered ? element.name.substring(0, 1) : '?',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              discovered ? element.name : 'Unknown',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: discovered ? Colors.black87 : Colors.black38,
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Color _parseColor(String hex) => Color(
        int.parse(hex, radix: 16) | 0xFF000000,
      );
}