import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGame } from '../context/GameContext';
import { View, StyleSheet, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function ThemeContent() {
  const { theme } = useGame();

  return (
    <ImageBackground
      source={theme.backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.container]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </ImageBackground>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen after the first render
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <GameProvider>
        <ThemeContent />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
