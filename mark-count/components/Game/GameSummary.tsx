import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';

interface Player {
    name: string;
    avatar: string;
}

interface GameSummaryProps {
    players: Player[];
    totals: number[];
}

const GameSummary: React.FC<GameSummaryProps> = ({ players, totals }) => {
    const rankings = players
        .map((p, idx) => ({ ...p, idx, total: totals[idx] }))
        .filter(p => p.name)
        .sort((a, b) => b.total - a.total);

    return (
        <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
                <Trophy size={48} color="white" />
                <Text style={styles.summaryTitle}>Kết quả cuối cùng</Text>
            </View>
            <View style={styles.rankings}>
                {rankings.map((player, rank) => (
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
    );
};

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: '#facc15',
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
    positiveScore: {
        color: '#16a34a',
    },
    negativeScore: {
        color: '#dc2626',
    },
});

export default memo(GameSummary);
