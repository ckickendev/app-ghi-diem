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
  
  export interface PlayerWithScore extends Player {
    totalPoints: number;
  }