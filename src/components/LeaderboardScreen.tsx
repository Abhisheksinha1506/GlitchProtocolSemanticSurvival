import { useEffect, useState } from 'react';
import { Trophy, ArrowLeft, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLeaderboard } from '../utils/api';
import { LeaderboardEntry } from '../types/game';
import { GlitchText } from './GlitchText';

export function LeaderboardScreen() {
  const { resetGame } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard(10);
      setEntries(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    resetGame();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 sm:p-8 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" />
            <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tighter uppercase">
              <GlitchText text="LEADERBOARD" className="text-green-500" />
            </h1>
          </div>
          <p className="text-green-900 font-mono text-[10px] tracking-[0.4em] uppercase">[TOP_SURVIVORS_REGISTRY]</p>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="text-center py-20 font-mono animate-pulse text-green-900 uppercase">
              [SYNCHRONIZING_DATA...]
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center border border-green-900/30 p-12 bg-green-950/5 font-mono">
              <p className="text-green-800 text-xs sm:text-sm uppercase tracking-widest">
                No survivors recorded.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`border p-4 font-mono relative group transition-all ${
                    index === 0 ? 'border-yellow-500/50 bg-yellow-950/10' :
                    index === 1 ? 'border-gray-500/30 bg-gray-950/10' :
                    index === 2 ? 'border-orange-900/30 bg-orange-950/10' :
                    'border-green-900/20 bg-green-950/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold italic w-8 ${
                      index === 0 ? 'text-yellow-500' : 'text-green-900'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-sm sm:text-base font-bold truncate ${
                          index === 0 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {entry.player_name}
                        </span>
                        {index === 0 && <Crown className="w-3 h-3 text-yellow-500 animate-bounce" />}
                      </div>
                      <div className="flex gap-3 text-[8px] sm:text-[10px] text-green-800 uppercase tracking-tighter">
                        <span>SEC: {entry.sectors_completed}</span>
                        <span className="opacity-30">|</span>
                        <span>DUR: {formatDuration(entry.game_duration)}</span>
                      </div>
                    </div>

                    <div className={`text-xl sm:text-2xl font-bold tabular-nums ${
                      index === 0 ? 'text-yellow-400' : 'text-green-500'
                    }`}>
                      {entry.final_score}
                    </div>
                  </div>
                  {index === 0 && (
                     <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 blur-2xl rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4">
          <button
            onClick={handleBack}
            className="w-full bg-black hover:bg-green-950/50 text-green-500 font-bold py-4 font-mono text-sm border border-green-900 hover:border-green-500 flex items-center justify-center gap-3 transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            [RETURN_TO_CORE]
          </button>
        </div>
      </div>
    </div>
  );
}
