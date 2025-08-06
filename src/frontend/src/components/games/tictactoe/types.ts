// ----------------------------------------------------------- //
// --------------------- Tictactoe types --------------------- //
// ----------------------------------------------------------- //

// Types for TicTacToe game

export type Player = 'X' | 'O' | null;

export interface GameState {
  squares: Player[];
  isXNext: boolean;
  winner: Player;
  isDraw: boolean;
  score: { X: number; O: number };
  gameNumber: number;
}

export interface OnlineGameState {
  board: Player[];
  current_player: Player;
  players: {
    X: { id: string; username: string } | null;
    O: { id: string; username: string } | null;
  };
  state: 'waiting' | 'playing' | 'ended';
  winner: Player | 'draw' | null;
  score: { X: number; O: number };
  ready_for_new_game?: { X: boolean; O: boolean };
}

// Player stats
export interface PlayerStats {
  id: number;
  user: {
    id: string;
    username: string;
    picture?: string;
  };
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  win_rate: number;
}

// Match from history
export interface Match {
  id: string;
  room_id: string;
  player1: {
    id: string;
    username: string;
    picture?: string;
  };
  player2: {
    id: string;
    username: string;
    picture?: string;
  };
  winner?: {
    id: string;
    username: string;
  };
  is_draw: boolean;
  created_at: string;
}