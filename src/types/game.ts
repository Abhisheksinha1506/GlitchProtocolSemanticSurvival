export interface CorruptedDefinition {
  original: string;
  corrupted: string;
}

export interface GameScenario {
  scenario: string;
  option1: string;
  option2: string;
  correctOption: number;
  explanation: string;
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
