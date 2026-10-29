# -GAME-Kanji-Crafting-Lab

## Calligraphy stroke data

The calligraphy desk and the Kanji information view read SVG stroke paths through
`useCalligraphyStrokes`. The current `mockCalligraphyRepository` sources those
paths from the chapter data, so the existing offline experience remains the
default.

To connect a service later, implement `CalligraphyRepository.getStrokes(kanji, signal)`
and return SVG path strings in stroke order, then select that implementation in
`repositoryProvider.ts`. The hook passes an `AbortSignal`, exposes loading and
error states, and supports retrying. The Kanji-Dojo app itself is not a hosted
API; its companion
[Kanji-Dojo-Data repository](https://github.com/syt0r/Kanji-Dojo-Data) contains
offline data and export scripts, so reuse of its data should follow that
repository's license and data-source requirements.
