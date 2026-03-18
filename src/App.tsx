import { GameProvider, useGame } from './context/GameContext';
import { MenuScreen } from './components/MenuScreen';
import { CorruptionPhase } from './components/CorruptionPhase';
import { SurvivalPhase } from './components/SurvivalPhase';
import { GameOverScreen } from './components/GameOverScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';

function GameContent() {
  const { phase } = useGame();

  switch (phase) {
    case 'menu':
      return <MenuScreen />;
    case 'corruption':
      return <CorruptionPhase />;
    case 'survival':
      return <SurvivalPhase />;
    case 'gameover':
      return <GameOverScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    default:
      return <MenuScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
