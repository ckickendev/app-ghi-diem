import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Player, Game, GameScore } from '../types';

const STORAGE_KEY = 'game-point-calculator';

const initialState: GameState = {
  players: [],
  games: [],
  currentView: 'players'
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setState(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    
    if (!isLoading) {
      saveData();
    }
  }, [state, isLoading]);

  const addPlayer = (name: string) => {
    if (!name.trim()) return;
    
    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim()
    };
    
    setState(prevState => ({
      ...prevState,
      players: [...prevState.players, newPlayer]
    }));
  };

  const removePlayer = (id: string) => {
    setState(prevState => ({
      ...prevState,
      players: prevState.players.filter(player => player.id !== id)
    }));
  };

  const editPlayer = (id: string, name: string) => {
    if (!name.trim()) return;
    
    setState(prevState => ({
      ...prevState,
      players: prevState.players.map(player => 
        player.id === id ? { ...player, name: name.trim() } : player
      )
    }));
  };

  const addGame = (scores: GameScore[]) => {
    const newGame: Game = {
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      scores
    };
    
    setState(prevState => ({
      ...prevState,
      games: [...prevState.games, newGame],
      currentView: 'leaderboard'
    }));
  };

  const deleteGame = (id: string) => {
    setState(prevState => ({
      ...prevState,
      games: prevState.games.filter(game => game.id !== id)
    }));
  };

  const setCurrentView = (view: GameState['currentView']) => {
    setState(prevState => ({
      ...prevState,
      currentView: view
    }));
  };

  const calculateTotalPoints = (playerId: string): number => {
    return state.games.reduce((total, game) => {
      const playerScore = game.scores.find(score => score.playerId === playerId);
      return total + (playerScore ? playerScore.points : 0);
    }, 0);
  };

  const getLeaderboard = () => {
    return state.players
      .map(player => ({
        ...player,
        totalPoints: calculateTotalPoints(player.id)
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const resetAllData = async () => {
    setState(initialState);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return {
    players: state.players,
    games: state.games,
    currentView: state.currentView,
    isLoading,
    addPlayer,
    removePlayer,
    editPlayer,
    addGame,
    deleteGame,
    setCurrentView,
    calculateTotalPoints,
    getLeaderboard,
    resetAllData
  };
};