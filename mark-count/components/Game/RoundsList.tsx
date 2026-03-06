import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface Player {
    name: string;
}

interface Round {
    id: number;
    scores: number[];
}

interface RoundsListProps {
    rounds: Round[];
    players: Player[];
    gameEnded: boolean;
    onDeleteRound: (id: number) => void;
}

const RoundsList: React.FC<RoundsListProps> = ({ rounds, players, gameEnded, onDeleteRound }) => {
    return (
        <View style={styles.roundsList}>
            {rounds.map((round, idx) => (
                <View key={round.id} style={styles.roundCard}>
                    <View style={styles.roundGrid}>
                        <Text style={styles.roundHeader}>
                            {idx + 1}
                        </Text>
                        {round.scores.map((score, sIdx) => {
                            if (!players[sIdx]?.name) return null;
                            return (
                                <View key={sIdx} style={styles.scoreCell}>
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
                            onPress={() => onDeleteRound(round.id)}
                            style={styles.deleteRoundButton}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
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

export default memo(RoundsList);
