import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingScreen from '@/components/SettingScreen';


export default function GameTab() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SettingScreen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});
