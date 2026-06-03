# Constitutional Defender - Development Guide for Grok

## Project Overview

**Constitutional Defender** is an interactive educational simulation game about constitutional law. Players take the role of a defense attorney, building their career through legal cases while learning constitutional principles.

**Current Status:** Phase 1 Complete (Stabilized Game Engine)
**Live Demo:** [Vercel Deployment URL]
**Repository:** https://github.com/bluegillmaster911-byte/constitutional-defender

---

## Architecture & File Structure

```
constitutional-defender/
├── src/
│   ├── App.tsx                 # Main UI/Navigation (React)
│   ├── constants/
│   │   └── game.ts             # All game balance values & constants
│   ├── game/
│   │   └── gameEngine.ts       # Core logic (verdict calculation, tier progression)
│   ├── hooks/
│   │   └── useGameSave.ts      # localStorage persistence hook
│   ├── types/
│   │   └── game.ts             # TypeScript type definitions ⚠️ CONTAINS HOOK CODE (FIX NEEDED)
│   └── vite-env.d.ts
├── public/
│   └── manifest.json           # PWA configuration
├── vercel.json                 # Vercel deployment config
├── package.json
├── tailwind.config.js
├── tsconfig.*.json
└── index.html
```

---

## Key Files & Current Implementation

### 1. **src/constants/game.ts** - Game Balance Sheet
Controls all game mechanics and progression:

```typescript
// Career Tiers (6 total)
TIER_REQUIREMENTS: {
  1: "Junior Defender",
  2: "Associate Counsel",
  3: "Senior Counsel",
  4: "Lead Attorney",
  5: "Constitutional Specialist",
  6: "Supreme Court Advocate"
}

// Reputation thresholds for tier progression
// Values: 0, 500, 1500, 3000, 6000, 10000 (reputation points needed)

// Case rewards
CASE_REWARDS: {
  baseReputation: 800,
  perfectBonus: 400,
  strongBonus: 200,
  narrowBonus: 100
}

// Achievement system (5 achievements defined)
ACHIEVEMENTS: {
  FIRST_CASE,
  TRUTH_SEEKER,
  CROSS_EXAM_MASTER,
  CONSTITUTIONAL_CHAMPION,
  PERFECT_DEFENSE
}
```

**To Modify:** Change values here to rebalance game difficulty and progression.

---

### 2. **src/game/gameEngine.ts** - Core Logic
Handles verdict calculation and tier progression.

**Key Functions:**

- `calculateVerdict()` - Takes score/evidence/objections → returns VerdictResult
  - Verdict types: "dismissed", "partial_win", "win", "landmark"
  - Adjusts for evidence usage and objection success rate
  - Awards reputation based on verdict quality

- `calculateTier()` - Checks reputation against thresholds
  - Returns new tier and promotion flag
  - Used when player earns reputation

- `awardReputation()` - Updates player state after case
  - Increments reputation and cases completed

**To Extend:** Add new verdict types, modify scoring algorithm, add multipliers.

---

### 3. **src/hooks/useGameSave.ts** - Persistence Layer
Auto-saves player progress to localStorage.

**Current Implementation:**
- Saves on every player state change
- Loads on component mount
- Auto-merges new player data with saved data (safe for schema changes)

**To Extend:** Add cloud sync, multiple save slots, export/import.

⚠️ **NOTE:** There's a type file naming issue. The actual `game.ts` type definitions need to be reviewed.

---

### 4. **src/App.tsx** - UI Shell
6 main screens implemented:

1. **Home** - Dashboard with stats (rank, cases won, next goal)
2. **Characters** - Team members and NPCs (placeholder images)
3. **Courtroom** - Trial simulation (empty - needs implementation)
4. **Evidence** - Evidence library (placeholder)
5. **Case Studies** - Constitutional learning content (sample case included)
6. **Profile** - Player achievements and history (placeholder)

**Navigation:** Bottom tab bar with 6 menu items.

**Styling:** Tailwind CSS with dark theme (#0a0f1c background, blue/amber accents).

---

## Phase 2-6 Development Roadmap

### Phase 2: Evidence System 🎯 **NEXT**

**Requirements:**
- [ ] Create `src/types/evidence.ts` - Define evidence types and properties
- [ ] Create `src/evidence/evidenceLibrary.ts` - Evidence database and logic
- [ ] Update `src/constants/game.ts` - Add evidence balance values
- [ ] Build Evidence UI screen - Show available evidence, filter/sort
- [ ] Integrate with verdict calculation - Use selected evidence in scoring
- [ ] Add evidence unlock mechanism - Reward after each case

**Key Features:**
- Evidence quality tiers (1-5 stars)
- Evidence types: Constitutional precedent, witness testimony, documentary
- Unlock system - Earn evidence by winning cases
- Evidence tree - Show which evidence leads to better verdicts
- Evidence crafting - Combine evidence for special combos

**File Plan:**
```
src/
├── types/
│   ├── game.ts (update)
│   └── evidence.ts (new)
├── evidence/
│   ├── evidenceLibrary.ts (new)
│   └── useEvidenceSystem.ts (new)
└── constants/
    └── game.ts (update with EVIDENCE_VALUES)
```

---

### Phase 3: Courtroom Overhaul 🎪

**Requirements:**
- [ ] Interactive courtroom dialogue system
- [ ] Branching dialogue choices (player decisions matter)
- [ ] NPC character development and relationships
- [ ] Jury interaction mechanics
- [ ] Objection system with penalties/rewards
- [ ] Cross-examination mini-game
- [ ] Verdict calculation from player choices

**Key Features:**
- Real case scenarios with constitutional implications
- Multiple ending paths (dismiss, partial win, full win, landmark)
- Character reactions to player strategy
- Jury confidence meter (visual feedback)
- Time limit for decisions (add tension)
- Voice narration support (optional)

**File Plan:**
```
src/
├── scenes/ (new)
│   ├── courtroomScene.tsx
│   ├── dialogueSystem.ts
│   └── juryInteraction.ts
├── game/
│   └── gameEngine.ts (update verdict logic)
└── ui/
    └── CourtRoom.tsx (new - main courtroom screen)
```

---

### Phase 4: Career Progression System

**Requirements:**
- [ ] Law firm advancement
- [ ] Client relationship tracking
- [ ] Case difficulty scaling
- [ ] Player specialization choices (civil rights, criminal defense, etc.)
- [ ] Mentor relationships
- [ ] Rival attorneys (competitive tension)

---

### Phase 5: Learning Modules

**Requirements:**
- [ ] Constitutional amendment modules (1st-14th)
- [ ] Legal precedent database
- [ ] Interactive case studies
- [ ] Quiz system with rewards
- [ ] Educational content integration

---

### Phase 6: Multi-Amendment Campaign 🏁

**Requirements:**
- [ ] Campaign narrative arc
- [ ] Amendment-focused case series
- [ ] Final boss battle (landmark Supreme Court case)
- [ ] Multiple endings based on player choices
- [ ] Achievement completion
- [ ] Leaderboard system

---

## Type Definitions (PlayerState)

```typescript
interface PlayerState {
  name: string;                    // Player's attorney name
  tier: Tier;                      // Career tier (1-6)
  reputation: number;              // Reputation points
  casesCompleted: number;           // Total cases won
  evidenceUnlocked: string[];       // Array of evidence IDs
  achievements: AchievementId[];    // Earned achievements
}

type Tier = 1 | 2 | 3 | 4 | 5 | 6;
type AchievementId = "first_case" | "truth_seeker" | ...
```

---

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **Sonner** - Toast notifications
- **localStorage** - Data persistence

---

## Development Workflow

### Running Locally
```bash
npm install
npm run dev
# Opens http://localhost:5173
```

### Building for Production
```bash
npm run build
# Creates dist/ folder
```

### Deploying to Vercel
```bash
vercel --prod
# Auto-builds and deploys from GitHub
```

### Linting
```bash
npm run lint
```

---

## Known Issues & TODO

⚠️ **Critical:**
- [ ] Fix `src/types/game.ts` - Contains hook code, should only have type definitions
- [ ] Player state not fully integrated with App.tsx (hardcoded values)
- [ ] No actual case logic - courtroom screen shows placeholder

✏️ **Minor:**
- [ ] Character images need to be added to `/public/characters/`
- [ ] PWA manifest icons need implementation
- [ ] Mobile responsiveness needs testing on Galaxy S25 Ultra
- [ ] Performance optimization for large evidence trees

---

## Git Workflow for Grok

When continuing development:

```bash
# Start new feature
git checkout -b feature/phase-2-evidence

# Make changes, test locally
npm run dev

# Commit
git add .
git commit -m "feat: Phase 2 - Evidence system foundation"

# Push
git push origin feature/phase-2-evidence

# Create Pull Request on GitHub
```

---

## Important Constants to Balance

**For Future Tweaking:**

```typescript
// From src/constants/game.ts
WIN_THRESHOLD = 0.6                    // Verdict score needed to win
MAX_REPUTATION = 50000                 // Max achievable reputation
JURY_STARTING_PERCENT = 50             // Starting jury confidence
OBJECTION_SUCCESS_REPUTATION = 150     // Reward for correct objection
OBJECTION_FAILURE_REPUTATION = -75     // Penalty for wrong objection
```

Adjust these values to modify game difficulty and pacing.

---

## Questions for Continuation?

1. **Should evidence affect verdict scoring directly or just unlock new paths?**
   - Recommendation: Direct scoring impact (affects calculateVerdict function)

2. **How many cases per phase?**
   - Suggestion: 3-5 cases per phase with increasing difficulty

3. **Should there be a story mode (linear) or sandbox mode (random)?**
   - Start with story mode (phases 2-3), add sandbox later

4. **Multiplayer/leaderboard?**
   - Phase 6+ feature with Firebase backend

---

## Contact & Handoff

This project is ready for Phase 2 implementation. All foundational systems (game engine, save system, UI shell) are in place.

**Next Developer:** Grok AI
**Start Date:** [Current Date]
**Repository:** https://github.com/bluegillmaster911-byte/constitutional-defender

---

**Happy Coding! ⚖️** 📚
