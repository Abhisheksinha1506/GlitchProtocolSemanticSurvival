import { Skull, RotateCcw, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GlitchText } from './GlitchText';

export function GameOverScreen() {
  const { score, currentSector, playerName, resetGame, setPhase } = useGame();

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleViewLeaderboard = () => {
    setPhase('leaderboard');
  };

  return (
    <div className="min-h-screen bg-black text-red-500 p-4 sm:p-8 flex flex-col items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Skull className="w-20 h-20 mx-auto text-red-600 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl font-bold font-mono tracking-tighter uppercase">
            <GlitchText text="TERMINATED" className="text-red-600" />
          </h1>
        </div>

        {/* Stats Panel */}
        <div className="bg-red-950/20 border border-red-900/50 p-6 font-mono space-y-6">
          <div className="text-center space-y-1">
            <p className="text-red-500/50 text-[10px] uppercase tracking-[0.2em]">Session Summary</p>
            <h2 className="text-2xl font-bold text-red-400 truncate">{playerName}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-red-900/30 pt-6">
            <div className="text-center">
              <p className="text-[10px] text-red-900 uppercase tracking-tighter">Sectors Survived</p>
              <p className="text-xl font-bold">{Math.max(0, currentSector - 1)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-red-900 uppercase tracking-tighter">Final Score</p>
              <p className="text-xl font-bold">{score}</p>
            </div>
          </div>

          <div className="text-[8px] sm:text-[10px] text-red-900/30 pt-4 font-mono uppercase tracking-[0.3em] text-center border-t border-red-900/10">
            {'>'} System shutdown complete. Semantic integrity zero.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePlayAgain}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 font-mono border border-red-400 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)]"
          >
            <RotateCcw className="w-5 h-5" />
            [RETRY_PROTOCOL]
          </button>
          
          <button
            onClick={handleViewLeaderboard}
            className="w-full bg-black hover:bg-red-950 text-red-500 font-bold py-3 font-mono border border-red-900 hover:border-red-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            <Trophy className="w-4 h-4" />
            [VIEW_LEADERBOARD]
          </button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-1 opacity-30">
          <p className="text-[10px] font-mono text-red-900 uppercase tracking-widest">The facility claims another victim.</p>
        </div>
      </div>
    </div>
  );
}
