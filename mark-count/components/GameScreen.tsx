import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Plus, Eye, EyeOff, Trophy } from 'lucide-react-native';
import NewRoundModal from './NewRoundModal';
import { useGame } from '../context/GameContext';
import PlayerHeader from './Game/PlayerHeader';
import GameSummary from './Game/GameSummary';
import RoundsList from './Game/RoundsList';

const GameScreen: React.FC = () => {
    const {
        players,
        setPlayers,
        rounds,
        setRounds,
        gameEnded,
        setGameEnded,
        resetGame,
        saveCurrentGame,
        roundLimit,
        isRoundLimitEnabled
    } = useGame();
    const [showNewRound, setShowNewRound] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');

    // Auto-save to history when rounds change or game state changes
    useEffect(() => {
        if (rounds.length > 0) {
            saveCurrentGame();
        }
    }, [rounds, gameEnded, saveCurrentGame]);

    const totals = useMemo(() => {
        const results = new Array(players.length).fill(0);
        rounds.forEach((round) => {
            round.scores.forEach((score, idx) => {
                if (idx < results.length) {
                    results[idx] += score;
                }
            });
        });
        return results;
    }, [players.length, rounds]);

    const handleAddRound = useCallback((scores: number[]) => {
        const newRounds = [...rounds, {
            id: Date.now(),
            scores: scores
        }];
        setRounds(newRounds);
        setShowNewRound(false);

        if (isRoundLimitEnabled && newRounds.length >= roundLimit) {
            setGameEnded(true);
            setShowScores(true);
            Alert.alert(
                'Game kết thúc',
                `Đã đạt giới hạn ${roundLimit} ván chơi.`
            );
        }
    }, [rounds, setRounds, isRoundLimitEnabled, roundLimit, setGameEnded]);

    const handleDeleteRound = useCallback((id: number) => {
        Alert.alert(
            "Xóa ván này?",
            "",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: () => setRounds(rounds.filter(r => r.id !== id)) }
            ]
        );
    }, [rounds, setRounds]);

    const handleEditPlayer = useCallback((idx: number) => {
        setEditingPlayer(idx);
        setTempName(players[idx].name);
    }, [players]);

    const handleSavePlayerName = useCallback(() => {
        if (tempName.trim() && editingPlayer !== null) {
            const newPlayers = [...players];
            newPlayers[editingPlayer].name = tempName.trim();
            setPlayers(newPlayers);
        }
        setEditingPlayer(null);
        setTempName('');
    }, [tempName, editingPlayer, players, setPlayers]);

    const handleEndGame = useCallback(() => {
        if (rounds.length === 0) {
            Alert.alert('Thông báo', 'Chưa có ván nào!');
            return;
        }
        setGameEnded(true);
        setShowScores(true);
    }, [rounds.length, setGameEnded]);

    const handleNewGame = useCallback(() => {
        Alert.alert(
            "Dữ liệu sẽ được xoá để qua ván mới",
            "Bạn có chắc muốn chơi lại từ đầu?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: () => {
                        saveCurrentGame();
                        resetGame();
                    }
                }
            ]
        );
    }, [saveCurrentGame, resetGame]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <PlayerHeader
                    players={players}
                    totals={totals}
                    gameEnded={gameEnded}
                    showScores={showScores}
                    editingPlayer={editingPlayer}
                    tempName={tempName}
                    setTempName={setTempName}
                    onEditPlayer={handleEditPlayer}
                    onSavePlayerName={handleSavePlayerName}
                />

                <View style={styles.controls}>
                    {!gameEnded ? (
                        <>
                            <TouchableOpacity
                                onPress={() => setShowNewRound(true)}
                                style={styles.newRoundButton}
                            >
                                <Plus size={20} color="white" />
                                <Text style={styles.buttonText}>Tạo ván mới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleEndGame}
                                style={styles.endGameButton}
                            >
                                <Text style={styles.buttonText}>Kết thúc</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={handleNewGame}
                            style={styles.newGameButton}
                        >
                            <Text style={styles.buttonText}>Ván mới</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {gameEnded && (
                    <GameSummary players={players} totals={totals} />
                )}

                {rounds.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Trophy size={48} color="#d1d5db" />
                        <Text style={styles.emptyText}>Chưa có ván nào. Bấm "Tạo ván mới" để bắt đầu!</Text>
                    </View>
                ) : (
                    <RoundsList
                        rounds={rounds}
                        players={players}
                        gameEnded={gameEnded}
                        onDeleteRound={handleDeleteRound}
                    />
                )}
            </ScrollView>

            <NewRoundModal
                visible={showNewRound}
                onClose={() => setShowNewRound(false)}
                players={players}
                onSave={handleAddRound}
            />
            <View style={styles.eyeButtonContainer}>
                <TouchableOpacity
                    onPress={() => setShowScores(!showScores)}
                    style={styles.eyeButton}
                >
                    {showScores ? <EyeOff size={20} color="#374151" /> : <Eye size={20} color="#374151" />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10,
        padding: 16,
    },
    controls: {
        flexDirection: 'row',
        gap: 8,
    },
    newRoundButton: {
        flex: 2,
        backgroundColor: '#16a34a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    eyeButtonContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    eyeButton: {
        padding: 12,
        backgroundColor: '#e5e7eb',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endGameButton: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#dc2626',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newGameButton: {
        flex: 1,
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        gap: 12,
    },
    emptyText: {
        color: '#9ca3af',
        textAlign: 'center',
    },
});

export default GameScreen;
