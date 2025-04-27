import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Player, GameScore } from '../types';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../theme';

interface GameScoreInputProps {
    player: Player;
    onChange: (score: GameScore) => void;
    initialValue?: number;
}

const GameScoreInput: React.FC<GameScoreInputProps> = ({
    player,
    onChange,
    initialValue = 0
}) => {
    const [points, setPoints] = useState(initialValue.toString());

    const handleChange = (value: string) => {
        // Allow empty string or numbers
        if (value === '' || /^-?\d+$/.test(value)) {
            setPoints(value);
            onChange({
                playerId: player.id,
                points: value === '' ? 0 : parseInt(value, 10)
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.playerName}>{player.name}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={points}
                    onChangeText={handleChange}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={COLORS.placeholder}
                />
                <Text style={styles.pointsLabel}>pts</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    playerName: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.medium,
        color: COLORS.text,
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.neutral[50],
    },
    input: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.medium,
        color: COLORS.text,
        padding: SPACING.sm,
        width: 60,
        textAlign: 'right',
    },
    pointsLabel: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
        marginLeft: SPACING.xs,
    },
});

export default GameScoreInput;