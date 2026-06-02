import { WIN_THRESHOLD, TIER_REQUIREMENTS, MAX_TIER, CASE_REWARDS } from '../constants/game';
import type { PlayerState, VerdictResult, Tier } from '../types/game';

export function calculateVerdict(
  score: number,
  evidenceUsed: number,
  correctObjections: number,
  totalObjections: number
): VerdictResult {
  const accuracy = totalObjections > 0 ? correctObjections / totalObjections : 1;
  const finalScore = score * 0.6 + accuracy * 0.4;

  let type: VerdictResult['type'];
  let reputationGained = CASE_REWARDS.baseReputation;
  let message: string;

  if (finalScore >= 0.9 && evidenceUsed >= 4) {
    type = 'perfect_defense';
    reputationGained += CASE_REWARDS.perfectBonus;
    message = 'Outstanding work, Counselor. A textbook constitutional defense.';
  } else if (finalScore >= 0.75) {
    type = 'strong_victory';
    reputationGained += CASE_REWARDS.strongBonus;
    message = 'Strong performance. The jury was convinced by your arguments.';
  } else if (finalScore >= WIN_THRESHOLD) {
    type = 'narrow_victory';
    reputationGained += CASE_REWARDS.narrowBonus;
    message = 'A narrow victory. You held the line.';
  } else if (finalScore >= 0.45) {
    type = 'hung_jury';
    reputationGained = Math.floor(reputationGained * 0.4);
    message = 'The jury could not reach a unanimous decision.';
  } else {
    type = 'loss';
    reputationGained = Math.floor(reputationGained * 0.2);
    message = "The prosecution's case stood.";
  }

  return {
    type,
    score: Math.round(finalScore * 100),
    reputationGained: Math.max(0, reputationGained),
    message,
    promoted: false,
  };
}

export function calculateTier(currentReputation: number, currentTier: Tier) {
  let newTier: Tier = currentTier;
  for (let tier = MAX_TIER; tier >= 1; tier--) {
    if (currentReputation >= TIER_REQUIREMENTS[tier as Tier].reputation) {
      newTier = tier as Tier;
      break;
    }
  }
  return {
    newTier,
    promoted: newTier > currentTier,
    tierName: TIER_REQUIREMENTS[newTier].name,
  };
}

export function awardReputation(currentState: PlayerState, amount: number): PlayerState {
  const newRep = Math.min(currentState.reputation + amount, 50000);
  const tier = calculateTier(newRep, currentState.tier);
  return { ...currentState, reputation: newRep, tier: tier.newTier, casesCompleted: currentState.casesCompleted + 1 };
}

export function unlockEvidence(current: string[], id: string) {
  return current.includes(id) ? current : [...current, id];
}

export function calculateEvidenceScore(evidence: any[]) {
  if (!evidence.length) return 0;
  return evidence.reduce((s, e) => s + (e.strength + e.credibility + e.relevance) / 3, 0) / evidence.length;
}

export function canUnlockHiddenEvidence(trust: number, action: boolean) {
  return trust >= 50 || action;
}
