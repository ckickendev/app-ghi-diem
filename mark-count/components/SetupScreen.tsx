import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Switch } from 'react-native';
import { useGame } from '../context/GameContext';

import { Minus, Plus } from 'lucide-react-native';

interface SetupScreenProps {
    onStart: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
    const {
        players,
        setPlayers,
        updatePlayerCount,
        roundLimit,
        setRoundLimit,
        isRoundLimitEnabled,
        setIsRoundLimitEnabled
    } = useGame();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        {/* <Text style={styles.title}>Thiết lập game</Text> */}
                        <Text style={styles.subtitle}>Số lượng người chơi: {players.length}</Text>

                        <View style={styles.countControl}>
                            <TouchableOpacity
                                onPress={() => updatePlayerCount(players.length - 1)}
                                disabled={players.length <= 2}
                                style={[styles.countButton, players.length <= 2 && styles.countButtonDisabled]}
                            >
                                <Minus size={24} color={players.length <= 2 ? '#9ca3af' : 'white'} />
                            </TouchableOpacity>

                            <Text style={styles.countText}>{players.length}</Text>

                            <TouchableOpacity
                                onPress={() => updatePlayerCount(players.length + 1)}
                                disabled={players.length >= 8}
                                style={[styles.countButton, players.length >= 8 && styles.countButtonDisabled]}
                            >
                                <Plus size={24} color={players.length >= 8 ? '#9ca3af' : 'white'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.limitContainer}>
                            <View style={styles.limitRow}>
                                <Text style={styles.limitLabel}>Giới hạn số vòng</Text>
                                <Switch
                                    value={isRoundLimitEnabled}
                                    onValueChange={setIsRoundLimitEnabled}
                                    trackColor={{ false: '#e5e7eb', true: '#16a34a' }}
                                    thumbColor={isRoundLimitEnabled ? 'white' : '#f4f3f4'}
                                />
                            </View>
                            {isRoundLimitEnabled && (
                                <View style={styles.limitInputRow}>
                                    <Text style={styles.limitInputLabel}>Số vòng:</Text>
                                    <TextInput
                                        style={styles.limitInput}
                                        keyboardType="number-pad"
                                        value={roundLimit.toString()}
                                        onChangeText={(text) => {
                                            const val = parseInt(text) || 0;
                                            setRoundLimit(val);
                                        }}
                                        placeholder="10"
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.playersList}>
                        {players.map((player, idx) => (
                            <View key={idx} style={styles.playerRow}>
                                <View style={[styles.avatar, { backgroundColor: player.avatar }]}>
                                    <Text style={styles.avatarText}>
                                        {player.name ? player.name[0].toUpperCase() : idx + 1}
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder={`Người chơi ${idx + 1}`}
                                    value={player.name}
                                    onChangeText={(text) => {
                                        const newPlayers = [...players];
                                        newPlayers[idx].name = text;
                                        setPlayers(newPlayers);
                                    }}
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            const validPlayers = players.filter(p => p.name.trim());
                            if (validPlayers.length < 2) {
                                Alert.alert('Cần ít nhất 2 người chơi');
                                return;
                            }
                            onStart();
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Bắt đầu</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#166534', // Green-800 equivalent
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    icon: {
        fontSize: 60,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '1c5b32ff',
        marginBottom: 8,
    },
    subtitle: {
        color: '#1c5b32ff',
        fontSize: 16,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    playersList: {
        marginBottom: 24,
        gap: 16,
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        width: '100%',
        backgroundColor: '#16a34a', // Green-600
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    countControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 16,
        backgroundColor: '#f3f4f6',
        padding: 8,
        borderRadius: 16,
    },
    countButton: {
        backgroundColor: '#16a34a',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countButtonDisabled: {
        backgroundColor: '#e5e7eb',
    },
    countText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        width: 32,
        textAlign: 'center',
    },
    limitContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        width: '100%',
    },
    limitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    limitLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    limitInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 12,
    },
    limitInputLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    limitInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: 'white',
    },
});

export default SetupScreen;
