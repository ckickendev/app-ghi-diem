import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import { RootStackParamList } from '../types';
import Button from '../components/Button';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'GameDetail'>;

const GameDetailScreen = ({ route, navigation }: Props) => {
  const { gameId } = route.params;
  const { games, players } = useGameState();
  
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Game not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Sort scores by points in descending order (highest first)
  const sortedScores = [...game.scores].sort((a, b) => b.points - a.points);
  const winner = sortedScores[0];
  const winnerName = getPlayerName(winner.playerId);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Game Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>
            <Feather name="calendar" size={14} color={COLORS.neutral[500]} />{' '}
            Date & Time
          </Text>
          <Text style={styles.dateValue}>{formatDateTime(game.date)}</Text>
        </View>

        <View style={styles.winnerCard}>
          <View style={styles.trophyContainer}>
            <Feather name="award" size={36} color={COLORS.primary[500]} />
          </View>
          <Text style={styles.winnerLabel}>Winner</Text>
          <Text style={styles.winnerName}>{winnerName}</Text>
          <Text style={styles.winnerPoints}>{winner.points} points</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreCardTitle}>All Scores</Text>
          
          {sortedScores.map((score, index) => (
            <View 
              key={score.playerId} 
              style={[
                styles.scoreRow,
                index < sortedScores.length - 1 && styles.scoreRowBorder
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <Text style={styles.scorePlayerName}>
                {getPlayerName(score.playerId)}
              </Text>
              <Text style={styles.scorePoints}>{score.points}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  dateContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  dateLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.neutral[500],
    marginBottom: SPACING.xs,
  },
  dateValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  winnerCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  trophyContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  winnerLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary[500],
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xs,
  },
  winnerName: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  winnerPoints: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary[500],
    fontWeight: FONTS.weights.medium,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  scoreCardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  scoreRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  rankContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  rankText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.neutral[700],
  },
  scorePlayerName: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  scorePoints: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.error[500],
    marginBottom: SPACING.lg,
  },
});

export default GameDetailScreen;