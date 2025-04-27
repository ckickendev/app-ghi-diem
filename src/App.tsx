import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { GameStateProvider } from './context/GameStateContext';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <GameStateProvider>
        <AppNavigator />
      </GameStateProvider>
    </SafeAreaProvider>
  );
}

export default App;