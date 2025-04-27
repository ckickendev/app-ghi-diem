import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Player, Game, GameScore, GameState } from '../types';

interface GameStateContextType {
  players: Player[];
  games: Game[];
  currentView: GameState['currentView'];
  isLoading: boolean;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  editPlayer: (id: string, name: string) => void;
  addGame: (scores: GameScore[]) => void;
  deleteGame: (id: string) => void;
  setCurrentView: (view: GameState['currentView']) => void;
  calculateTotalPoints: (playerId: string) => number;
  getLeaderboard: () => (Player & { totalPoints: number })[];
  resetAllData: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const gameState = useGameState();

  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
};