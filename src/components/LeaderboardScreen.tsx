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
    <div className="min-h-screen bg-black text-green-400 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-4 border-2 border-green-500 p-8 bg-black">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold font-mono">
              <GlitchText text="LEADERBOARD" className="text-green-400" />
            </h1>
          </div>
          <p className="text-green-500 font-mono">[TOP SURVIVORS]</p>
        </div>

        {loading ? (
          <div className="text-center text-2xl font-mono animate-pulse">
            [LOADING DATA...]
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center border-2 border-green-600 p-8 bg-green-950/20">
            <p className="text-green-400 font-mono text-lg">
              No survivors yet. Be the first to enter the protocol.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`border-2 p-4 font-mono flex items-center justify-between ${
                  index === 0
                    ? 'border-yellow-500 bg-yellow-950/20'
                    : index === 1
                    ? 'border-gray-400 bg-gray-950/20'
                    : index === 2
                    ? 'border-orange-700 bg-orange-950/20'
                    : 'border-green-700 bg-green-950/10'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`text-2xl font-bold w-12 text-center ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {index === 0 && <Crown className="w-8 h-8 mx-auto" />}
                    {index !== 0 && `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {entry.player_name}
                    </div>
                    <div className="text-sm text-green-600">
                      Sectors: {entry.sectors_completed} | Time: {formatDuration(entry.game_duration)}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {entry.final_score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleBack}
          className="w-full bg-black hover:bg-green-950 text-green-400 font-bold py-4 font-mono text-lg border-2 border-green-600 hover:border-green-400 flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          [RETURN TO MENU]
        </button>
      </div>
    </div>
  );
}
