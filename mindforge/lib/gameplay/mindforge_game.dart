import 'package:flame/components.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';

import 'components/confetti_component.dart';
import 'components/mascot_component.dart';

class MindForgeGame extends FlameGame {
  MindForgeGame({this.accentColor = const Color(0xFF4F46E5)});

  final Color accentColor;

  late final MascotComponent _mascot;
  late final ConfettiComponent _confetti;

  @override
  Future<void> onLoad() async {
    camera.viewfinder.anchor = Anchor.center;
    _mascot = MascotComponent(position: Vector2(size.x / 2, size.y / 2));
    _confetti = ConfettiComponent(position: Vector2(size.x / 2, size.y / 2));
    add(_mascot);
    add(_confetti);
  }

  void celebrate() {
    _confetti.burst();
    _mascot.cheer();
  }

  void frown() {
    _mascot.sigh();
  }

  @override
  void onGameResize(Vector2 size) {
    super.onGameResize(size);
    if (_mascot.isMounted) {
      _mascot.position = Vector2(size.x / 2, size.y / 2);
      _confetti.position = Vector2(size.x / 2, size.y / 2);
    }
  }
}