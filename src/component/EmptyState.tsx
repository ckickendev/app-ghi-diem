import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../theme';

interface EmptyStateProps {
    icon: keyof typeof Feather.glyphMap;
    title: string;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather name={icon} size={48} color={COLORS.neutral[400]} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    iconContainer: {
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONTS.sizes.xl,
        fontWeight: FONTS.weights.semibold,
        color: COLORS.neutral[700],
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: FONTS.sizes.md,
        color: COLORS.neutral[500],
        textAlign: 'center',
        lineHeight: FONTS.lineHeights.normal * FONTS.sizes.md,
    },
});

export default EmptyState;