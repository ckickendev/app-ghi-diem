import {
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  TextInput,
  Button,
  Modal,
  Alert,
  Pressable,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme } from "@react-navigation/native";

export default function MainView() {
  const [displayPlayer, setDisplayPlayer] = useState(["", "", "", ""]);
  const [inputValue, setInputValue] = useState<string>("");
  const [idValue, setIdValue] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onChangeNameEvent = (id: number, namePlayer: string) => {
    setInputValue(namePlayer);
    setIdValue(id);
    setModalVisible(true);
  };

  const onChangeName = () => {
    setDisplayPlayer(
      displayPlayer.map((item, i) => (i === idValue ? inputValue : item)) // Update item at the given index
    );
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={{backgroundColor: modalVisible? 'rgba(190,91,91,0.3)': DefaultTheme.colors.background, flex: 1}}>
      <SafeAreaView
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: '100%',
        }}
      >
        <SafeAreaView style={styles.viewName}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={{...styles.textStyle, color: 'rgb(234, 55, 55)'}} type="title">
              Select Player
            </ThemedText>
          </ThemedView>
          {displayPlayer.map((playerName: string, i: number) => (
            <Pressable
              key={i}
              style={[styles.button, styles.buttonOpen]}
              onPress={() => {
                onChangeNameEvent(i, playerName);
              }}
            >
              <ThemedText style={styles.textStyle}>
                {`${playerName ? playerName : "player " + (i + 1)}`}{" "}
              </ThemedText>
            </Pressable>
          ))}
        </SafeAreaView>
        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <SafeAreaProvider style={styles.modalProvider}>
              <SafeAreaView style={styles.modalView}>
                <TextInput
                  style={styles.inputStyles}
                  textAlignVertical="center"
                  onChangeText={setInputValue}
                  value={inputValue}
                  textAlign="center"
                />
                <Button title="Confirm" onPress={onChangeName} />
              </SafeAreaView>
            </SafeAreaProvider>
          </Modal>
          
        </SafeAreaView>
        <Pressable style={[styles.button, styles.buttonOpen, styles.buttonStart]}>
            <ThemedText style={styles.textStyle}>Start</ThemedText>
          </Pressable>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {

  },
  viewName: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    margin: 60,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    backgroundColor: 'transparent',
    flexDirection: "row",
    gap: 8,
    marginVertical: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    minWidth: 200,
    marginVertical: 10,
    backgroundColor: "#F194FF",
  },
  buttonStart: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputStyles: {
    fontSize: 16,
    width: "80%",
    margin: 10,
    height: 30,
    borderColor: "red",
    borderWidth: 1,
  },
  centeredView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "70%",
    height: 200,
    margin: 20,
    backgroundColor: "white",
    display: "flex",
    borderRadius: 40,
    padding: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // height: 200
  },
  modalProvider: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
