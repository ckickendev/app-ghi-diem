import React, { createContext, useState, useContext, ReactNode } from 'react';

const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

interface Player {
    name: string;
    avatar: string;
}

interface Round {
    id: number;
    scores: number[];
}

interface GameContextType {
    players: Player[];
    setPlayers: (players: Player[]) => void;
    rounds: Round[];
    setRounds: (rounds: Round[]) => void;
    gameEnded: boolean;
    setGameEnded: (ended: boolean) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([
        { name: '', avatar: avatarColors[0] },
        { name: '', avatar: avatarColors[1] },
        { name: '', avatar: avatarColors[2] },
        { name: '', avatar: avatarColors[3] }
    ]);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [gameEnded, setGameEnded] = useState(false);

    const resetGame = () => {
        setRounds([]);
        setGameEnded(false);
    };

    return (
        <GameContext.Provider value={{
            players,
            setPlayers,
            rounds,
            setRounds,
            gameEnded,
            setGameEnded,
            resetGame
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
