// src/hooks/useClientMeetingIntegration.ts
import { useCallback } from 'react';
import { awardReputation } from '../game/gameEngine';
import { useGameSave } from './useGameSave';

/**
 * useClientMeetingIntegration
 * 
 * Custom hook that handles the completion of any ClientMeeting scene.
 * It awards reputation, persists the game state, and optionally triggers navigation.
 * 
 * ============================================
 * USAGE EXAMPLE (copy this into App.tsx or parent component):
 * 
 * const { handleMeetingComplete } = useClientMeetingIntegration();
 * 
 * <RiveraClientMeeting 
 *   onComplete={(strategy, repGain) => handleMeetingComplete(strategy, repGain, () => {
 *     // Navigate to next phase (Evidence Library, Courtroom, etc.)
 *     navigateToNextScreen();
 *   })}
 * />
 * ============================================
 */
export const useClientMeetingIntegration = () => {
  const { saveGame } = useGameSave();

  const handleMeetingComplete = useCallback((
    strategy: 'suppression' | 'first_amendment' | 'dual',
    reputationGain: number,
    onNavigate?: () => void
  ) => {
    // Award reputation through the official game engine
    awardReputation(reputationGain);

    // Persist game state immediately
    saveGame();

    // Optional navigation callback (e.g. go to Evidence Library or Courtroom)
    if (onNavigate) {
      setTimeout(onNavigate, 300);
    }

    return { strategy, reputationGain };
  }, [saveGame]);

  return { handleMeetingComplete };
};