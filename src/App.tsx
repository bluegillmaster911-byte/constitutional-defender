import { useState } from 'react';
import { useGameSave } from './hooks/useGameSave';
import {
  calculateVerdict,
  awardReputation,
  calculateTier,
} from './game/gameEngine';
import type { VerdictResult } from './types/game';
import { TIER_REQUIREMENTS, STARTING_TIER } from './constants/game';

function App() {
  const { playerState, updatePlayer, resetGame, isLoaded } = useGameSave();

  const [currentScore, setCurrentScore] = useState(75);
  const [evidenceUsed, setEvidenceUsed] = useState(3);
  const [correctObjections, setCorrectObjections] = useState(2);
  const [totalObjections, setTotalObjections] = useState(3);
  const [lastVerdict, setLastVerdict] = useState<VerdictResult | null>(null);
  const [processing, setProcessing] = useState(false);

  // 🔒 HARD GUARD (prevents blank screen / early crash)
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Constitutional Defender...
      </div>
    );
  }

  // 🔒 SAFE TIER RESOLVE (prevents undefined crash)
  const tierInfo =
    TIER_REQUIREMENTS[playerState?.tier] ??
    TIER_REQUIREMENTS[STARTING_TIER];

  const nextTier =
    playerState.tier < 6
      ? TIER_REQUIREMENTS[(playerState.tier + 1) as keyof typeof TIER_REQUIREMENTS]
      : null;

  const handleSimulateCase = () => {
    setProcessing(true);

    // 🔒 INPUT SANITIZATION (prevents NaN + instability)
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

    const updatedState = awardReputation(
      playerState,
      verdict.reputationGained
    );

    const tierResult = calculateTier(
      updatedState.reputation,
      playerState.tier
    );

    const finalVerdict: VerdictResult = {
      ...verdict,
      newTier: tierResult.newTier,
      promoted: tierResult.promoted,
    };

    updatePlayer(updatedState);

    setTimeout(() => {
      setLastVerdict(finalVerdict);
      setProcessing(false);
    }, 300);
  };

  const handleReset = () => {
    resetGame();
    setLastVerdict(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* HEADER */}
      <header className="border-b border-slate-700 bg-[#0f1629] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Constitutional Defender
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
              Legal Simulation & Constitutional Education Platform
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Counselor</div>
            <div className="font-medium text-sm sm:text-base">
              {playerState.name}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* PLAYER STATUS */}
        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <div className="text-xs uppercase tracking-[2px] text-blue-400 mb-1">
                Current Rank
              </div>
              <div className="text-3xl sm:text-4xl font-semibold">
                {tierInfo.name}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400">Reputation</div>
              <div className="text-3xl sm:text-4xl font-mono text-emerald-400">
                {playerState.reputation.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              Cases:{' '}
              <span className="text-blue-400 font-mono">
                {playerState.casesCompleted}
              </span>
            </div>
            <div>Tier {playerState.tier} / 6</div>
          </div>

          {nextTier && (
            <div className="mt-3 text-xs text-slate-400">
              Next promotion at{' '}
              <span className="font-mono">
                {nextTier.reputation.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* SIMULATION */}
        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold mb-5">Case Simulation</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">

            <div>
              <label className="text-xs text-slate-400">Case Score</label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="text-center text-blue-400 font-mono">
                {currentScore}
              </div>
            </div>

            <input
              type="number"
              value={evidenceUsed}
              onChange={(e) => setEvidenceUsed(Number(e.target.value))}
              className="bg-[#1f2937] p-3 rounded-xl"
              placeholder="Evidence Used"
            />

            <input
              type="number"
              value={correctObjections}
              onChange={(e) => setCorrectObjections(Number(e.target.value))}
              className="bg-[#1f2937] p-3 rounded-xl"
              placeholder="Correct Objections"
            />

            <input
              type="number"
              value={totalObjections}
              onChange={(e) => setTotalObjections(Number(e.target.value))}
              className="bg-[#1f2937] p-3 rounded-xl"
              placeholder="Total Objections"
            />
          </div>

          <button
            onClick={handleSimulateCase}
            className="w-full bg-blue-600 py-4 rounded-2xl font-semibold"
          >
            {processing ? 'Processing Case...' : 'Simulate Case Outcome'}
          </button>
        </div>

        {/* VERDICT */}
        {lastVerdict && (
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
            <div className="text-blue-400 text-xs uppercase mb-2">
              Verdict
            </div>

            <div className="text-2xl font-semibold mb-2">
              {lastVerdict.type.replace('_', ' ')}
            </div>

            <p className="text-slate-300 mb-4">
              {lastVerdict.message}
            </p>

            <div className="flex gap-6 text-sm">
              <div>Score: {lastVerdict.score}</div>
              <div className="text-emerald-400">
                +{lastVerdict.reputationGained}
              </div>
              {lastVerdict.promoted && (
                <div className="text-amber-400 font-bold">
                  PROMOTED
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESET */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="border border-slate-600 px-5 py-3 rounded-xl"
          >
            Reset Progress
          </button>

          <div className="text-xs text-slate-500">
            Phase 1 • Stable Build
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;