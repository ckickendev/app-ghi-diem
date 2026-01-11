import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

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
}

interface Theme {
    name: string;
    color: string;
    sound: string;
}

interface GameContextType {
    players: Player[];
    setPlayers: (players: Player[]) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    pauSong: () => void;
    themeList: Theme[];
    rounds: Round[];
    setRounds: (rounds: Round[]) => void;
    gameEnded: boolean;
    setGameEnded: (ended: boolean) => void;
    history: GameSession[];
    saveCurrentGame: () => void;
    resetGame: (clearNames?: boolean) => void;
    updatePlayerCount: (count: number) => void;
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
        { name: 'dark', color: '#111827', sound: 'ngay-xuan-long-phung-sum-vay.mp3' },
        { name: 'light', color: '#f9fafb', sound: 'ai-chuyen-cu-ban-khong.mp3' },
        { name: 'blue', color: '#eff6ff', sound: 'ai-chuyen-cu-ban-khong.mp3' }
    ];
    const [theme, setTheme] = useState(themeList[1]); // Default to light
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const playThemeSound = async (themeName: string) => {
        try {
            // Unload previous sound
            if (sound) {
                await sound.unloadAsync();
            }

            const soundAsset = themeName === 'dark'
                ? require('../assets/sounds/ngay-xuan-long-phung-sum-vay.mp3')
                : require('../assets/sounds/ai-chuyen-cu-ban-khong.mp3');

            const { sound: newSound } = await Audio.Sound.createAsync(soundAsset);
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const pauSong = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
    };

    // Cleanup sound on unmount
    useEffect(() => {
        return sound
            ? () => {
                pauSong();
            }
            : undefined;
    }, [sound]);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [history, setHistory] = useState<GameSession[]>([]);

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

        const newSession: GameSession = {
            id: Date.now(),
            date: new Date().toISOString(),
            players: [...players], // Copy players to avoid reference issues
            rounds: [...rounds]    // Copy rounds
        };

        setHistory(prev => [newSession, ...prev]);
    };

    const resetGame = (clearNames: boolean = false) => {
        // Reset rounds but keep player names for convenience? 
        // Or full reset? Requirement said "data will be deleted", usually that refers to the current game session.
        // Let's keep players for now as often preferred, but clear scores.
        setRounds([]);
        setGameEnded(false);
        if (clearNames) {
            setPlayers(prev => prev.map(p => ({ ...p, name: '' })));
        }
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
                const data = { players, rounds, gameEnded, theme };
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
            setTheme: (newTheme: Theme) => {
                setTheme(newTheme);
                playThemeSound(newTheme.name);
            },
            themeList,
            pauSong
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
