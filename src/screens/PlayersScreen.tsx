import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import PlayerItem from '../components/PlayerItem';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../theme';

const PlayersScreen = () => {
  const { players, addPlayer, removePlayer, games } = useGameState();
  const [newPlayerName, setNewPlayerName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const handleAddPlayer = () => {
    if (newPlayerName.trim() === '') {
      // Shake animation for empty input
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
      return;
    }
    
    addPlayer(newPlayerName);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    // Check if player has game history
    const hasHistory = games.some(game => 
      game.scores.some(score => score.playerId === id)
    );
    
    if (hasHistory) {
      Alert.alert(
        "Warning",
        "This player has game history. Removing them will affect historical data and leaderboards.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Remove Anyway", 
            style: "destructive",
            onPress: () => removePlayer(id)
          }
        ]
      );
    } else {
      removePlayer(id);
    }
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="users"
      title="No Players Yet"
      message="Add players to get started. You'll need at least two players to record a game."
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Players</Text>
      </View>

      <Animated.View 
        style={[
          styles.inputContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder="Enter player name"
          placeholderTextColor={COLORS.placeholder}
          returnKeyType="done"
          onSubmitEditing={handleAddPlayer}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPlayer}
          activeOpacity={0.7}
        >
          <Feather name="user-plus" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>

      {players.length > 0 ? (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlayerItem 
              player={item} 
              onRemove={handleRemovePlayer} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
      
      {players.length >= 2 && (
        <View style={styles.footer}>
          <Button
            title="Start New Game"
            onPress={() => {}}
            fullWidth
            icon={<Feather name="play" size={18} color={COLORS.white} />}
          />
        </View>
      )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    ...SHADOWS.small,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    ...SHADOWS.small,
  },
  listContent: {
    padding: SPACING.md,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
});

export default PlayersScreen;