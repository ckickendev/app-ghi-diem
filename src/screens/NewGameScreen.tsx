import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameState } from '../hooks/useGameState';
import { GameScore, RootStackParamList } from '../types';
import GameScoreInput from '../components/GameScoreInput';
import Button from '../components/Button';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewGame'>;

const NewGameScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { players, addGame } = useGameState();
  const [scores, setScores] = useState<GameScore[]>([]);

  useEffect(() => {
    // Initialize scores array with all players
    const initialScores = players.map(player => ({
      playerId: player.id,
      points: 0
    }));
    setScores(initialScores);
  }, [players]);

  const handleScoreChange = (updatedScore: GameScore) => {
    setScores(prev => {
      const updatedScores = [...prev];
      const index = updatedScores.findIndex(s => s.playerId === updatedScore.playerId);
      
      if (index !== -1) {
        updatedScores[index] = updatedScore;
      } else {
        updatedScores.push(updatedScore);
      }
      
      return updatedScores;
    });
  };

  const handleSaveGame = () => {
    // Make sure all players have scores
    if (scores.length !== players.length) {
      Alert.alert('Error', 'All players must have scores');
      return;
    }
    
    // Confirm before saving
    Alert.alert(
      'Save Game',
      'Are you sure you want to save this game?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            addGame(scores);
            navigation.navigate('Leaderboard');
          }
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Scores',
      'Are you sure you want to reset all scores to zero?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            const resetScores = players.map(player => ({
              playerId: player.id,
              points: 0
            }));
            setScores(resetScores);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Game</Text>
        <Text style={styles.subtitle}>Enter points for each player</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {players.map(player => (
            <GameScoreInput
              key={player.id}
              player={player}
              onChange={handleScoreChange}
              initialValue={scores.find(s => s.playerId === player.id)?.points || 0}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Button
            title="Reset"
            onPress={handleReset}
            variant="outline"
            style={styles.resetButton}
          />
          <Button
            title="Save Game"
            onPress={handleSaveGame}
            fullWidth
            style={styles.saveButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    marginRight: SPACING.sm,
  },
  saveButton: {
    flex: 1,
  },
});

export default NewGameScreen;