import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { createGameSession } from '../utils/api';
import { GlitchText } from './GlitchText';
import { initAudio } from '../utils/audio';

export function MenuScreen() {
  const { setPhase, setPlayerName, setSessionId } = useGame();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!name.trim()) return;

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
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-black to-red-900 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 border-2 border-green-500 p-8 bg-black/80 shadow-2xl shadow-green-500/50">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 text-red-500 animate-pulse flex items-center justify-center">💀</div>
            <div className="w-12 h-12 text-green-500 flex items-center justify-center">🖥️</div>
          </div>

          <h1 className="text-6xl font-bold tracking-wider">
            <GlitchText text="GLITCH PROTOCOL" className="text-green-400" />
          </h1>

          <div className="text-red-500 text-xl font-mono animate-pulse">
            [SEMANTIC CORRUPTION DETECTED]
          </div>
        </div>

        <div className="bg-green-950/30 border border-green-700 p-6 space-y-3 font-mono text-sm">
          <p className="text-green-300">{'>'} SYSTEM STATUS: <span className="text-red-500">COMPROMISED</span></p>
          <p className="text-green-300">{'>'} LINGUISTIC DATABASE: <span className="text-red-500">CORRUPTED</span></p>
          <p className="text-green-300">{'>'} SURVIVAL PROTOCOL: <span className="text-yellow-500">ACTIVE</span></p>
          <p className="mt-4 text-green-400 leading-relaxed">
            The facility AI has corrupted word definitions. To survive, you must REMEMBER the corrupted meanings,
            not the real ones. Each sector introduces new corruption. One mistake... and you're TERMINATED.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-green-400 mb-2 font-mono text-sm">
              {'>'} ENTER OPERATOR ID:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Type your name..."
              className="w-full bg-black border-2 border-green-500 text-green-400 px-4 py-3 font-mono focus:outline-none focus:border-green-300 focus:shadow-lg focus:shadow-green-500/50 transition-all"
              maxLength={20}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!name.trim() || loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-4 font-mono text-lg transition-all border-2 border-green-400 hover:shadow-lg hover:shadow-green-500/50 disabled:border-gray-600"
          >
            {loading ? '[INITIALIZING...]' : '[INITIATE PROTOCOL]'}
          </button>

          <button
            onClick={handleViewLeaderboard}
            className="w-full bg-black hover:bg-green-950 text-green-400 font-bold py-3 font-mono border-2 border-green-600 hover:border-green-400 transition-all"
          >
            [VIEW LEADERBOARD]
          </button>
        </div>

        <div className="text-center text-green-600 text-xs font-mono space-y-1">
          <p>WARNING: This facility is unstable</p>
          <p className="text-red-600 animate-pulse">Trust nothing. Remember everything.</p>
        </div>
      </div>
    </div>
  );
}
