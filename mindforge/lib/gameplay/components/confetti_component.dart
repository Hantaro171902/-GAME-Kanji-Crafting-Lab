import 'package:flame/components.dart';
import 'package:flame/particles.dart';
import 'package:flutter/material.dart';

class ConfettiComponent extends ParticleSystemComponent {
  ConfettiComponent({super.position})
      : super(particle: Particle.generate(
          count: 0,
          lifespan: 1,
          generator: (_) => CircleParticle(radius: 0, paint: Paint()),
        ));

  static const List<Color> _palette = [
    Color(0xFFFF5252),
    Color(0xFFFFD740),
    Color(0xFF69F0AE),
    Color(0xFF40C4FF),
    Color(0xFFE040FB),
  ];

  void burst() {
    particle = Particle.generate(
      count: 60,
      lifespan: 1.4,
      generator: (i) => AcceleratedParticle(
        acceleration: Vector2(0, 320),
        speed: Vector2(
          ((i % 12 - 6) * 85).toDouble(),
          -(60 + (i % 6) * 55).toDouble(),
        ),
        child: CircleParticle(
          radius: 4 + (i % 3).toDouble(),
          paint: Paint()..color = _palette[i % _palette.length],
        ),
      ),
    );
  }
}