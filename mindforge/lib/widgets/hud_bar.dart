import 'package:flutter/material.dart';

class HudBar extends StatelessWidget {
  const HudBar({
    super.key,
    required this.levelLabel,
    required this.timeLeft,
    required this.questionIndex,
    required this.questionCount,
    required this.onPause,
  });

  final String levelLabel;
  final int timeLeft;
  final int questionIndex;
  final int questionCount;
  final VoidCallback onPause;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          IconButton(
            onPressed: onPause,
            icon: const Icon(Icons.pause_circle_outline),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  levelLabel,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                Text(
                  'Question ${questionIndex + 1} / $questionCount',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          Chip(
            avatar: const Icon(Icons.timer_outlined, size: 18),
            label: Text(
              _format(timeLeft),
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  static String _format(int seconds) {
    final m = (seconds ~/ 60).toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }
}