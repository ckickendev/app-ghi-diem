import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  SectionList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../theme';
import { Game, RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

interface SectionData {
  title: string;
  data: Game[];
}

const HistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { games, players, deleteGame } = useGameState();

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteGame = (gameId: string) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteGame(gameId)
        }
      ]
    );
  };

  const getSectionedData = (): SectionData[] => {
    const gamesByDate = games.reduce((acc: Record<string, Game[]>, game) => {
      const date = new Date(game.date).toLocaleDateString('en-US');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(game);
      return acc;
    }, {});

    return Object.keys(gamesByDate)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        title: date,
        data: gamesByDate[date].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }));
  };

  const renderEmptyState = () => (
    <EmptyState
      icon="calendar"
      title="No Game History"
      message="Games you play will appear here. Start a new game to see your history."
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game History</Text>
      </View>

      {games.length > 0 ? (
        <SectionList
          sections={getSectionedData()}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gameCard}
              onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
              activeOpacity={0.7}
            >
              <View style={styles.gameCardHeader}>
                <Text style={styles.gameTime}>
                  {formatTime(item.date)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteGame(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="trash-2" size={16} color={COLORS.error[500]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.scoresList}>
                {item.scores
                  .sort((a, b) => b.points - a.points)
                  .map((score, index) => (
                    <View key={score.playerId} style={styles.scoreItem}>
                      <Text 
                        style={[
                          styles.playerName,
                          index === 0 ? styles.winnerName : {}
                        ]}
                        numberOfLines={1}
                      >
                        {index === 0 && <Feather name="award" size={12} color={COLORS.primary[500]} />}{' '}
                        {getPlayerName(score.playerId)}
                      </Text>
                      <Text 
                        style={[
                          styles.playerScore,
                          index === 0 ? styles.winnerScore : {}
                        ]}
                      >
                        {score.points} pts
                      </Text>
                    </View>
                  ))}
              </View>
            </TouchableOpacity>
          )}
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
  sectionHeader: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.neutral[600],
  },
  gameCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gameTime: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.neutral[500],
  },
  scoresList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    paddingTop: SPACING.sm,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  playerName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    flex: 1,
  },
  winnerName: {
    fontWeight: FONTS.weights.semibold,
    color: COLORS.primary[600],
  },
  playerScore: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.neutral[700],
  },
  winnerScore: {
    color: COLORS.primary[600],
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});

export default HistoryScreen;