export interface CorruptedDefinition {
  original: string;
  corrupted: string;
}

export interface GameScenario {
  text: string;
  options: {
    text: string;
    usesCorruptedWord: boolean;
    correctChoice: boolean;
  }[];
  correctIndex: number;
}

export interface GameSession {
  id: string;
  player_name: string;
  current_sector: number;
  score: number;
  corrupted_definitions: CorruptedDefinition[];
  status: 'active' | 'completed' | 'failed';
  started_at: string;
  ended_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  final_score: number;
  sectors_completed: number;
  game_duration: number;
  created_at: string;
}

export type GamePhase = 'menu' | 'corruption' | 'survival' | 'gameover' | 'leaderboard';
