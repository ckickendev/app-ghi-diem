import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SetupScreen from '@/components/SetupScreen';
import { useRouter } from 'expo-router';

export default function SetupTab() {
    const router = useRouter();

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
        backgroundColor: '#166534',
    },
});
