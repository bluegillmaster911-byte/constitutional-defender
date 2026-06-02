# Constitutional Defender

An interactive constitutional law simulation and educational platform.

## Current Status: Phase 1 Complete

**Stabilized Game Engine** with:
- Centralized game constants
- Robust verdict calculation (Perfect Defense → Loss)
- 6-tier career progression system
- Automatic localStorage save system
- Full TypeScript support

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/
├── constants/game.ts      # All game balance values
├── game/gameEngine.ts     # Core logic
├── hooks/useGameSave.ts   # localStorage persistence
├── types/game.ts          # TypeScript definitions
└── App.tsx                # Main interface
```

## Roadmap

- Phase 2: Evidence System
- Phase 3: Courtroom Overhaul
- Phase 6: Multi-Amendment Campaign

---

Built with React 19 + TypeScript + Vite