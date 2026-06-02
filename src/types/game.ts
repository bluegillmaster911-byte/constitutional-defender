import { AchievementId } from "../constants/game";

export type Tier = 1 | 2 | 3 | 4 | 5 | 6;

export interface PlayerState {
  name: string;
  tier: Tier;
  reputation: number;
  casesCompleted: number;
  evidenceUnlocked: string[];
  achievements: AchievementId[];
}

export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  source: string;
  strength: number;
  credibility: number;
  relevance: number;
  unlocked: boolean;
  hidden?: boolean;
}

export interface Case {
  id: string;
  title: string;
  amendment: string;
  description: string;
  scenario: string;
  evidence: EvidenceItem[];
  witnesses: string[];
}

export type VerdictType =
  | "perfect_defense"
  | "strong_victory"
  | "narrow_victory"
  | "hung_jury"
  | "loss";

export interface VerdictResult {
  type: VerdictType;
  score: number;
  reputationGained: number;
  message: string;
  newTier?: Tier;
  promoted: boolean;
}

export interface GameAction {
  type: "objection" | "present_evidence" | "cross_examine" | "opening" | "closing";
  payload?: any;
}