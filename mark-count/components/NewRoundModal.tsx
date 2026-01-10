import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Platform } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface NewRoundModalProps {
    visible: boolean;
    onClose: () => void;
    players: { name: string; avatar: string }[];
    onSave: (scores: number[]) => void;
}

const NewRoundModal: React.FC<NewRoundModalProps> = ({ visible, onClose, players, onSave }) => {
    // Keep inputs as strings to allow typing "-" or empty state
    const [newRoundScores, setNewRoundScores] = useState<string[]>([]);

    useEffect(() => {
        if (visible) {
            setNewRoundScores(new Array(players.length).fill(''));
        }
    }, [visible, players.length]);

    const handleScoreChange = (idx: number, value: string) => {
        const newScores = [...newRoundScores];
        // Regex to allow digits and a single minus sign at the start
        if (/^-?\d*$/.test(value)) {
            newScores[idx] = value;
            setNewRoundScores(newScores);
        }
    };

    // Calculate sum for validation
    const currentSum = newRoundScores.reduce((a, b) => {
        // Convert to number, treat empty or just "-" as 0 for sum calculation
        const val = parseInt(b);
        return a + (isNaN(val) ? 0 : val);
    }, 0);

    const handleAddRound = () => {
        if (Math.abs(currentSum) !== 0) {
            Alert.alert('Lỗi', 'Tổng điểm phải bằng 0! Hiện tại: ' + currentSum);
            return;
        }

        // Convert strings to numbers for saving
        const finalScores = newRoundScores.map(s => {
            const val = parseInt(s);
            return isNaN(val) ? 0 : val;
        });

        onSave(finalScores);
        setNewRoundScores(new Array(players.length).fill(''));
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nhập điểm</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setNewRoundScores(new Array(players.length).fill(''));
                                onClose();
                            }}
                            style={styles.closeButton}
                        >
                            <Trash2 size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.playersList}>
                            {players.map((player, idx) => {
                                if (!player.name) return null;
                                return (
                                    <View key={idx} style={styles.playerInputRow}>
                                        <View style={styles.playerInfo}>
                                            <View style={[styles.avatar, { backgroundColor: player.avatar }]}>
                                                <Text style={styles.avatarText}>
                                                    {player.name[0].toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text style={styles.playerName}>{player.name}</Text>
                                        </View>

                                        <TextInput
                                            style={styles.input}
                                            // 'numeric' doesn't always show minus on iOS. 
                                            // 'numbers-and-punctuation' is better for negative numbers.
                                            keyboardType="numbers-and-punctuation"
                                            value={newRoundScores[idx]}
                                            onChangeText={(text) => handleScoreChange(idx, text)}
                                            placeholder="0"
                                            placeholderTextColor="#9ca3af"
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        <View style={[
                            styles.sumContainer,
                            currentSum === 0 ? styles.sumValid : styles.sumInvalid
                        ]}>
                            <Text style={[
                                styles.sumText,
                                currentSum === 0 ? styles.sumTextValid : styles.sumTextInvalid
                            ]}>
                                Tổng: {currentSum >= 0 ? '+' : ''}{currentSum}
                                {currentSum === 0 ? ' ✓' : ' ⚠️'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleAddRound}
                            disabled={currentSum !== 0}
                            style={[
                                styles.saveButton,
                                currentSum !== 0 && styles.saveButtonDisabled
                            ]}
                        >
                            <Text style={styles.saveButtonText}>Lưu ván</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalView: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    modalHeader: {
        backgroundColor: '#16a34a',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 24,
    },
    playersList: {
        marginBottom: 24,
        gap: 16,
    },
    playerInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    playerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    input: {
        width: 100,
        height: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1f2937',
    },
    sumContainer: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        alignItems: 'center',
    },
    sumValid: {
        backgroundColor: '#dcfce7',
    },
    sumInvalid: {
        backgroundColor: '#fee2e2',
    },
    sumText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sumTextValid: {
        color: '#15803d',
    },
    sumTextInvalid: {
        color: '#b91c1c',
    },
    saveButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#d1d5db',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NewRoundModal;
