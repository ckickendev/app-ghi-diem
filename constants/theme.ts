import { Platform } from 'react-native';

export const COLORS = {
    primary: '#0A84FF',
    primaryLight: '#E3F2FD',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFCC00',
    background: '#F2F2F7',
    white: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    placeholder: '#9CA3AF',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const FONTS = {
    regular: 'Inter-Regular',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    sizes: {
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
    },
};

export const SHADOWS = Platform.select({
    ios: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
        },
    },
    android: {
        small: {
            elevation: 2,
        },
        medium: {
            elevation: 4,
        },
    },
});

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    round: 9999,
};