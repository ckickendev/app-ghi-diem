import React from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGame, GameSession } from '../../../context/GameContext';
import { Trophy } from 'lucide-react-native';

export default function HistoryIndex() {
    const router = useRouter();
    const { history, players, rounds, gameEnded, loadGame, currentGameId } = useGame();
    const [isToday, setIsToday] = React.useState(true);

    const getDisplayData = () => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        let filteredData = history.filter(item => {
            const itemDate = new Date(item.date);
            if (isToday) {
                return itemDate >= todayStart;
            } else {
                return itemDate < todayStart;
            }
        });

        return filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const renderItem = ({ item }: { item: GameSession }) => {
        const isCurrentGame = item.id === currentGameId;

        // Calculate winner & total scores for summary
        const totals = item.players.map((_, pIdx) =>
            item.rounds.reduce((sum, r) => sum + r.scores[pIdx], 0)
        );

        // Find winner/leader (max score)
        const maxScore = Math.max(...totals);
        const winnerIdx = totals.indexOf(maxScore);
        const winner = item.players[winnerIdx];

        const handlePress = () => {
            if (isCurrentGame) {
                router.push('/(tabs)/history/game');
            } else {
                loadGame(item);
                router.push('/(tabs)/history/game');
            }
        };

        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <View style={[styles.historyCard, isCurrentGame && styles.activeCard]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.dateText}>
                            {new Date(item.date).toLocaleDateString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric'
                            })}
                        </Text>
                        <View style={[styles.badge, (isCurrentGame || !item.isEnded) && styles.activeBadge]}>
                            <Text style={[styles.badgeText, (isCurrentGame || !item.isEnded) && styles.activeBadgeText]}>
                                {isCurrentGame ? 'Đang chơi' : item.isEnded ? 'Đã xong' : 'Chưa xong'}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.winnerSection, isCurrentGame && styles.activeWinnerSection]}>
                        <Trophy size={16} color={isCurrentGame ? "#3b82f6" : "#fbbf24"} />
                        <Text style={[styles.winnerText, isCurrentGame && styles.activeWinnerText]}>
                            {isCurrentGame ? 'Dẫn đầu: ' : 'Thắng: '}
                            <Text style={{ fontWeight: 'bold' }}>{winner?.name || 'Unknown'}</Text> ({maxScore})
                        </Text>
                    </View>

                    <View style={styles.playersList}>
                        {item.players.filter(p => p.name).map((p, idx) => (
                            <Text key={idx} style={styles.playerText}>
                                {p.name}: {totals[idx]}
                            </Text>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const displayData = getDisplayData();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.titleContainer}>
                <TouchableOpacity style={[styles.titleItem, isToday && styles.titleItemActive]} onPress={() => setIsToday(true)}>
                    <Text style={styles.titleText}>Hôm nay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.titleItem, !isToday && styles.titleItemActive]} onPress={() => setIsToday(false)}>
                    <Text style={styles.titleText}>Cũ hơn</Text>
                </TouchableOpacity>
            </View>

            {displayData.length > 0 ? (
                <FlatList
                    data={displayData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <ImageBackground source={require('@/assets/images/empty-history.png')} resizeMode="contain" style={styles.image}>
                </ImageBackground>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/history/setup')}>
                <Text style={styles.primaryText}>Bắt đầu</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        gap: 2,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    titleItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#dec2b1ff',
        paddingVertical: 14,
        borderRadius: 20,
    },
    titleItemActive: {
        backgroundColor: '#ef6b19ff',
    },
    primaryButton: {
        width: '40%',
        position: 'absolute',
        bottom: 20,
        right: 30,
        backgroundColor: 'green',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
        zIndex: 2,
    },
    primaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    historyCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateText: {
        fontSize: 14,
        color: '#6b7280',
    },
    badge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
    },
    winnerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
        backgroundColor: '#fef3c7',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    winnerText: {
        fontSize: 14,
        color: '#92400e',
    },
    playersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    playerText: {
        fontSize: 14,
        color: '#4b5563',
    },
    activeCard: {
        borderColor: '#22c55e',
        borderWidth: 2,
    },
    activeBadge: {
        backgroundColor: '#dcfce7',
    },
    activeBadgeText: {
        color: '#15803d',
    },
    activeWinnerSection: {
        backgroundColor: '#dbeafe',
    },
    activeWinnerText: {
        color: '#1e40af',
    },
});
