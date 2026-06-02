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
    message = 'A narrow victory. You held the line, but there were missed opportunities.';
  } else if (finalScore >= 0.45) {
    type = 'hung_jury';
    reputationGained = Math.floor(reputationGained * 0.4);
    message = 'The jury could not reach a unanimous decision. A mistrial was declared.';
  } else {
    type = 'loss';
    reputationGained = Math.floor(reputationGained * 0.2);
    message = "The prosecution's case stood. We will appeal and fight another day.";
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
    const requirement = TIER_REQUIREMENTS[tier as Tier];
    if (currentReputation >= requirement.reputation) {
      newTier = tier as Tier;
      break;
    }
  }

  const promoted = newTier > currentTier;

  return {
    newTier,
    promoted,
    tierName: TIER_REQUIREMENTS[newTier].name,
  };
}

export function awardReputation(currentState: PlayerState, amount: number): PlayerState {
  const newReputation = Math.min(currentState.reputation + amount, 50000);
  const tierResult = calculateTier(newReputation, currentState.tier);

  return {
    ...currentState,
    reputation: newReputation,
    tier: tierResult.newTier,
    casesCompleted: currentState.casesCompleted + 1,
  };
}

export function unlockEvidence(currentEvidence: string[], newEvidenceId: string): string[] {
  if (currentEvidence.includes(newEvidenceId)) return currentEvidence;
  return [...currentEvidence, newEvidenceId];
}

export function calculateEvidenceScore(evidence: any[]): number {
  if (evidence.length === 0) return 0;
  const total = evidence.reduce((sum: number, item: any) => sum + (item.strength + item.credibility + item.relevance) / 3, 0);
  return total / evidence.length;
}

export function canUnlockHiddenEvidence(trustLevel: number, specificActionTaken: boolean): boolean {
  return trustLevel >= 50 || specificActionTaken;
}