import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import { RootStackParamList } from '../types';
import Button from '../components/Button';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPlayer'>;

const EditPlayerScreen = ({ route, navigation }: Props) => {
  const { playerId } = route.params;
  const { players, editPlayer } = useGameState();
  const [playerName, setPlayerName] = useState('');
  
  const player = players.find(p => p.id === playerId);

  useEffect(() => {
    if (player) {
      setPlayerName(player.name);
    } else {
      Alert.alert('Error', 'Player not found');
      navigation.goBack();
    }
  }, [player, navigation]);

  const handleSave = () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Player name cannot be empty');
      return;
    }

    editPlayer(playerId, playerName);
    navigation.goBack();
  };

  if (!player) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Player</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Player Name</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter player name"
            placeholderTextColor={COLORS.placeholder}
            autoFocus
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
        />
      </View>
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
  content: {
    padding: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    ...SHADOWS.small,
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
});

export default EditPlayerScreen;