import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/repositories/progress_repository.dart';
import '../models/player_profile.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider);
    if (profile == null) return const Scaffold(body: SizedBox.shrink());
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _ToggleTile(
            icon: Icons.volume_up_rounded,
            title: 'Sound effects',
            value: profile.soundOn,
            onChanged: (v) => _update(ref, profile.copyWith(soundOn: v)),
          ),
          _ToggleTile(
            icon: Icons.music_note_rounded,
            title: 'Music',
            value: profile.musicOn,
            onChanged: (v) => _update(ref, profile.copyWith(musicOn: v)),
          ),
          _ToggleTile(
            icon: Icons.vibration_rounded,
            title: 'Haptics',
            value: profile.hapticsOn,
            onChanged: (v) => _update(ref, profile.copyWith(hapticsOn: v)),
          ),
          const Divider(height: 32),
          ListTile(
            leading: const Icon(Icons.badge_outlined),
            title: const Text('Nickname'),
            subtitle: Text(profile.nickname),
            trailing: const Icon(Icons.edit_outlined),
            onTap: () => _editNickname(context, ref, profile),
          ),
        ],
      ),
    );
  }

  void _update(WidgetRef ref, PlayerProfile updated) {
    ref.read(profileProvider.notifier).state = updated;
    ref.read(progressRepositoryProvider).save(updated);
  }

  void _editNickname(BuildContext context, WidgetRef ref, PlayerProfile profile) {
    final controller = TextEditingController(text: profile.nickname);
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Edit nickname'),
        content: TextField(
          controller: controller,
          autofocus: true,
          maxLength: 20,
          decoration: const InputDecoration(hintText: 'Enter a nickname'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              final name = controller.text.trim();
              if (name.isNotEmpty) {
                _update(ref, profile.copyWith(nickname: name));
              }
              Navigator.of(dialogContext).pop();
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

class _ToggleTile extends StatelessWidget {
  const _ToggleTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.onChanged,
  });

  final IconData icon;
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      secondary: Icon(icon),
      title: Text(title),
      value: value,
      onChanged: onChanged,
    );
  }
}