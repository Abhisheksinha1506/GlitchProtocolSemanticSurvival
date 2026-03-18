import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getRandomWordPairs } from '../utils/wordPairs';
import { updateGameSession } from '../utils/api';
import { GlitchText } from './GlitchText';
import { playGlitch, playTimerTick } from '../utils/audio';

export function CorruptionPhase() {
  const {
    currentSector,
    setPhase,
    setCorruptedDefinitions,
    corruptedDefinitions,
    sessionId,
  } = useGame();
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isFirstSector = currentSector === 1;
    const countToAdd = isFirstSector ? 3 : 2;
    const newDefinitions = getRandomWordPairs(Math.min(countToAdd, 25 - corruptedDefinitions.length), corruptedDefinitions);
    const combinedDefinitions = isFirstSector ? newDefinitions : [...corruptedDefinitions, ...newDefinitions];
    
    setCorruptedDefinitions(combinedDefinitions);

    if (sessionId) {
      updateGameSession(sessionId, {
        current_sector: currentSector,
        corrupted_definitions: combinedDefinitions,
      }).catch(console.error);
    }

    setLoading(false);
    playGlitch();
  }, [currentSector]);

  useEffect(() => {
    if (loading) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        playTimerTick();
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('survival');
    }
  }, [countdown, loading, setPhase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-2xl font-mono animate-pulse">
          [INITIALIZING SECTOR {currentSector}...]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-6 border-2 border-red-500 p-8 bg-black shadow-2xl shadow-red-500/50">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
          <h2 className="text-4xl font-bold font-mono">
            <GlitchText text={`SECTOR ${currentSector}`} className="text-red-500" />
          </h2>
        </div>

        <div className="bg-red-950/30 border border-red-700 p-4 text-center">
          <p className="text-red-400 font-mono text-lg animate-pulse">
            [DATABASE CORRUPTION DETECTED]
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-green-300 font-mono text-center text-lg">
            MEMORIZE THESE CORRUPTED DEFINITIONS:
          </p>

          {corruptedDefinitions.length > 5 ? (
            <div className="relative w-full overflow-hidden bg-red-950/20 border-y-2 border-red-600 py-6 h-24">
              <div className="absolute whitespace-nowrap animate-marquee flex gap-16 items-center h-full">
                {[...corruptedDefinitions, ...corruptedDefinitions].map((def, i) => (
                  <div key={i} className="inline-flex items-center gap-3 font-mono">
                    <span className="text-yellow-400 text-xl font-bold">"{def.original}"</span>
                    <span className="text-green-400 text-2xl">→</span>
                    <span className="text-red-400 text-xl font-bold animate-pulse">"{def.corrupted}"</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {corruptedDefinitions.map((def, i) => (
                <div
                  key={i}
                  className="bg-green-950/20 border-2 border-green-600 p-4 font-mono animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-yellow-400 text-xl font-bold">"{def.original}"</span>
                    <span className="text-green-400 text-2xl">→</span>
                    <span className="text-red-400 text-xl font-bold">"{def.corrupted}"</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center space-y-4 pt-6">
          <div className="text-6xl font-bold font-mono text-green-400 animate-pulse">
            {countdown}
          </div>
          <p className="text-green-500 font-mono">
            [SURVIVAL PHASE INITIATING...]
          </p>
        </div>

        <div className="bg-yellow-950/30 border border-yellow-600 p-3 text-center">
          <p className="text-yellow-400 text-sm font-mono">
            ⚠ USE THE CORRUPTED MEANINGS TO SURVIVE ⚠
          </p>
        </div>
      </div>
    </div>
  );
}
