import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Player, RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Players'>;

interface PlayerItemProps {
    player: Player;
    onRemove: (id: string) => void;
    totalPoints?: number;
    rank?: number;
}

const PlayerItem: React.FC<PlayerItemProps> = ({ player, onRemove, totalPoints, rank }) => {
    const navigation = useNavigation<NavigationProp>();

    const handleEdit = () => {
        navigation.navigate('EditPlayer', { playerId: player.id });
    };

    const handleRemove = () => {
        Alert.alert(
            'Remove Player',
            `Are you sure you want to remove ${player.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => onRemove(player.id)
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {rank !== undefined && (
                    <View style={[styles.rankBadge, rank < 3 ? styles.topRankBadge : {}]}>
                        <Text style={[styles.rankText, rank < 3 ? styles.topRankText : {}]}>
                            {rank + 1}
                        </Text>
                    </View>
                )}
                <View style={styles.nameSection}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {totalPoints !== undefined && (
                        <Text style={styles.pointsText}>{totalPoints} pts</Text>
                    )}
                </View>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleEdit}
                    activeOpacity={0.7}
                >
                    <Feather name="edit-2" size={18} color={COLORS.primary[500]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconButton, styles.deleteButton]}
                    onPress={handleRemove}
                    activeOpacity={0.7}
                >
                    <Feather name="trash-2" size={18} color={COLORS.error[500]} />
                </TouchableOpacity>
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
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.small,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rankBadge: {
        width: 28,
        height: 28,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.neutral[200],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    topRankBadge: {
        backgroundColor: COLORS.primary[500],
    },
    rankText: {
        fontSize: FONTS.sizes.sm,
        fontWeight: FONTS.weights.bold,
        color: COLORS.neutral[700],
    },
    topRankText: {
        color: COLORS.white,
    },
    nameSection: {
        flex: 1,
    },
    playerName: {
        fontSize: FONTS.sizes.md,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.text,
        marginBottom: 2,
    },
    pointsText: {
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.sm,
        marginLeft: SPACING.xs,
    },
    deleteButton: {
        backgroundColor: COLORS.error[50],
    },
});

export default PlayerItem;