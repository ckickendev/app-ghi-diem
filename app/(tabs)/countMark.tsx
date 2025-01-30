import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  View,
  Text,
  Pressable,
  Button,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";

export default function MainView() {
  const [displayPlayer, setDisplayPlayer] = useState([
    "hello",
    "hello",
    "hello",
    "hello",
  ]);
  const [data, setData] = useState([
    [1, 3, 3, 5],
    [2, 1, 2, -2],
    [1, 2, 3, 3],
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(["","","",""]);

  const onAddGame = () => {
    console.log(inputValue);
    const newData = [Number(inputValue[0]), Number(inputValue[1]), Number(inputValue[2]), Number(inputValue[3])];
    console.log(newData);
    setModalVisible(false);
    setData((od : number[][]) => {
      od.push(newData)
      return od;
    })
  };

  const onChangeName = (e: any, i: number) =>{
    setInputValue((arr: string[]) => {
      return arr.map((value, index) => (index === i ? e : value))
    })
  }
  return (
    <ScrollView>
      <SafeAreaView
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SafeAreaView
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {displayPlayer.map((name, index) => {
            return (
              <ThemedText key={index} style={styles.textStyle}>
                {name}
              </ThemedText>
            );
          })}
        </SafeAreaView>
        <SafeAreaView
          style={{
            flex: 1,
            alignSelf: "stretch",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          {data.map((element, index) => {
            console.log(element);
            return renderRow(element, index);
          })}
        </SafeAreaView>
        <SafeAreaView>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Add game</Text>
          </Pressable>
        </SafeAreaView>
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
        >
          <SafeAreaProvider style={styles.modalProvider}>
            <SafeAreaView style={styles.modalView}>
              <TextInput
                style={styles.inputStyles}
                textAlignVertical="center"
                onChangeText={(e) => onChangeName(e,0)}
                value={inputValue[0]}
                textAlign="center"
              />
              <TextInput
                style={styles.inputStyles}
                textAlignVertical="center"
                onChangeText={(e) => onChangeName(e,1)}
                value={inputValue[1]}
                textAlign="center"
              />
              <TextInput
                style={styles.inputStyles}
                textAlignVertical="center"
                onChangeText={(e) => onChangeName(e,2)}
                value={inputValue[2]}
                textAlign="center"
              />
              <TextInput
                style={styles.inputStyles}
                textAlignVertical="center"
                onChangeText={(e) => onChangeName(e,3)}
                value={inputValue[3]}
                textAlign="center"
              />
              <Button title="Confirm" onPress={onAddGame} />
            </SafeAreaView>
          </SafeAreaProvider>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
}

const renderRow = (data: any, index: number) => {
  // console.log(data);

  return (
    <SafeAreaView
      key={index}
      style={{
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <ThemedText style={styles.textStyle}>{data[0]}</ThemedText>
      <ThemedText style={styles.textStyle}>{data[1]}</ThemedText>
      <ThemedText style={styles.textStyle}>{data[2]}</ThemedText>
      <ThemedText style={styles.textStyle}>{data[3]}</ThemedText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewName: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "black",
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
    // height: "60%",
  },
  modalView: {
    margin: 40,
    width: "70%",
    height: 200,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});
