import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { createGameSession } from '../utils/api';
import { GlitchText } from './GlitchText';
import { initAudio } from '../utils/audio';

export function MenuScreen() {
  const { setPhase, setPlayerName, setSessionId, resetGame } = useGame();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!name.trim()) return;

    const doc = document.documentElement as any;
    const requestFS = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.mozRequestFullScreen || doc.msRequestFullscreen;
    
    if (requestFS) {
      try {
        await requestFS.call(doc);
      } catch (e) {
        console.warn("Fullscreen request failed", e);
      }
    }

    resetGame();
    initAudio();
    setLoading(true);
    try {
      const sessionId = await createGameSession(name);
      setPlayerName(name);
      setSessionId(sessionId);
      setPhase('corruption');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeaderboard = () => {
    setPhase('leaderboard');
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 sm:p-6 flex flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-black to-red-900 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl sm:text-3xl animate-pulse">💀</span>
            <span className="text-2xl sm:text-3xl">🖥️</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
            <GlitchText text="GLITCH" className="text-green-400 block" />
            <GlitchText text="PROTOCOL" className="text-green-400 block -mt-2" />
          </h1>

          <div className="text-red-500 text-xs sm:text-sm font-mono tracking-widest uppercase animate-pulse">
            [SEMANTIC CORRUPTION DETECTED]
          </div>
        </div>

        {/* Status Panel */}
        <div className="bg-green-950/20 border border-green-800 p-4 font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <div className="space-y-1">
            <p className="text-green-300 flex justify-between">
              <span>STATUS:</span>
              <span className="text-red-500 font-bold">COMPROMISED</span>
            </p>
            <p className="text-green-300 flex justify-between">
              <span>DATABASE:</span>
              <span className="text-red-500 font-bold">CORRUPTED</span>
            </p>
            <p className="text-green-300 flex justify-between">
              <span>PROTOCOL:</span>
              <span className="text-yellow-500 font-bold">ACTIVE</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-green-900/50">
            <p className="text-green-400/80 leading-relaxed text-[10px] sm:text-xs">
              AI corruption has rewritten semantics. Memorize the new meanings to survive. Error is termination.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-green-500/70 font-mono text-[10px] sm:text-xs tracking-widest uppercase">
              {'>'} ENTER OPERATOR ID
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="OPERATOR_NAME"
              className="w-full bg-black border border-green-500/50 text-green-400 px-4 py-3 font-mono focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30 transition-all text-sm sm:text-base placeholder:text-green-900"
              maxLength={20}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStart}
              disabled={!name.trim() || loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-950/50 disabled:text-green-900 text-black font-bold py-3 sm:py-4 font-mono text-sm sm:text-base transition-all border border-green-400 uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              {loading ? '[INITIALIZING...]' : '[INITIATE]'}
            </button>

            <button
              onClick={handleViewLeaderboard}
              className="w-full bg-black hover:bg-green-950 text-green-500 font-bold py-2 sm:py-3 font-mono border border-green-800 hover:border-green-500 transition-all text-xs sm:text-sm uppercase tracking-widest"
            >
              [LEADERBOARD]
            </button>
          </div>
        </div>

        {/* Footer Warning */}
        <div className="text-center font-mono space-y-1 pt-4 opacity-50">
          <p className="text-[8px] sm:text-[10px] text-green-700 tracking-[0.2em] uppercase">WARNING: FACILITY INSTABILITY DETECTED</p>
          <p className="text-[8px] sm:text-[10px] text-red-900 animate-pulse tracking-widest uppercase">TRUST NOTHING. REMEMBER EVERYTHING.</p>
        </div>
      </div>
    </div>
  );
}
