// src/App.tsx
import React, { useState } from 'react';
import RiveraClientMeeting from './scenes/ClientMeeting/RiveraClientMeeting';
import { useClientMeetingIntegration } from './hooks/useClientMeetingIntegration';

// ======================================================
// CONSTITUTIONAL DEFENDER - MAIN APPLICATION
// ======================================================
// This is the root component. All major scenes are controlled here.
// Add new scenes by following the same pattern used for RiveraClientMeeting.
// ======================================================

const App: React.FC = () => {
  // ======================================================
  // STATE MANAGEMENT
  // ======================================================
  const [showRiveraMeeting, setShowRiveraMeeting] = useState(false);
  
  // Future scene states (add more as you build)
  // const [showEvidenceLibrary, setShowEvidenceLibrary] = useState(false);
  // const [showCourtroom, setShowCourtroom] = useState(false);

  // ======================================================
  // HOOKS
  // ======================================================
  const { handleMeetingComplete } = useClientMeetingIntegration();

  // ======================================================
  // HANDLERS
  // ======================================================
  
  /**
   * Called when the player finishes the Rivera Client Meeting.
   * Awards reputation, saves progress, and navigates to the next phase.
   */
  const handleRiveraComplete = (
    strategy: 'suppression' | 'first_amendment' | 'dual', 
    repGain: number
  ) => {
    handleMeetingComplete(strategy, repGain, () => {
      // After meeting completes, close the meeting and move to next phase
      console.log(`Rivera meeting complete. Strategy: ${strategy} | Reputation gained: ${repGain}`);
      
      setShowRiveraMeeting(false);

      // TODO: Navigate to next screen (Evidence Library, Courtroom, etc.)
      // Example:
      // setShowEvidenceLibrary(true);
    });
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      
      {/* 
        ======================================================
        MAIN HUB / NAVIGATION
        Add your main menu, case list, career progress, etc. here.
        ======================================================
      */}
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Constitutional Defender</h1>
        <p className="text-blue-400 mb-8">Phase 3 • Interactive Client Meetings</p>

        {/* Main Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => setShowRiveraMeeting(true)}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-2xl font-semibold text-lg transition-all shadow-lg"
          >
            Begin Client Meeting – State v. Rivera
          </button>

          {/* Placeholder buttons for future scenes */}
          <button 
            disabled
            className="w-full md:w-auto px-8 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-semibold text-lg cursor-not-allowed"
          >
            Evidence Library (Coming Soon)
          </button>

          <button 
            disabled
            className="w-full md:w-auto px-8 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-semibold text-lg cursor-not-allowed"
          >
            Enter Courtroom (Coming Soon)
          </button>
        </div>
      </div>

      {/* 
        ======================================================
        SCENE RENDERING
        Only one major scene should be active at a time.
        ======================================================
      */}

      {/* Rivera Client Meeting Scene */}
      {showRiveraMeeting && (
        <RiveraClientMeeting 
          onComplete={handleRiveraComplete}
          selectedLawyerGender="male"   // Change to "female" based on player avatar selection
        />
      )}

      {/* Future scenes will be added here using the same pattern */}
      {/* {showEvidenceLibrary && <EvidenceLibrary />} */}
      {/* {showCourtroom && <CourtroomScene />} */}
    </div>
  );
};

export default App; 