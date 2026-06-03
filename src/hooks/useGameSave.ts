import { useEffect, useState } from "react";
import type { PlayerState } from "../types/game";
import { STARTING_TIER, STARTING_REPUTATION } from "../constants/game";

const SAVE_KEY = "constitutional-defender-save";

const DEFAULT_STATE: PlayerState = {
  name: "Counselor",
  tier: STARTING_TIER,
  reputation: STARTING_REPUTATION,
  casesCompleted: 0,
  evidenceUnlocked: [],
  achievements: [],
};

export function useGameSave() {
  const [playerState, setPlayerState] = useState<PlayerState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setPlayerState({ ...DEFAULT_STATE, ...parsed });
        }
      }
    } catch (e) {
      console.error("Save load failed:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(playerState));
    } catch (e) {
      console.error("Save write failed:", e);
    }
  }, [playerState, isLoaded]);

  const updatePlayer = (updates: Partial<PlayerState>) => {
    setPlayerState((prev) => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setPlayerState(DEFAULT_STATE);
  };

  return { playerState, updatePlayer, resetGame, isLoaded };
}