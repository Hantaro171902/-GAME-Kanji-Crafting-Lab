**Role:** You are an expert React, TypeScript, and Game UI developer. Your task is to implement a major gameplay update for a 2D web-based educational RPG game named "Kanji Mochi / The Lost World". 

**Context & Tech Stack:**
The project uses React, Zustand (in `store.ts`), Tailwind CSS, and `shadcn/ui` components (located in `src/components/ui/`). 

**Mission:** Implement the following 4 core gameplay features into the existing architecture. Please execute them phase by phase.

### Phase 1: Global State & Transition System
**Goal:** Set up the dual-map architecture and the dark splash screen transition[cite: 37].
1. **Update `src/game/store.ts`:**
   - Add state variables: `currentMap: 'village' | 'mine'`, `isTransitioning: boolean`, `energy: number`, `maxEnergy: number`.
   - Add actions: `changeMap(mapName)`, `deductEnergy(amount)`.
   - The `changeMap` function should set `isTransitioning` to `true`, wait for 800ms (to allow a fade-to-black animation), swap the `currentMap`, and then set `isTransitioning` to `false`.
2. **Create Splash Screen:**
   - In `src/game/Game.tsx`, add a fixed, full-screen `div` overlay with a black background (`bg-black`) and CSS transitions (e.g., `transition-opacity duration-500`). Tie its opacity and `pointer-events` to the `isTransitioning` state[cite: 37].

### Phase 2: Dual Map Implementation
**Goal:** Split the gameplay into two distinct maps with their own mechanics.
1. **Map 1: The Radical Mine (Farming/Digging Map)**
   - Create a new component `src/game/maps/MineMap.tsx`.
   - Use a tiled or grid-based layout for excavation[cite: 37].
   - Mechanics: Implement Stardew Valley-style artifact digging here to find radicals of different sizes (1x1, 1x2)[cite: 37].
2. **Map 2: The Village (NPC & Crafting Map)**
   - Create a new component `src/game/maps/VillageMap.tsx`.
   - Integrate the existing assets: `tree.png` (Kanji tree in the center), `shrine.png` (Picture Shrine), `desk.png` (Calligraphy), `bento.png` (Kanji assembly), and `mori.png` (NPC Guide).
3. **Map Rendering:**
   - Update `src/game/Game.tsx` to conditionally render `<MineMap />` or `<VillageMap />` based on the `currentMap` state. Place travel triggers (like a path edge or signpost) that fire `changeMap()`.

### Phase 3: Avatar & Energy Penalty System
**Goal:** Introduce an energy bar that depletes upon making mistakes[cite: 37].
1. **Avatar Bar Component:**
   - Create `src/components/AvatarBar.tsx`. Use the provided `src/assets/new-design/avatar-bar.svg` as the background or reference.
   - Display the player's Level and an Energy/Health Bar (progress bar style) using `src/components/ui/progress.tsx`[cite: 37]. 
2. **Penalty Logic:**
   - Inside the Kanji Bento guessing logic (likely in `src/game/Modals.tsx` or a Bento component), trigger `deductEnergy(1)` if the user places a radical in the wrong slot.
   - Add a visual feedback hook (e.g., screen shake animation using Tailwind `animate-shake` or flashing red overlay) when energy is deducted.

### Phase 4: Social System (Friends, Ranking & Chat)
**Goal:** Add a social overlay to the game.
1. **UI Layout:**
   - Use `src/assets/new-design/image 10.svg` (Friends icon) as a floating HUD button.
2. **The Social Drawer:**
   - Use `src/components/ui/sheet.tsx` or `drawer.tsx` to create a slide-out panel when the Friends button is clicked.
   - Include **Tabs** (using `src/components/ui/tabs.tsx`) for "Friends", "Ranking", and "Chat".
3. **Tab Contents:**
   - **Ranking:** Render a list ranking the top players for the current level.
   - **Chat:** Use `src/components/ui/scroll-area.tsx` for the message history and `src/components/ui/input.tsx` + `button.tsx` for the chat input. 
   - *Note for AI:* For this prototype phase, use mock data objects in `src/game/data.ts` for the friends list and chat history, but ensure the components are wrapped in a way that allows easy swapping to Supabase real-time subscriptions (`src/integrations/supabase/`) later.

**Instructions for AI Copilot:** 
Please begin by outlining the changes you will make to `src/game/store.ts` (Phase 1 & 3), and then provide the code for `AvatarBar.tsx` and the Transition logic in `Game.tsx`.