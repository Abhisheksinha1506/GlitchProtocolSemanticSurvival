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

    setTimeout(() => {
      setLoading(false);
      playGlitch();
    }, 500);
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
    <div className="min-h-screen bg-black text-green-400 p-4 sm:p-8 flex flex-col items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tighter uppercase">
            <GlitchText text={`SECTOR ${currentSector}`} className="text-red-500" />
          </h2>
        </div>

        {/* Status Panel */}
        <div className="bg-red-950/20 border border-red-900/50 p-4 font-mono">
          <p className="text-red-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-2 animate-pulse">
            [DATABASE_CORRUPTION_CRITICAL]
          </p>
          <div className="text-[10px] sm:text-xs text-red-700 space-y-1">
            <p className="opacity-80">
              {currentSector === 1 && "> Initial breach detected. Semantic anchors failing."}
              {currentSector === 2 && "> Cognitive dissonance increasing. Facility atmosphere unstable."}
              {currentSector === 3 && "> Neural architecture rewriting. Logic is decaying."}
              {currentSector > 3 && `> SECTOR ${currentSector} INTELLIGENCE: The lexicon is bleeding.`}
            </p>
            <p className="opacity-40 text-[8px] sm:text-[10px]">
              LOCATION: CORE_NODE_{currentSector.toString().padStart(3, '0')} | STATUS: UNSTABLE
            </p>
          </div>
        </div>

        {/* Corrupted Definitions */}
        <div className="space-y-4">
          <p className="text-green-500/70 font-mono text-[10px] sm:text-xs tracking-widest text-center uppercase">
            MEMORIZE_CORRUPTED_DEFINITIONS:
          </p>

          <div className="grid gap-3 sm:gap-4">
            {corruptedDefinitions.slice(-3).map((def, i) => (
              <div
                key={i}
                className="bg-green-950/10 border border-green-900/50 p-4 font-mono group hover:border-green-500/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-yellow-500/80 text-sm sm:text-base font-bold italic">"{def.original}"</span>
                  <span className="text-green-500/30 text-xl font-light">→</span>
                  <span className="text-red-500 text-sm sm:text-base font-bold animate-pulse">"{def.corrupted}"</span>
                </div>
              </div>
            ))}
          </div>
          
          {corruptedDefinitions.length > 3 && (
            <p className="text-[8px] text-green-900 font-mono text-center uppercase">
              + {corruptedDefinitions.length - 3} OTHER ACTIVE CORRUPTIONS IN MEMORY BUFFER
            </p>
          )}
        </div>

        {/* Countdown */}
        <div className="text-center space-y-4 py-4">
          <div className="text-6xl sm:text-7xl font-bold font-mono text-green-500 tabular-nums">
            0{countdown}
          </div>
          <p className="text-green-900 font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase">
            [INITIATING_SURVIVAL_SEQUENCE]
          </p>
        </div>

        {/* Footer Warning */}
        <div className="bg-yellow-950/10 border border-yellow-900/30 p-3 text-center">
          <p className="text-yellow-600/70 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase">
            ⚠ USE THE CORRUPTED MEANINGS TO SURVIVE ⚠
          </p>
        </div>
      </div>
    </div>
  );
}
