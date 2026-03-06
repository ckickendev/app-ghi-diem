import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Player {
    name: string;
    avatar: string;
}

interface PlayerInputRowProps {
    player: Player;
    index: number;
    onChangeName: (text: string) => void;
}

const PlayerInputRow: React.FC<PlayerInputRowProps> = ({ player, index, onChangeName }) => {
    return (
        <View style={styles.playerRow}>
            <View style={[styles.avatar, { backgroundColor: player.avatar }]}>
                <Text style={styles.avatarText}>
                    {player.name ? player.name[0].toUpperCase() : index + 1}
                </Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder={`Người chơi ${index + 1}`}
                value={player.name}
                onChangeText={onChangeName}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default memo(PlayerInputRow);
