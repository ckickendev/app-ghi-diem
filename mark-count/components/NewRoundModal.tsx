import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import ScoreInputRow from './Game/ScoreInputRow';

interface NewRoundModalProps {
    visible: boolean;
    onClose: () => void;
    players: { name: string; avatar: string }[];
    onSave: (scores: number[]) => void;
}

const NewRoundModal: React.FC<NewRoundModalProps> = ({ visible, onClose, players, onSave }) => {
    const [newRoundScores, setNewRoundScores] = useState<string[]>([]);

    useEffect(() => {
        if (visible) {
            setNewRoundScores(new Array(players.length).fill(''));
        }
    }, [visible, players.length]);

    const handleScoreChange = useCallback((idx: number, value: string) => {
        if (/^-?\d*$/.test(value)) {
            setNewRoundScores(prev => {
                const next = [...prev];
                next[idx] = value;
                return next;
            });
        }
    }, []);

    const currentSum = useMemo(() => {
        return newRoundScores.reduce((a, b) => {
            const val = parseInt(b);
            return a + (isNaN(val) ? 0 : val);
        }, 0);
    }, [newRoundScores]);

    const handleAddRound = useCallback(() => {
        if (Math.abs(currentSum) !== 0) {
            Alert.alert('Lỗi', 'Tổng điểm phải bằng 0! Hiện tại: ' + currentSum);
            return;
        }

        const finalScores = newRoundScores.map(s => {
            const val = parseInt(s);
            return isNaN(val) ? 0 : val;
        });

        onSave(finalScores);
    }, [currentSum, newRoundScores, onSave]);

    const handleClose = useCallback(() => {
        setNewRoundScores(new Array(players.length).fill(''));
        onClose();
    }, [players.length, onClose]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Nhập điểm</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <Trash2 size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <View style={styles.playersList}>
                            {players.map((player, idx) => (
                                <ScoreInputRow
                                    key={idx}
                                    player={player}
                                    score={newRoundScores[idx] || ''}
                                    onChangeScore={(val) => handleScoreChange(idx, val)}
                                />
                            ))}
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
