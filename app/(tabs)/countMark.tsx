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

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function MainView() {
  const [displayPlayer, setDisplayPlayer] = useState(["hello", "hello", "hello", "hello"]);
  const data = [1, 2, 3, 4, 5];

  return (
    <ScrollView style={{height: '100%'}}>
      <SafeAreaView
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SafeAreaView style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent:'space-evenly' }}> 
            {displayPlayer.map((name) => {
                return <ThemedText style={styles.textStyle}>{name}</ThemedText>
            })}
        </SafeAreaView>
        <SafeAreaView style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent:'space-evenly' }}>
            {
                data.map((datum) => { // This will render a row for each data element.
                        return renderRow();
                    })
            }
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
}

    const renderRow = () => {
    return (
            <SafeAreaView style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent:'space-evenly'  }}>
              <ThemedText style={styles.textStyle}>1</ThemedText>
              <ThemedText style={styles.textStyle}>2</ThemedText>
              <ThemedText style={styles.textStyle}>3</ThemedText>
              <ThemedText style={styles.textStyle}>4</ThemedText>
            </SafeAreaView>
      );
  }

const styles = StyleSheet.create({
  viewName: {
    display: 'flex',
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
