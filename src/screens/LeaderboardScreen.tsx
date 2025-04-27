import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  Animated
} from 'react-native';
import { useGameState } from '../hooks/useGameState';
import PlayerItem from '../components/PlayerItem';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING } from '../theme';
import { PlayerWithScore } from '../types';

const LeaderboardScreen = () => {
  const { getLeaderboard, games } = useGameState();
  const leaderboard = getLeaderboard();
  
  // Animation references for each item
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animation when the screen mounts or data changes
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, games.length]);

  const renderEmptyState = () => (
    <EmptyState
      icon="award"
      title="No Game Data Yet"
      message="Start playing games to see player rankings on the leaderboard."
    />
  );

  const renderItem = ({ item, index }: { item: PlayerWithScore; index: number }) => {
    // Staggered animation for each item
    const itemDelay = index * 100;
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
        }}
      >
        <PlayerItem
          player={item}
          onRemove={() => {}}
          totalPoints={item.totalPoints}
          rank={index}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        {games.length > 0 && (
          <Text style={styles.subtitle}>
            Based on {games.length} game{games.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {leaderboard.length > 0 ? (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
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
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContent: {
    padding: SPACING.md,
  },
});

export default LeaderboardScreen;