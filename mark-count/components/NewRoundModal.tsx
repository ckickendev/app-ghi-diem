import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface NewRoundModalProps {
    visible: boolean;
    onClose: () => void;
    players: { name: string; avatar: string }[];
    onSave: (scores: number[]) => void;
}

const NewRoundModal: React.FC<NewRoundModalProps> = ({ visible, onClose, players, onSave }) => {
    const [newRoundScores, setNewRoundScores] = useState<number[]>([0, 0, 0, 0]);

    const handleScoreChange = (idx: number, value: string) => {
        const newScores = [...newRoundScores];
        newScores[idx] = parseInt(value) || 0;
        setNewRoundScores(newScores);
    };

    const currentSum = newRoundScores.reduce((a, b) => a + b, 0);

    const handleAddRound = () => {
        if (Math.abs(currentSum) > 0.01) {
            Alert.alert('Lỗi', 'Tổng điểm phải bằng 0! Hiện tại: ' + currentSum);
            return;
        }
        onSave([...newRoundScores]);
        setNewRoundScores([0, 0, 0, 0]);
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
                                setNewRoundScores([0, 0, 0, 0]);
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
                                    <View key={idx} style={styles.playerRow}>
                                        <View style={[styles.avatar, { backgroundColor: player.avatar }]}>
                                            <Text style={styles.avatarText}>
                                                {player.name[0].toUpperCase()}
                                            </Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.playerName}>{player.name}</Text>
                                            <TextInput
                                                style={styles.input}
                                                keyboardType="numeric"
                                                value={newRoundScores[idx].toString()}
                                                onChangeText={(text) => handleScoreChange(idx, text)}
                                                placeholder="0"
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={[
                            styles.sumContainer,
                            Math.abs(currentSum) < 0.01 ? styles.sumValid : styles.sumInvalid
                        ]}>
                            <Text style={[
                                styles.sumText,
                                Math.abs(currentSum) < 0.01 ? styles.sumTextValid : styles.sumTextInvalid
                            ]}>
                                Tổng: {currentSum >= 0 ? '+' : ''}{currentSum}
                                {Math.abs(currentSum) < 0.01 ? ' ✓' : ' ⚠️'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleAddRound}
                            disabled={Math.abs(currentSum) > 0.01}
                            style={[
                                styles.saveButton,
                                Math.abs(currentSum) > 0.01 && styles.saveButtonDisabled
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
    },
    inputContainer: {
        flex: 1,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    input: {
        width: '100%',
        height: 45,
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
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
        borderRadius: 8,
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
