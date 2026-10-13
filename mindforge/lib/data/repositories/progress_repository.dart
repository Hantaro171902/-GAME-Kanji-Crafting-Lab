import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/storage/progress_store.dart';
import '../../models/player_profile.dart';
import 'remote_sync_service.dart';

final progressRepositoryProvider =
    Provider<ProgressRepository>((ref) => throw UnimplementedError());

final profileProvider = StateProvider<PlayerProfile?>((ref) => null);

class ProgressRepository {
  ProgressRepository(this._store, {RemoteSyncService? remote})
      : _remote = remote ?? const RemoteSyncService();

  final ProgressStore _store;
  final RemoteSyncService _remote;

  PlayerProfile load() => _store.load() ?? PlayerProfile.newPlayer();

  Future<void> save(PlayerProfile profile) async {
    await _store.save(profile);
    await _remote.sync(profile);
  }
}