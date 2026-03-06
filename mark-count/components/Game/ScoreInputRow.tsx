import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Player {
    name: string;
    avatar: string;
}

interface ScoreInputRowProps {
    player: Player;
    score: string;
    onChangeScore: (value: string) => void;
}

const ScoreInputRow: React.FC<ScoreInputRowProps> = ({ player, score, onChangeScore }) => {
    return (
        <View style={styles.playerInputRow}>
            <View style={styles.playerInfo}>
                <View style={[styles.avatar, { backgroundColor: player.avatar }]}>
                    <Text style={styles.avatarText}>
                        {player.name[0].toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.playerName}>{player.name}</Text>
            </View>

            <TextInput
                style={styles.input}
                keyboardType="numbers-and-punctuation"
                value={score}
                onChangeText={onChangeScore}
                placeholder="0"
                placeholderTextColor="#9ca3af"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    playerInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    playerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    input: {
        width: 100,
        height: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1f2937',
    },
});

export default memo(ScoreInputRow);
