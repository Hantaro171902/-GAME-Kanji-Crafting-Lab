import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/repositories/progress_repository.dart';
import '../../models/player_profile.dart';
import '../data/kanji_strings.dart';
import '../theme/kanji_palette.dart';

class KanjiSettingsScreen extends ConsumerWidget {
  const KanjiSettingsScreen({super.key});

  void _save(WidgetRef ref, PlayerProfile profile) {
    ref.read(profileProvider.notifier).state = profile;
    ref.read(progressRepositoryProvider).save(profile);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider);
    if (profile == null) return const Scaffold(body: SizedBox.shrink());
    final strings = KanjiStrings(profile.language);
    return Scaffold(
      backgroundColor: KanjiPalette.canvas,
      appBar: AppBar(
        backgroundColor: KanjiPalette.canvas,
        foregroundColor: KanjiPalette.ink,
        title: Text(strings.text('settings'), style: const TextStyle(fontWeight: FontWeight.w900)),
        actions: [
          IconButton(tooltip: 'Game pieces', onPressed: () => context.push('/kanji-bento/components'), icon: const Icon(Icons.grid_view_rounded)),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(18, 8, 18, 24),
        children: [
          _section(strings.text('language'), '言語 · LANGUAGE'),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(6),
            decoration: KanjiPalette.panel(color: KanjiPalette.paper, radius: 20),
            child: Row(
              children: [
                _LanguageOption(label: 'English', active: profile.language == 'en', onTap: () => _save(ref, profile.copyWith(language: 'en'))),
                _LanguageOption(label: '日本語', active: profile.language == 'ja', onTap: () => _save(ref, profile.copyWith(language: 'ja'))),
                _LanguageOption(label: 'Tiếng Việt', active: profile.language == 'vi', onTap: () => _save(ref, profile.copyWith(language: 'vi'))),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _section('SOUND · おと', '♪'),
          const SizedBox(height: 8),
          _toggle(strings.text('music'), 'おんがく', profile.musicOn, (v) => _save(ref, profile.copyWith(musicOn: v))),
          _volume(strings.text('volume'), profile.musicVolume, (v) => _save(ref, profile.copyWith(musicVolume: v))),
          _toggle(strings.text('sound'), 'こうかおん', profile.soundOn, (v) => _save(ref, profile.copyWith(soundOn: v))),
          _volume(strings.text('volume'), profile.soundVolume, (v) => _save(ref, profile.copyWith(soundVolume: v))),
          _toggle(strings.text('readAloud'), 'よみあげ', profile.readKanjiAloud, (v) => _save(ref, profile.copyWith(readKanjiAloud: v))),
          const SizedBox(height: 12),
          _section('LEARNING · まなび', '✎'),
          const SizedBox(height: 8),
          _toggle(strings.text('furigana'), 'ふりがな', profile.showFurigana, (v) => _save(ref, profile.copyWith(showFurigana: v))),
          _toggle(strings.text('vibration'), 'しんどう', profile.hapticsOn, (v) => _save(ref, profile.copyWith(hapticsOn: v))),
          const SizedBox(height: 22),
          Text('Preferences are saved on this device.', textAlign: TextAlign.center, style: TextStyle(color: KanjiPalette.inkSoft.withValues(alpha: .8), fontSize: 12)),
        ],
      ),
    );
  }

  Widget _section(String title, String subtitle) => Row(
        children: [
          Expanded(child: Text(title, style: const TextStyle(color: KanjiPalette.ink, fontSize: 16, fontWeight: FontWeight.w900))),
          Text(subtitle, style: const TextStyle(color: KanjiPalette.woodDark, fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1)),
        ],
      );

  Widget _toggle(String title, String subtitle, bool value, ValueChanged<bool> onChanged) => Container(
        margin: const EdgeInsets.only(bottom: 6),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        decoration: BoxDecoration(color: KanjiPalette.paper, borderRadius: BorderRadius.circular(15)),
        child: SwitchListTile.adaptive(
          contentPadding: EdgeInsets.zero,
          title: Text(title, style: const TextStyle(color: KanjiPalette.ink, fontWeight: FontWeight.w800)),
          subtitle: Text(subtitle, style: const TextStyle(color: KanjiPalette.inkSoft)),
          value: value,
          activeThumbColor: KanjiPalette.green,
          onChanged: onChanged,
        ),
      );

  Widget _volume(String label, double value, ValueChanged<double> onChanged) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
        child: Row(
          children: [
            SizedBox(width: 58, child: Text(label, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12))),
            Expanded(child: Slider(value: value.clamp(0.0, 1.0).toDouble(), onChanged: onChanged, activeColor: KanjiPalette.yellow, inactiveColor: KanjiPalette.wood.withValues(alpha: .4))),
            SizedBox(width: 34, child: Text('${(value * 100).round()}%', textAlign: TextAlign.end, style: const TextStyle(color: KanjiPalette.inkSoft, fontSize: 12))),
          ],
        ),
      );
}

class _LanguageOption extends StatelessWidget {
  const _LanguageOption({required this.label, required this.active, required this.onTap});
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Expanded(
        child: Padding(
          padding: const EdgeInsets.all(4),
          child: Material(
            color: active ? KanjiPalette.yellow : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            child: InkWell(
              borderRadius: BorderRadius.circular(14),
              onTap: onTap,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 5),
                child: Text(label, textAlign: TextAlign.center, style: TextStyle(color: KanjiPalette.ink, fontWeight: active ? FontWeight.w900 : FontWeight.w700, fontSize: 12)),
              ),
            ),
          ),
        ),
      );
}
