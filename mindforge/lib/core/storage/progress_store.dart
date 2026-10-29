import 'dart:convert';

import 'package:hive/hive.dart';

import '../../models/player_profile.dart';

class ProgressStore {
  static const String _boxName = 'profile';
  static const String _key = 'player';

  late final Box<String> _box;

  Future<void> init() async {
    _box = await Hive.openBox<String>(_boxName);
  }

  PlayerProfile? load() {
    final raw = _box.get(_key);
    if (raw == null) return null;
    return PlayerProfile.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  Future<void> save(PlayerProfile profile) =>
      _box.put(_key, jsonEncode(profile.toJson()));
}