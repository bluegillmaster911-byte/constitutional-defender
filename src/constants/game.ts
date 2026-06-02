export const WIN_THRESHOLD = 0.6;
export const MAX_TIER = 6;

export const TIER_REQUIREMENTS = {
  1: { reputation: 0, name: "Junior Defender", title: "Junior Defender" },
  2: { reputation: 2500, name: "Associate", title: "Associate Counsel" },
  3: { reputation: 6000, name: "Senior Counsel", title: "Senior Counsel" },
  4: { reputation: 12000, name: "Lead Attorney", title: "Lead Attorney" },
  5: { reputation: 20000, name: "Constitutional Specialist", title: "Constitutional Specialist" },
  6: { reputation: 35000, name: "Supreme Court Advocate", title: "Supreme Court Advocate" },
} as const;

export const CASE_REWARDS = {
  baseReputation: 800,
  perfectBonus: 400,
  strongBonus: 200,
  narrowBonus: 100,
} as const;

export const EVIDENCE_QUALITY = {
  MIN: 1,
  MAX: 5,
} as const;

export const MAX_REPUTATION = 50000;

export const STARTING_REPUTATION = 0;
export const STARTING_TIER = 1;

export const JURY_STARTING_PERCENT = 50;
export const OBJECTION_SUCCESS_REPUTATION = 150;
export const OBJECTION_FAILURE_REPUTATION = -75;

export const ACHIEVEMENTS = {
  FIRST_CASE: "first_case",
  TRUTH_SEEKER: "truth_seeker",
  CROSS_EXAM_MASTER: "cross_exam_master",
  CONSTITUTIONAL_CHAMPION: "constitutional_champion",
  PERFECT_DEFENSE: "perfect_defense",
} as const;

export type AchievementId = (typeof ACHIEVEMENTS)[keyof typeof ACHIEVEMENTS];