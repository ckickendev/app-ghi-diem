import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import { AppState } from 'react-native';

const avatarColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#9B59B6', '#34495E', '#16A085', '#27AE60'
];

const themeList: Theme[] = [
    {
        name: 'dark',
        backgroundImage: require('../assets/theme/dark.png')
    },
    {
        name: 'light',
        backgroundImage: require('../assets/theme/light.png')
    },
    {
        name: 'tet',
        backgroundImage: require('../assets/theme/tet.png')
    }
];

const soundList: Sound[] = [
    {
        name: 'Ngày xuân long phụng sum vay',
        source: require('../assets/sounds/ngay-xuan-long-phung-sum-vay.mp3')
    },
    {
        name: 'Ai chuyện cũ bán không',
        source: require('../assets/sounds/ai-chuyen-cu-ban-khong.mp3')
    }
];

export interface Player {
    name: string;
    avatar: string;
}

interface Round {
    id: number;
    scores: number[];
}

export interface GameSession {
    id: number;
    date: string;
    players: Player[];
    rounds: Round[];
    isEnded: boolean;
}

interface Theme {
    name: string;
    backgroundImage: any;
}

interface Sound {
    name: string;
    source: string;
}

interface GameContextType {
    players: Player[];
    setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    themeList: Theme[];
    rounds: Round[];
    setRounds: (rounds: Round[]) => void;
    gameEnded: boolean;
    setGameEnded: (ended: boolean) => void;
    history: GameSession[];
    saveCurrentGame: () => void;
    resetGame: (clearNames?: boolean) => void;
    updatePlayerCount: (count: number) => void;
    isPlaySong: boolean;
    setIsPlaySong: (playSong: boolean) => void;
    loadGame: (session: GameSession) => void;
    soundList: Sound[];
    currentSound: Sound;
    setCurrentSound: (sound: Sound) => void;
    currentGameId: number | null;
    roundLimit: number;
    setRoundLimit: (limit: number) => void;
    isRoundLimitEnabled: boolean;
    setIsRoundLimitEnabled: (enabled: boolean) => void;
    isLoaded: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [players, setPlayers] = useState<Player[]>([
        { name: '', avatar: avatarColors[0] },
        { name: '', avatar: avatarColors[1] },
        { name: '', avatar: avatarColors[2] },
        { name: '', avatar: avatarColors[3] }
    ]);
    const [theme, setTheme] = useState(themeList[2]); // Default to tet
    const [currentSound, setCurrentSound] = useState<Sound>(soundList[0]);
    const [isPlaySong, setIsPlaySong] = useState(true);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [history, setHistory] = useState<GameSession[]>([]);
    const [currentGameId, setCurrentGameId] = useState<number | null>(null);
    const [roundLimit, setRoundLimit] = useState(10);
    const [isRoundLimitEnabled, setIsRoundLimitEnabled] = useState(false);

    const player = useAudioPlayer(currentSound.source);

    // Audio effects
    useEffect(() => {
        if (!player) return;
        player.replace(currentSound.source);
        player.loop = false;
        player.muted = !isPlaySong;
    }, [currentSound.source, player, isPlaySong]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (player) {
                if (nextAppState === 'active' && isPlaySong) {
                    player.play();
                } else {
                    player.pause();
                }
            }
        });
        return () => subscription.remove();
    }, [player, isPlaySong]);

    // Data persistence
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [gameData, historyData] = await Promise.all([
                    AsyncStorage.getItem('@game_data'),
                    AsyncStorage.getItem('@game_history')
                ]);

                if (gameData) {
                    const data = JSON.parse(gameData);
                    if (data.players) setPlayers(data.players);
                    if (data.rounds) setRounds(data.rounds);
                    if (typeof data.gameEnded === 'boolean') setGameEnded(data.gameEnded);
                    if (data.theme) {
                        const savedTheme = themeList.find(t => t.name === data.theme.name);
                        if (savedTheme) setTheme(savedTheme);
                    }
                    if (data.currentSound) {
                        const savedSound = soundList.find(s => s.name === data.currentSound.name);
                        if (savedSound) setCurrentSound(savedSound);
                    }
                    if (typeof data.isPlaySong === 'boolean') setIsPlaySong(data.isPlaySong);
                    if (data.currentGameId) setCurrentGameId(data.currentGameId);
                    if (data.roundLimit) setRoundLimit(data.roundLimit);
                    if (typeof data.isRoundLimitEnabled === 'boolean') setIsRoundLimitEnabled(data.isRoundLimitEnabled);
                }

                if (historyData) {
                    setHistory(JSON.parse(historyData));
                }
            } catch (e) {
                console.error('Failed to load game data', e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const saveData = async () => {
            try {
                const data = {
                    players, rounds, gameEnded, theme, currentGameId,
                    currentSound, isPlaySong, roundLimit, isRoundLimitEnabled
                };
                await AsyncStorage.setItem('@game_data', JSON.stringify(data));
                await AsyncStorage.setItem('@game_history', JSON.stringify(history));
            } catch (e) {
                console.error('Failed to save data', e);
            }
        };
        saveData();
    }, [isLoaded, players, rounds, gameEnded, theme, currentGameId, currentSound, isPlaySong, roundLimit, isRoundLimitEnabled, history]);

    const updatePlayerCount = useCallback((count: number) => {
        if (count < 2 || count > 8) return;
        setPlayers(prev => {
            if (count === prev.length) return prev;
            if (count > prev.length) {
                const newPlayers = [...prev];
                for (let i = prev.length; i < count; i++) {
                    newPlayers.push({
                        name: '',
                        avatar: avatarColors[i % avatarColors.length]
                    });
                }
                return newPlayers;
            }
            return prev.slice(0, count);
        });

        if (rounds.length > 0) {
            setRounds(prevRounds => prevRounds.map(r => ({
                ...r,
                scores: r.scores.slice(0, count)
            })));
        }
    }, [rounds.length]);

    const saveCurrentGame = useCallback(() => {
        if (rounds.length === 0) return;
        const sessionId = currentGameId || Date.now();
        const newSession: GameSession = {
            id: sessionId,
            date: new Date().toISOString(),
            players: [...players],
            rounds: [...rounds],
            isEnded: gameEnded
        };

        setHistory(prev => {
            const index = prev.findIndex(s => s.id === sessionId);
            if (index !== -1) {
                const newHistory = [...prev];
                newHistory[index] = newSession;
                return newHistory;
            }
            return [newSession, ...prev];
        });
        setCurrentGameId(sessionId);
    }, [rounds, currentGameId, players, gameEnded]);

    const resetGame = useCallback((clearNames: boolean = false) => {
        setRounds([]);
        setGameEnded(false);
        setCurrentGameId(null);
        if (clearNames) {
            setPlayers(prev => prev.map(p => ({ ...p, name: '' })));
        }
    }, []);

    const loadGame = useCallback((session: GameSession) => {
        if (rounds.length > 0) {
            saveCurrentGame();
        }
        setPlayers(session.players);
        setRounds(session.rounds);
        setGameEnded(false);
        setCurrentGameId(session.id);
    }, [rounds.length, saveCurrentGame]);

    const contextValue = useMemo(() => ({
        players, setPlayers, rounds, setRounds, gameEnded, setGameEnded,
        history, saveCurrentGame, resetGame, updatePlayerCount,
        theme, setTheme, themeList, isPlaySong, setIsPlaySong,
        loadGame, currentGameId, soundList, currentSound, setCurrentSound,
        roundLimit, setRoundLimit, isRoundLimitEnabled, setIsRoundLimitEnabled, isLoaded
    }), [
        players, rounds, gameEnded, history, saveCurrentGame, resetGame,
        updatePlayerCount, theme, isPlaySong, loadGame, currentGameId,
        currentSound, roundLimit, isRoundLimitEnabled, isLoaded
    ]);

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
