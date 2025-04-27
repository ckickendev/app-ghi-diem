export interface Player {
  id: string;
  name: string;
}

export interface GameScore {
  playerId: string;
  points: number;
}

export interface Game {
  id: string;
  date: string;
  scores: GameScore[];
}

export interface GameState {
  players: Player[];
  games: Game[];
  currentView: 'players' | 'newGame' | 'history' | 'leaderboard';
}

export interface RootStackParamList {
  Players: undefined;
  NewGame: undefined;
  History: undefined;
  Leaderboard: undefined;
  GameDetail: { gameId: string };
  EditPlayer: { playerId: string };
}

export interface PlayerWithScore extends Player {
  totalPoints: number;
}