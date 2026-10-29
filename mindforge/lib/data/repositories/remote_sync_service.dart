import '../../models/player_profile.dart';

class RemoteSyncService {
  const RemoteSyncService({this.enabled = false});

  final bool enabled;

  Future<void> sync(PlayerProfile profile) async {
    if (!enabled) return;
    await _push(profile);
  }

  Future<void> _push(PlayerProfile profile) async {}
}