import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';

const avatarColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#9B59B6', '#34495E', '#16A085', '#27AE60'
];

interface Player {
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
    setPlayers: (players: Player[]) => void;
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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([
        { name: '', avatar: avatarColors[0] },
        { name: '', avatar: avatarColors[1] },
        { name: '', avatar: avatarColors[2] },
        { name: '', avatar: avatarColors[3] }
    ]);
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
    const [theme, setTheme] = useState(themeList[2]); // Default to tet
    const [currentSound, setCurrentSound] = useState<Sound>(soundList[0]);
    const [isPlaySong, setIsPlaySong] = useState(true);

    const player = useAudioPlayer(currentSound.source);

    // Handle sound change / asset replacement
    useEffect(() => {
        if (player) {
            player.replace(currentSound.source);
            player.loop = true;
            player.muted = !isPlaySong;
            player.play();
        }
    }, [currentSound, player]);

    // Handle mute change
    useEffect(() => {
        if (player) {
            player.muted = !isPlaySong;
        }
    }, [isPlaySong, player]);

    const [rounds, setRounds] = useState<Round[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [history, setHistory] = useState<GameSession[]>([]);
    const [currentGameId, setCurrentGameId] = useState<number | null>(null);
    const [roundLimit, setRoundLimit] = useState(10);
    const [isRoundLimitEnabled, setIsRoundLimitEnabled] = useState(false);

    const updatePlayerCount = (count: number) => {
        if (count < 2 || count > 8) return;

        setPlayers(prev => {
            if (count === prev.length) return prev;

            if (count > prev.length) {
                // Add new players
                const newPlayers = [...prev];
                for (let i = prev.length; i < count; i++) {
                    newPlayers.push({
                        name: '',
                        avatar: avatarColors[i % avatarColors.length]
                    });
                }
                return newPlayers;
            } else {
                // Remove players
                const newPlayers = prev.slice(0, count);
                // Also need to trim rounds data if we want to be strict, 
                // but usually resizing happens at setup. 
                // We'll warn user in UI if they resize mid-game (not implemented yet).
                return newPlayers;
            }
        });

        // If we reduce players, we should probably reset/trim rounds to match?
        // For now let's assume this is only done at setup where there are no rounds.
        if (rounds.length > 0) {
            // If changing player count mid-game, we need to adjust existing rounds or warn.
            // Simplified: Just slice the scores in rounds.
            setRounds(prevRounds => prevRounds.map(r => ({
                ...r,
                scores: r.scores.slice(0, count)
                // Note: if increasing, we might need to add 0s? 
                // But typically this is done before game starts.
                // If extending:
                // scores: [...r.scores, ...Array(count - r.scores.length).fill(0)]
            })));
        }
    };
    const saveCurrentGame = () => {
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
    };

    const resetGame = (clearNames: boolean = false) => {
        setRounds([]);
        setGameEnded(false);
        setCurrentGameId(null);
        if (clearNames) {
            setPlayers(prev => prev.map(p => ({ ...p, name: '' })));
        }
    };

    const loadGame = (session: GameSession) => {
        if (rounds.length > 0) {
            saveCurrentGame();
        }
        setPlayers(session.players);
        setRounds(session.rounds);
        setGameEnded(false);
        setCurrentGameId(session.id);
    };

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@game_data');
                // Also load history
                const historyJson = await AsyncStorage.getItem('@game_history');

                if (jsonValue !== null) {
                    const data = JSON.parse(jsonValue);
                    if (data.players) setPlayers(data.players);
                    if (data.rounds) setRounds(data.rounds);
                    if (typeof data.gameEnded === 'boolean') setGameEnded(data.gameEnded);
                    if (data.theme) setTheme(data.theme);
                    if (data.currentSound) {
                        const savedSound = soundList.find(s => s.name === data.currentSound.name);
                        if (savedSound) setCurrentSound(savedSound);
                    }
                    if (typeof data.isPlaySong === 'boolean') setIsPlaySong(data.isPlaySong);
                    if (data.currentGameId) setCurrentGameId(data.currentGameId);
                    if (data.roundLimit) setRoundLimit(data.roundLimit);
                    if (typeof data.isRoundLimitEnabled === 'boolean') setIsRoundLimitEnabled(data.isRoundLimitEnabled);
                }

                if (historyJson !== null) {
                    setHistory(JSON.parse(historyJson));
                }
            } catch (e) {
                console.error('Failed to load game data', e);
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        const saveData = async () => {
            try {
                const data = {
                    players,
                    rounds,
                    gameEnded,
                    theme,
                    currentGameId,
                    currentSound,
                    isPlaySong,
                    roundLimit,
                    isRoundLimitEnabled
                };
                await AsyncStorage.setItem('@game_data', JSON.stringify(data));
            } catch (e) {
                console.error('Failed to save game data', e);
            }
        };

        saveData();
    }, [players, rounds, gameEnded, theme, isLoaded]); // added theme dependency

    useEffect(() => {
        if (!isLoaded) return;

        const saveHistory = async () => {
            try {
                await AsyncStorage.setItem('@game_history', JSON.stringify(history));
            } catch (e) {
                console.error('Failed to save history', e);
            }
        };

        saveHistory();
    }, [history, isLoaded]);

    return (
        <GameContext.Provider value={{
            players,
            setPlayers,
            rounds,
            setRounds,
            gameEnded,
            setGameEnded,
            history,
            saveCurrentGame,
            resetGame,
            updatePlayerCount,
            theme,
            setTheme,
            themeList,
            isPlaySong,
            setIsPlaySong,
            loadGame,
            currentGameId,
            soundList,
            currentSound,
            setCurrentSound,
            roundLimit,
            setRoundLimit,
            isRoundLimitEnabled,
            setIsRoundLimitEnabled,
        }}>
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
