// Add these imports near the top of src/App.tsx
import React, { useState } from 'react';
import RiveraClientMeeting from './scenes/ClientMeeting/RiveraClientMeeting';
import { useGameSave } from './hooks/useGameSave';
import { awardReputation } from './game/gameEngine';

// Example integration inside your main App component or Hub screen
const App: React.FC = () => {
  const [showRiveraMeeting, setShowRiveraMeeting] = useState(false);
  const { saveGame, loadGame } = useGameSave();

  const handleRiveraComplete = (strategy: 'suppression' | 'first_amendment' | 'dual', reputationGain: number) => {
    awardReputation(reputationGain);
    saveGame(); // Persist updated reputation and state
    setShowRiveraMeeting(false);
    // Navigate to next screen (e.g., Evidence Library or Courtroom)
    console.log(`Strategy selected: ${strategy} | Reputation gained: ${reputationGain}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* Your existing navigation / hub UI */}
      <button 
        onClick={() => setShowRiveraMeeting(true)}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
      >
        Begin Client Meeting – State v. Rivera
      </button>

      {/* Render the scene when triggered */}
      {showRiveraMeeting && (
        <RiveraClientMeeting 
          onComplete={handleRiveraComplete}
          selectedLawyerGender="male" // or "female" based on player choice
        />
      )}
    </div>
  );
};

export default App;