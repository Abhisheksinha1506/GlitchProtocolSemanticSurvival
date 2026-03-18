import { createContext, useContext, useState, ReactNode } from 'react';
import { CorruptedDefinition, GamePhase } from '../types/game';

interface GameContextType {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  currentSector: number;
  setCurrentSector: (sector: number) => void;
  score: number;
  setScore: (score: number) => void;
  corruptedDefinitions: CorruptedDefinition[];
  setCorruptedDefinitions: (definitions: CorruptedDefinition[]) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  lives: number;
  setLives: (lives: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [playerName, setPlayerName] = useState('');
  const [currentSector, setCurrentSector] = useState(1);
  const [score, setScore] = useState(0);
  const [corruptedDefinitions, setCorruptedDefinitions] = useState<CorruptedDefinition[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [lives, setLives] = useState(3);

  const resetGame = () => {
    setPhase('menu');
    setPlayerName('');
    setCurrentSector(1);
    setScore(0);
    setCorruptedDefinitions([]);
    setSessionId(null);
    setTimeRemaining(30);
    setLives(3);
  };

  return (
    <GameContext.Provider
      value={{
        phase,
        setPhase,
        playerName,
        setPlayerName,
        currentSector,
        setCurrentSector,
        score,
        setScore,
        corruptedDefinitions,
        setCorruptedDefinitions,
        sessionId,
        setSessionId,
        timeRemaining,
        setTimeRemaining,
        lives,
        setLives,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
