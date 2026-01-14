import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { Plus, Edit2, Save, Trash2, Eye, EyeOff, Trophy } from 'lucide-react-native';
import NewRoundModal from './NewRoundModal';
import { useGame } from '../context/GameContext';

const GameScreen: React.FC = () => {
    const { players, setPlayers, rounds, setRounds, gameEnded, setGameEnded, resetGame, saveCurrentGame } = useGame();
    const [showNewRound, setShowNewRound] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
    const [tempName, setTempName] = useState('');

    const getTotalScores = () => {
        const totals = new Array(players.length).fill(0);
        rounds.forEach((round) => {
            round.scores.forEach((score, idx) => {
                if (idx < totals.length) {
                    totals[idx] += score;
                }
            });
        });
        return totals;
    };

    const totals = getTotalScores();

    const handleAddRound = (scores: number[]) => {
        setRounds([...rounds, {
            id: Date.now(),
            scores: scores
        }]);
        setShowNewRound(false);
    };

    const handleDeleteRound = (id: number) => {
        Alert.alert(
            "Xóa ván này?",
            "",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: () => setRounds(rounds.filter(r => r.id !== id)) }
            ]
        );
    };

    const handleEditPlayer = (idx: number) => {
        setEditingPlayer(idx);
        setTempName(players[idx].name);
    };

    const handleSavePlayerName = () => {
        if (tempName.trim() && editingPlayer !== null) {
            const newPlayers = [...players];
            newPlayers[editingPlayer].name = tempName.trim();
            setPlayers(newPlayers);
        }
        setEditingPlayer(null);
        setTempName('');
    };

    const handleEndGame = () => {
        if (rounds.length === 0) {
            Alert.alert('Thông báo', 'Chưa có ván nào!');
            return;
        }
        setGameEnded(true);
        setShowScores(true);
    };

    const handleNewGame = () => {
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
    };

    return (
        <View style={styles.container}>
            {/* Header with players */}
            <View style={styles.header}>
                <View style={styles.playersGrid}>
                    {players.map((player, idx) => {
                        if (!player.name) return null;
                        const total = totals[idx];
                        return (
                            <View key={idx} style={styles.playerColumn}>
                                {editingPlayer === idx ? (
                                    <View style={styles.editNameContainer}>
                                        <TextInput
                                            style={styles.editNameInput}
                                            value={tempName}
                                            onChangeText={setTempName}
                                            autoFocus
                                        />
                                        <TouchableOpacity
                                            onPress={handleSavePlayerName}
                                            style={styles.saveNameButton}
                                        >
                                            <Save size={16} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <View style={[styles.playerAvatar, { backgroundColor: player.avatar }]}>
                                            <Text style={styles.playerAvatarText}>{player.name[0].toUpperCase()}</Text>
                                        </View>
                                        <View style={styles.nameRow}>
                                            <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                                            <TouchableOpacity onPress={() => handleEditPlayer(idx)}>
                                                <Edit2 size={12} color="#9ca3af" />
                                            </TouchableOpacity>
                                        </View>
                                        {(gameEnded || showScores) && (
                                            <Text style={[
                                                styles.totalScore,
                                                total >= 0 ? styles.positiveScore : styles.negativeScore
                                            ]}>
                                                {total >= 0 ? '+' : ''}{total}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </View>
                        );
                    })}
                </View>

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
                            {/* <TouchableOpacity
                                onPress={() => setShowScores(!showScores)}
                                style={styles.eyeButton}
                            >
                                {showScores ? <EyeOff size={20} color="#374151" /> : <Eye size={20} color="#374151" />}
                            </TouchableOpacity> */}
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
                {/* Game ended summary */}
                {gameEnded && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <Trophy size={48} color="white" />
                            <Text style={styles.summaryTitle}>Kết quả cuối cùng</Text>
                        </View>
                        <View style={styles.rankings}>
                            {players
                                .map((p, idx) => ({ ...p, idx, total: totals[idx] }))
                                .filter(p => p.name)
                                .sort((a, b) => b.total - a.total)
                                .map((player, rank) => (
                                    <View key={player.idx} style={styles.rankingRow}>
                                        <View style={styles.rankingLeft}>
                                            <Text style={styles.rankNumber}>#{rank + 1}</Text>
                                            <View style={[styles.rankingAvatar, { backgroundColor: player.avatar }]}>
                                                <Text style={styles.rankingAvatarText}>{player.name[0].toUpperCase()}</Text>
                                            </View>
                                            <Text style={styles.rankingName}>{player.name}</Text>
                                        </View>
                                        <Text style={[
                                            styles.rankingScore,
                                            player.total >= 0 ? styles.positiveScore : styles.negativeScore
                                        ]}>
                                            {player.total >= 0 ? '+' : ''}{player.total}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                )}

                {/* Rounds list */}
                {rounds.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Trophy size={48} color="#d1d5db" />
                        <Text style={styles.emptyText}>Chưa có ván nào. Bấm "Tạo ván mới" để bắt đầu!</Text>
                    </View>
                ) : (
                    <View style={styles.roundsList}>
                        {rounds.map((round, idx) => (
                            <View key={round.id} style={styles.roundCard}>
                                <View style={styles.roundGrid}>
                                    <Text style={styles.roundHeader}>
                                        {idx + 1}
                                    </Text>
                                    {round.scores.map((score, idx) => {
                                        if (!players[idx].name) return null;
                                        return (
                                            <View key={idx} style={styles.scoreCell}>
                                                <Text style={[
                                                    styles.scoreValue,
                                                    score >= 0 ? styles.positiveScore : styles.negativeScore
                                                ]}>
                                                    {score >= 0 ? '+' : ''}{score}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                                {!gameEnded && (
                                    <TouchableOpacity
                                        onPress={() => handleDeleteRound(round.id)}
                                        style={styles.deleteRoundButton}
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <NewRoundModal
                visible={showNewRound}
                onClose={() => setShowNewRound(false)}
                players={players}
                onSave={handleAddRound}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        // opacity: 0
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
    playersGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    playerColumn: {
        flex: 1,
        alignItems: 'center',
        // maxWidth: '25%', // Removed to support dynamic player count
    },
    playerAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    playerAvatarText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
        maxWidth: 60,
    },
    totalScore: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editNameContainer: {
        alignItems: 'center',
        gap: 4,
        width: '100%',
    },
    editNameInput: {
        width: '100%',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 4,
        padding: 4,
        fontSize: 12,
        textAlign: 'center',
    },
    saveNameButton: {
        backgroundColor: '#22c55e',
        padding: 4,
        borderRadius: 4,
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
    summaryCard: {
        backgroundColor: '#facc15', // Yellow gradients difficult without library, using solid yellow
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 8,
    },
    rankings: {
        gap: 8,
    },
    rankingRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rankingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rankNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9ca3af',
    },
    rankingAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankingAvatarText: {
        color: 'white',
        fontWeight: 'bold',
    },
    rankingName: {
        fontSize: 18,
        fontWeight: '600',
    },
    rankingScore: {
        fontSize: 24,
        fontWeight: 'bold',
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
    roundsList: {
        gap: 12,
    },
    roundCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        overflow: 'hidden',
    },
    roundGrid: {
        flexDirection: 'row',
    },
    roundHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    scoreCell: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#f3f4f6',
    },
    scoreCellName: {
        fontSize: 12,
        color: '#4b5563',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    deleteRoundButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    positiveScore: {
        color: '#16a34a',
    },
    negativeScore: {
        color: '#dc2626',
    },
});

export default GameScreen;
