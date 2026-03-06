import React, { memo } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Edit2, Save } from 'lucide-react-native';

interface Player {
    name: string;
    avatar: string;
}

interface PlayerHeaderProps {
    players: Player[];
    totals: number[];
    gameEnded: boolean;
    showScores: boolean;
    editingPlayer: number | null;
    tempName: string;
    setTempName: (name: string) => void;
    onEditPlayer: (idx: number) => void;
    onSavePlayerName: () => void;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
    players,
    totals,
    gameEnded,
    showScores,
    editingPlayer,
    tempName,
    setTempName,
    onEditPlayer,
    onSavePlayerName
}) => {
    return (
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
                                    onPress={onSavePlayerName}
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
                                    <TouchableOpacity onPress={() => onEditPlayer(idx)}>
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
    );
};

const styles = StyleSheet.create({
    playersGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    playerColumn: {
        flex: 1,
        alignItems: 'center',
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
    positiveScore: {
        color: '#16a34a',
    },
    negativeScore: {
        color: '#dc2626',
    },
});

export default memo(PlayerHeader);
