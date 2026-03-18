import { Skull, RotateCcw, Trophy, Save, Check, XCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GlitchText } from './GlitchText';
import { useEffect, useState } from 'react';

export function GameOverScreen() {
  const { score, currentSector, playerName, resetGame, setPhase } = useGame();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const saveToPuter = async () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.puter) {
        setSaveStatus('saving');
        try {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const saveContent = JSON.stringify({
            playerName,
            score,
            sector: currentSector,
            date: new Date().toISOString()
          }, null, 2);
          
          // @ts-ignore
          await window.puter.fs.write(`glitch-protocol-save-${timestamp}.json`, saveContent);
          setSaveStatus('success');
        } catch (err) {
          console.error("Failed to save to Puter:", err);
          setSaveStatus('error');
        }
      }
    };

    saveToPuter();
  }, [playerName, score, currentSector]);

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleViewLeaderboard = () => {
    setPhase('leaderboard');
  };

  return (
    <div className="min-h-screen bg-black text-red-400 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 border-2 border-red-500 p-8 bg-black shadow-2xl shadow-red-500/50">
        <div className="text-center space-y-4">
          <Skull className="w-20 h-20 mx-auto text-red-500 animate-pulse" />

          <h1 className="text-6xl font-bold font-mono">
            <GlitchText text="TERMINATED" className="text-red-500" />
          </h1>

          <div className="bg-red-950/30 border border-red-700 p-4">
            <p className="text-red-400 font-mono text-lg">
              [SEMANTIC FAILURE - SYSTEM SHUTDOWN]
            </p>
          </div>
        </div>

        <div className="bg-black border-2 border-red-600 p-6 space-y-4 font-mono">
          <div className="flex justify-between items-center text-lg">
            <span className="text-green-400">OPERATOR:</span>
            <span className="text-yellow-400 font-bold">{playerName}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-green-400">FINAL SCORE:</span>
            <span className="text-green-400 font-bold text-2xl">{score}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-green-400">SECTORS SURVIVED:</span>
            <span className="text-yellow-400 font-bold">{currentSector}</span>
          </div>
        </div>

        <div className="bg-yellow-950/30 border border-yellow-600 p-4 text-center space-y-2">
          <p className="text-yellow-400 font-mono text-sm">
            You failed to adapt to the corrupted definitions. In this facility, memory is survival.
          </p>

          {saveStatus !== 'idle' && (
            <div className={`flex items-center justify-center gap-2 text-sm font-mono ${
              saveStatus === 'success' ? 'text-green-400' : 
              saveStatus === 'error' ? 'text-red-400' : 'text-blue-400 animate-pulse'
            }`}>
              {saveStatus === 'saving' && <><Save className="w-4 h-4 animate-spin" /> SYNCHING TO PUTER CLOUD...</>}
              {saveStatus === 'success' && <><Check className="w-4 h-4" /> RECORD SECURED TO PUTER DRIVE</>}
              {saveStatus === 'error' && <><XCircle className="w-4 h-4" /> CLOUD SYNC FAILED</>}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 font-mono text-lg border-2 border-green-400 flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-green-500/50"
          >
            <RotateCcw className="w-5 h-5" />
            [TRY AGAIN]
          </button>

          <button
            onClick={handleViewLeaderboard}
            className="w-full bg-black hover:bg-yellow-950 text-yellow-400 font-bold py-4 font-mono text-lg border-2 border-yellow-600 hover:border-yellow-400 flex items-center justify-center gap-2 transition-all"
          >
            <Trophy className="w-5 h-5" />
            [VIEW LEADERBOARD]
          </button>
        </div>

        <div className="text-center text-red-600 text-xs font-mono animate-pulse">
          <p>The corruption spreads...</p>
        </div>
      </div>
    </div>
  );
}
