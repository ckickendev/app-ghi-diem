import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';

export default function CustomSwitch({ value, onChange }: { value: any, onChange: () => void }) {
    const translateX = useRef(new Animated.Value(value ? 22 : 0)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: value ? 22 : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [value]);

    return (
        <Pressable
            onPress={onChange}
            style={[
                styles.track,
                { backgroundColor: value ? '#4F46E5' : '#E5E7EB' },
            ]}
        >
            <Animated.View
                style={[
                    styles.thumb,
                    { transform: [{ translateX }] },
                ]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    track: {
        width: 52,
        height: 30,
        borderRadius: 15,
        padding: 4,
        justifyContent: 'center',
    },
    thumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#fff',
        elevation: 3,
    },
});