import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGame } from '../context/GameContext';
import { View, StyleSheet } from 'react-native';

function ThemeContent() {
  const { theme } = useGame();

  return (
    <View style={[styles.container, { backgroundColor: theme.color }]}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
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
