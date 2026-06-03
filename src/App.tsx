import { useState } from "react";
import { useGameSave } from "./hooks/useGameSave";
import {
  calculateVerdict,
  awardReputation,
  calculateTier,
  VerdictResult,
} from "./game/gameEngine";
import { TIER_REQUIREMENTS, STARTING_TIER } from "./constants/game";

function App() {
  const { playerState, updatePlayer, resetGame, isLoaded } = useGameSave();

  const [currentScore, setCurrentScore] = useState(75);
  const [evidenceUsed, setEvidenceUsed] = useState(3);
  const [correctObjections, setCorrectObjections] = useState(2);
  const [totalObjections, setTotalObjections] = useState(3);
  const [lastVerdict, setLastVerdict] = useState<VerdictResult | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Constitutional Defender...
      </div>
    );
  }

  const tierInfo =
    TIER_REQUIREMENTS[playerState.tier] ??
    TIER_REQUIREMENTS[STARTING_TIER];

  const handleSimulateCase = () => {
    setProcessing(true);

    const safeScore = Math.max(0, Math.min(1, currentScore / 100));
    const safeEvidence = Math.max(0, evidenceUsed);
    const safeCorrect = Math.max(0, correctObjections);
    const safeTotal = Math.max(1, totalObjections);

    const verdict = calculateVerdict(
      safeScore,
      safeEvidence,
      safeCorrect,
      safeTotal
    );

    const updated = awardReputation(playerState, verdict.reputationGained);
    const tierResult = calculateTier(updated.reputation, playerState.tier);

    const final: VerdictResult = {
      ...verdict,
      newTier: tierResult.newTier,
      promoted: tierResult.promoted,
    };

    updatePlayer(updated);

    setTimeout(() => {
      setLastVerdict(final);
      setProcessing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-6">
      <h1 className="text-2xl font-bold mb-2">Constitutional Defender</h1>
      <p className="text-slate-400 mb-6">{playerState.name}</p>

      <div className="bg-[#111827] p-4 rounded-xl mb-6">
        <div className="text-blue-400">Current Rank</div>
        <div className="text-3xl font-semibold">{tierInfo.name}</div>

        <div className="mt-2 text-sm text-slate-400">
          Reputation: {playerState.reputation}
        </div>
      </div>

      <div className="space-y-4 bg-[#111827] p-4 rounded-xl">
        <input
          type="range"
          min="0"
          max="100"
          value={currentScore}
          onChange={(e) => setCurrentScore(Number(e.target.value))}
        />

        <input
          type="number"
          value={evidenceUsed}
          onChange={(e) => setEvidenceUsed(Number(e.target.value))}
        />

        <input
          type="number"
          value={correctObjections}
          onChange={(e) => setCorrectObjections(Number(e.target.value))}
        />

        <input
          type="number"
          value={totalObjections}
          onChange={(e) => setTotalObjections(Number(e.target.value))}
        />

        <button
          onClick={handleSimulateCase}
          className="w-full bg-blue-600 p-3 rounded-xl"
        >
          {processing ? "Processing..." : "Simulate Case"}
        </button>
      </div>

      {lastVerdict && (
        <div className="mt-6 bg-[#111827] p-4 rounded-xl">
          <div className="text-xl font-semibold">{lastVerdict.type}</div>
          <div className="text-slate-300">{lastVerdict.message}</div>
        </div>
      )}

      <button
        onClick={resetGame}
        className="mt-6 text-sm text-red-400"
      >
        Reset
      </button>
    </div>
  );
}

export default App; 