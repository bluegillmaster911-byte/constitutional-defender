import { useState } from 'react';
import { useGameSave } from './hooks/useGameSave';
import { calculateVerdict, awardReputation, calculateTier } from './game/gameEngine';
import type { VerdictResult } from './types/game';
import { TIER_REQUIREMENTS, STARTING_TIER } from './constants/game';

function App() {
  const { playerState, updatePlayer, resetGame, isLoaded } = useGameSave();

  const [currentScore, setCurrentScore] = useState(75);
  const [evidenceUsed, setEvidenceUsed] = useState(3);
  const [correctObjections, setCorrectObjections] = useState(2);
  const [totalObjections, setTotalObjections] = useState(3);
  const [lastVerdict, setLastVerdict] = useState<VerdictResult | null>(null);

  // 🔒 MUST block render BEFORE any unsafe access
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading save data...
      </div>
    );
  }

  // 🔒 safe tier lookup (prevents undefined crash)
  const tierInfo =
    TIER_REQUIREMENTS[playerState?.tier] ??
    TIER_REQUIREMENTS[STARTING_TIER];

  const nextTier =
    playerState.tier < 6
      ? TIER_REQUIREMENTS[(playerState.tier + 1) as keyof typeof TIER_REQUIREMENTS]
      : null;

  const handleSimulateCase = () => {
    // 🔒 input sanitization (prevents NaN / negative / invalid state crashes)
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

    const updatedState = awardReputation(playerState, verdict.reputationGained);
    const tierResult = calculateTier(updatedState.reputation, playerState.tier);

    const finalVerdict: VerdictResult = {
      ...verdict,
      newTier: tierResult.newTier,
      promoted: tierResult.promoted,
    };

    setLastVerdict(finalVerdict);
    updatePlayer(updatedState);
  };

  const handleReset = () => {
    resetGame();
    setLastVerdict(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* Header */}
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
              {playerState?.name ?? "Counselor"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Player Status Card */}
        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <div className="text-xs uppercase tracking-[2px] text-blue-400 mb-1">
                Current Rank
              </div>
              <div className="text-3xl sm:text-4xl font-semibold leading-none">
                {tierInfo.name}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400">Reputation</div>
              <div className="text-3xl sm:text-4xl font-mono text-emerald-400 tabular-nums">
                {playerState.reputation.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <div>
              Cases:{' '}
              <span className="font-mono text-blue-400">
                {playerState.casesCompleted}
              </span>
            </div>
            <div className="text-slate-600 hidden sm:inline">•</div>
            <div>Tier {playerState.tier} / 6</div>
          </div>

          {nextTier && (
            <div className="mt-3 text-xs text-slate-400">
              Next promotion at{' '}
              <span className="font-mono">
                {nextTier.reputation.toLocaleString()}
              </span>{' '}
              reputation
            </div>
          )}
        </div>

        {/* Simulation Panel */}
        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold mb-5">Case Simulation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs text-slate-400 block mb-2">
                Case Score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="text-center font-mono text-lg mt-1 text-blue-400">
                {currentScore}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                Evidence Used
              </label>
              <input
                type="number"
                value={evidenceUsed}
                onChange={(e) =>
                  setEvidenceUsed(Math.max(0, Number(e.target.value)))
                }
                className="bg-[#1f2937] border border-slate-600 rounded-xl px-4 py-3 w-full text-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                Correct Objections
              </label>
              <input
                type="number"
                value={correctObjections}
                onChange={(e) =>
                  setCorrectObjections(Math.max(0, Number(e.target.value)))
                }
                className="bg-[#1f2937] border border-slate-600 rounded-xl px-4 py-3 w-full text-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                Total Objections
              </label>
              <input
                type="number"
                value={totalObjections}
                onChange={(e) =>
                  setTotalObjections(Math.max(1, Number(e.target.value)))
                }
                className="bg-[#1f2937] border border-slate-600 rounded-xl px-4 py-3 w-full text-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleSimulateCase}
            className="w-full bg-blue-600 active:bg-blue-700 transition-colors py-4 rounded-2xl font-semibold text-lg touch-manipulation"
          >
            Simulate Case Outcome
          </button>
        </div>

        {/* Verdict Result */}
        {lastVerdict && (
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
            <div className="uppercase tracking-[2px] text-xs text-blue-400 mb-2">
              Verdict
            </div>
            <div className="text-2xl sm:text-3xl font-semibold mb-3 capitalize">
              {lastVerdict.type.replace('_', ' ')}
            </div>
            <p className="text-slate-300 mb-5 leading-relaxed">
              {lastVerdict.message}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                Score:{' '}
                <span className="font-mono text-blue-400">
                  {lastVerdict.score}
                </span>
              </div>
              <div>
                Reputation:{' '}
                <span className="font-mono text-emerald-400">
                  +{lastVerdict.reputationGained}
                </span>
              </div>
              {lastVerdict.promoted && (
                <div className="text-amber-400 font-medium">
                  ★ PROMOTED TO NEW TIER
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-600 active:bg-slate-800 transition-colors text-sm font-medium"
          >
            Reset All Progress
          </button>

          <div className="text-xs text-slate-500 text-center sm:text-right">
            Phase 1 • Stabilized Game Engine
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;