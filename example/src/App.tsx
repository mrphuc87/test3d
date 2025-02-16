import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";

export default function App() {
  const [screen, setScreen] = useState(1)
  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        {screen === 1 && <Screen1 />}
        {screen === 2 && <Screen2 />}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => {
          setScreen(1)
         }}>
          <Text style={styles.buttonText}>Screen 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {
          setScreen(2)
        }}>
          <Text style={styles.buttonText}>Screen 2</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  canvasContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  }
});

