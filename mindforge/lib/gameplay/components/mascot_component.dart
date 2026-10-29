import 'dart:math';
import 'dart:ui';

import 'package:flame/components.dart';

class MascotComponent extends PositionComponent {
  MascotComponent({super.position}) : super(size: Vector2(120, 110));

  double _phase = 0;
  bool _celebrating = false;
  double _celebrateUntil = 0;
  late final double _baseY = y;

  @override
  void render(Canvas canvas) {
    final rect = Rect.fromCenter(
      center: Offset(size.x / 2, size.y / 2),
      width: 84,
      height: 88,
    );
    final bodyPaint = Paint()..color = const Color(0xFFFFB74D);
    final eyePaint = Paint()..color = const Color(0xFF37474F);
    final beakPaint = Paint()..color = const Color(0xFFFF7043);

    canvas.drawRRect(
      RRect.fromRectAndRadius(rect, const Radius.circular(40)),
      bodyPaint,
    );
    canvas.drawCircle(
      Offset(size.x / 2 - 18, size.y / 2 - 8),
      7,
      eyePaint,
    );
    canvas.drawCircle(
      Offset(size.x / 2 + 18, size.y / 2 - 8),
      7,
      eyePaint,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
          center: Offset(size.x / 2, size.y / 2 + 16),
          width: 22,
          height: 12,
        ),
        const Radius.circular(6),
      ),
      beakPaint,
    );
  }

  @override
  void update(double dt) {
    super.update(dt);
    _phase += dt * 2;
    y = _baseY + sin(_phase) * 4;
    angle = sin(_phase * 0.5) * 0.04;
    if (_celebrating) {
      scale = Vector2.all(1.06 + sin(_phase * 8) * 0.03);
      if (_now() > _celebrateUntil) {
        _celebrating = false;
        scale = Vector2.all(1.0);
      }
    } else if (scale.x > 1.0) {
      scale = Vector2.all(max(1.0, scale.x - dt * 0.6));
    }
  }

  double _now() => DateTime.now().millisecondsSinceEpoch / 1000;

  void cheer() {
    _celebrating = true;
    _celebrateUntil = _now() + 1.5;
  }

  void sigh() {
    scale = Vector2.all(0.93);
  }
}