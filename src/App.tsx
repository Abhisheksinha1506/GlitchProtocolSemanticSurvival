import { GameProvider, useGame } from './context/GameContext';
import { MenuScreen } from './components/MenuScreen';
import { CorruptionPhase } from './components/CorruptionPhase';
import { SurvivalPhase } from './components/SurvivalPhase';
import { GameOverScreen } from './components/GameOverScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { FullscreenGuard } from './components/FullscreenGuard';

import { useEffect } from 'react';

function GameContent() {
  const { phase } = useGame();

  useEffect(() => {
    const handleFirstInteraction = () => {
      const doc = document.documentElement as any;
      const requestFS = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.mozRequestFullScreen || doc.msRequestFullscreen;
      
      if (!document.fullscreenElement && requestFS) {
        // Only try to request if we're actually in the game or if it's a real user gesture
        // The background warning happened because it was called in a context browser didn't like.
        requestFS.call(doc).catch((e: any) => {
           if (e.name !== 'TypeError' && !e.message?.includes('user gesture')) {
             console.warn("Background FS request failed", e);
           }
        });
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <>
      <FullscreenGuard />
      {(() => {
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
      })()}
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
