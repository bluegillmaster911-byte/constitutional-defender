import { PlayerState, Tier } from "../types/game";

export type VerdictType = "dismissed" | "partial_win" | "win" | "landmark";

export interface VerdictResult {
  type: VerdictType;
  score: number;
  message: string;
  reputationGained: number;
}

export function calculateVerdict(
  score: number,
  evidenceUsed: number,
  correctObjections: number,
  totalObjections: number
): VerdictResult {
  const objectionRatio =
    totalObjections > 0 ? correctObjections / totalObjections : 0;

  const evidencePenalty = Math.min(evidenceUsed * 0.02, 0.2);
  const adjustedScore = Math.max(0, score - evidencePenalty + objectionRatio * 0.2);

  let type: VerdictType = "dismissed";
  let reputationGained = 10;
  let message = "Case dismissed.";

  if (adjustedScore > 0.85) {
    type = "landmark";
    reputationGained = 120;
    message = "Landmark constitutional victory achieved.";
  } else if (adjustedScore > 0.7) {
    type = "win";
    reputationGained = 80;
    message = "Strong legal victory in your favor.";
  } else if (adjustedScore > 0.5) {
    type = "partial_win";
    reputationGained = 40;
    message = "Partial success with limited recognition.";
  }

  return {
    type,
    score: Number(adjustedScore.toFixed(2)),
    message,
    reputationGained,
  };
}

export function awardReputation(state: PlayerState, gain: number): PlayerState {
  return {
    ...state,
    reputation: state.reputation + gain,
    casesCompleted: state.casesCompleted + 1,
  };
}

export function calculateTier(
  reputation: number,
  currentTier: Tier
): { newTier: Tier; promoted: boolean } {
  const thresholds: Record<Tier, number> = {
    1: 0,
    2: 500,
    3: 1500,
    4: 3000,
    5: 6000,
    6: 10000,
  };

  let newTier = currentTier;

  for (const tier of Object.keys(thresholds) as unknown as Tier[]) {
    if (reputation >= thresholds[tier]) {
      newTier = tier;
    }
  }

  return {
    newTier,
    promoted: newTier > currentTier,
  };
}