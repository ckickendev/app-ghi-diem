import { Dimensions } from 'react-native';

export const COLORS = {
  // Primary
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#0A84FF', // Primary blue (iOS)
    600: '#0E6FC7',
    700: '#0B5AA0',
    800: '#094279',
    900: '#062C52',
  },
  // Secondary/Accent
  accent: {
    50: '#E9FBF0',
    100: '#C8F5D9',
    200: '#A8EFC3',
    300: '#87E8AC',
    400: '#67E096',
    500: '#30D158', // Accent mint (iOS)
    600: '#28B04A',
    700: '#228F3D',
    800: '#1B6D2F',
    900: '#144C22',
  },
  // Success
  success: {
    50: '#E9FBF0',
    100: '#C8F5D9',
    200: '#A8EFC3',
    300: '#87E8AC',
    400: '#67E096',
    500: '#30D158', // iOS success green
    600: '#28B04A',
    700: '#228F3D',
    800: '#1B6D2F',
    900: '#144C22',
  },
  // Warning
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFCC00', // iOS warning yellow
    600: '#DBA800',
    700: '#B78500',
    800: '#936200',
    900: '#704800',
  },
  // Error
  error: {
    50: '#FDEAEA',
    100: '#F9C9C9',
    200: '#F5A7A7',
    300: '#F08585',
    400: '#EC6A6A',
    500: '#FF453A', // iOS error red
    600: '#DB2E3A',
    700: '#B72330',
    800: '#931A25',
    900: '#70111B',
  },
  // Neutrals
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Common colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: '#F2F2F7', // iOS background grey
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
  notification: '#FF453A',
  placeholder: '#9CA3AF',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    title: 34,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const SIZES = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

export default {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOWS,
  BORDER_RADIUS,
};