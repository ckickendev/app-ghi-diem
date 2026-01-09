import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

interface SetupScreenProps {
    onStart: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
    const { players, setPlayers } = useGame();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.icon}>🃏</Text>
                    <Text style={styles.title}>Tiến Lên</Text>
                    <Text style={styles.subtitle}>Nhập tên người chơi</Text>
                </View>

                <View style={styles.card}>
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
                                alert('Cần ít nhất 2 người chơi');
                                return;
                            }
                            onStart();
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Bắt đầu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#166534', // Green-800 equivalent
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    icon: {
        fontSize: 60,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        color: '#dcfce7', // Green-100
        fontSize: 16,
    },
    card: {
        width: '100%',
        maxWidth: 400,
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
});

export default SetupScreen;
