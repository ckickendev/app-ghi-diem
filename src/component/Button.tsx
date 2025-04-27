import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: styles.outlineText
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.dangerText
        };
      case 'primary':
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText
        };
      case 'medium':
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabledContainer,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primary[500] : COLORS.white} 
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              variantStyles.text,
              sizeStyles.text,
              disabled && styles.disabledText,
              icon && styles.textWithIcon,
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  text: {
    fontWeight: FONTS.weights.semibold,
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: SPACING.xs,
  },
  primaryContainer: {
    backgroundColor: COLORS.primary[500],
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryContainer: {
    backgroundColor: COLORS.neutral[100],
  },
  secondaryText: {
    color: COLORS.neutral[800],
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary[500],
  },
  outlineText: {
    color: COLORS.primary[500],
  },
  dangerContainer: {
    backgroundColor: COLORS.error[500],
  },
  dangerText: {
    color: COLORS.white,
  },
  smallContainer: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  smallText: {
    fontSize: FONTS.sizes.sm,
  },
  mediumContainer: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  mediumText: {
    fontSize: FONTS.sizes.md,
  },
  largeContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  largeText: {
    fontSize: FONTS.sizes.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabledContainer: {
    backgroundColor: COLORS.neutral[300],
    borderColor: COLORS.neutral[300],
  },
  disabledText: {
    color: COLORS.neutral[500],
  },
});

export default Button;