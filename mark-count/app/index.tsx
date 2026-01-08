import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SetupScreen from '../components/SetupScreen';
import GameScreen from '../components/GameScreen';

const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

const App = () => {
  const [players, setPlayers] = useState([
    { name: '', avatar: avatarColors[0] },
    { name: '', avatar: avatarColors[1] },
    { name: '', avatar: avatarColors[2] },
    { name: '', avatar: avatarColors[3] }
  ]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);

  const handleSavePlayers = () => {
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length < 2) {
      alert('Cần ít nhất 2 người chơi');
      return;
    }
    setShowSetup(false);
  };

  const handleNewGame = () => {
    setRounds([]);
    setGameEnded(false);
    // Optional: reset players or show setup again. Here we keep players.
  };

  if (showSetup) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SetupScreen
          players={players}
          setPlayers={setPlayers}
          onStart={handleSavePlayers}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GameScreen
        players={players}
        rounds={rounds}
        setRounds={setRounds}
        gameEnded={gameEnded}
        setGameEnded={setGameEnded}
        onNewGame={handleNewGame}
        setPlayers={setPlayers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
