import 'package:flutter/material.dart';

import '../theme/kanji_palette.dart';

class KanjiGameButton extends StatefulWidget {
  const KanjiGameButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.secondary = false,
    this.compact = false,
  });

  final String label;
  final VoidCallback onPressed;
  final IconData? icon;
  final bool secondary;
  final bool compact;

  @override
  State<KanjiGameButton> createState() => _KanjiGameButtonState();
}

class _KanjiGameButtonState extends State<KanjiGameButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final fill = widget.secondary ? KanjiPalette.paper : KanjiPalette.yellow;
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapCancel: () => setState(() => _pressed = false),
      onTapUp: (_) => setState(() => _pressed = false),
      onTap: widget.onPressed,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 110),
        transform: Matrix4.translationValues(0, _pressed ? 3 : 0, 0),
        padding: EdgeInsets.symmetric(
          horizontal: widget.compact ? 18 : 22,
          vertical: widget.compact ? 13 : 17,
        ),
        decoration: BoxDecoration(
          color: fill,
          border: Border.all(color: KanjiPalette.ink, width: 2.5),
          borderRadius: BorderRadius.circular(widget.compact ? 18 : 22),
          boxShadow: [
            BoxShadow(
              color: KanjiPalette.ink,
              offset: Offset(0, _pressed ? 1 : 6),
              blurRadius: 0,
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
          children: [
            if (widget.icon != null) ...[
              Icon(widget.icon, color: KanjiPalette.ink, size: 22),
              const SizedBox(width: 9),
            ],
            Flexible(
              child: Text(
                widget.label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: KanjiPalette.ink,
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  letterSpacing: .15,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
