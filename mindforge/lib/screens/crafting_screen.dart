import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/element_catalog.dart';
import '../data/repositories/progress_repository.dart';
import '../gameplay/crafting/crafting_system.dart';
import '../models/element_data.dart';
import '../widgets/element_tile.dart';

class CraftingScreen extends ConsumerStatefulWidget {
  const CraftingScreen({super.key});

  @override
  ConsumerState<CraftingScreen> createState() => _CraftingScreenState();
}

class _CraftingScreenState extends ConsumerState<CraftingScreen> {
  final CraftingSystem _system = CraftingSystem();
  ElementData? _slotA;
  ElementData? _slotB;
  String? _resultMessage;

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(profileProvider);
    final discoveredIds = profile?.discoveredElements ?? const [];
    final discovered = ElementCatalog.all()
        .where((e) => discoveredIds.contains(e.id))
        .toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Alchemy Lab')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Text(
                    'Combine two elements to discover a new one',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _SlotPicker(
                        label: 'Slot A',
                        element: _slotA,
                        elements: discovered,
                        onChanged: (e) => setState(() {
                          _slotA = e;
                          _resultMessage = null;
                        }),
                      ),
                      Icon(
                        Icons.add_circle_outline_rounded,
                        size: 32,
                        color: Colors.grey.shade500,
                      ),
                      _SlotPicker(
                        label: 'Slot B',
                        element: _slotB,
                        elements: discovered,
                        onChanged: (e) => setState(() {
                          _slotB = e;
                          _resultMessage = null;
                        }),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  FilledButton.icon(
                    onPressed: (_slotA == null || _slotB == null)
                        ? null
                        : _combine,
                    icon: const Icon(Icons.science_rounded),
                    label: const Text('Combine'),
                  ),
                  if (_resultMessage != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      _resultMessage!,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: _resultMessage!.startsWith('New')
                            ? const Color(0xFF2E7D32)
                            : Colors.grey.shade700,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Discovered (${discovered.length} / ${ElementCatalog.all().length})',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 4,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.85,
            children: [
              for (final element in discovered)
                ElementTile(
                  element: element,
                  discovered: true,
                  onTap: () => _selectInSlot(element),
                ),
            ],
          ),
        ],
      ),
    );
  }

  void _selectInSlot(ElementData element) {
    setState(() {
      if (_slotA == null) {
        _slotA = element;
      } else if (_slotB == null) {
        _slotB = element;
      } else {
        _slotA = element;
        _slotB = null;
      }
      _resultMessage = null;
    });
  }

  void _combine() {
    final profile = ref.read(profileProvider);
    if (profile == null || _slotA == null || _slotB == null) return;
    final result = _system.combine(_slotA!, _slotB!);
    if (result == null) {
      setState(() => _resultMessage = 'Nothing happens...');
      return;
    }
    final alreadyKnown = profile.discoveredElements.contains(result.id);
    if (alreadyKnown) {
      setState(() => _resultMessage = '${result.name} — already discovered.');
      return;
    }
    final updated = profile.copyWith(
      discoveredElements: [...profile.discoveredElements, result.id],
    );
    ref.read(profileProvider.notifier).state = updated;
    ref.read(progressRepositoryProvider).save(updated);
    setState(() => _resultMessage = 'New discovery: ${result.name}!');
  }
}

class _SlotPicker extends StatelessWidget {
  const _SlotPicker({
    required this.label,
    required this.element,
    required this.elements,
    required this.onChanged,
  });

  final String label;
  final ElementData? element;
  final List<ElementData> elements;
  final ValueChanged<ElementData> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        SizedBox(
          width: 72,
          height: 72,
          child: element == null
              ? Container(
                  decoration: BoxDecoration(
                    color: Colors.black12,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.add, color: Colors.black38),
                )
              : ElementTile(
                  element: element!,
                  discovered: true,
                ),
        ),
        const SizedBox(height: 8),
        PopupMenuButton<ElementData>(
          onSelected: onChanged,
          itemBuilder: (context) => [
            for (final e in elements)
              PopupMenuItem(value: e, child: Text(e.name)),
          ],
          child: const Text('Choose'),
        ),
      ],
    );
  }
}