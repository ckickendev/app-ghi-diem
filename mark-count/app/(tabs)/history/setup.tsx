import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SetupScreen from '@/components/SetupScreen';
import { useRouter } from 'expo-router';
import { useGame } from '../../../context/GameContext';

export default function SetupTab() {
    const router = useRouter();
    const { resetGame } = useGame();

    // Clear data when entering setup screen (new game intent)
    useEffect(() => {
        resetGame(true);
    }, []);

    const handleStart = () => {
        // Navigate to game tab
        router.push('/(tabs)/history/game');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SetupScreen onStart={handleStart} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
