import * as React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface SettingsButtonProps {
  navigation: any;
}
export interface SettingsButtonState {}

class SettingsButton extends React.Component<SettingsButtonProps, SettingsButtonState> {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity style={styles.button} onPress={() => navigate("SettingsScreen")}>
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.blue,
    padding: 20,
  },
  text: {
    color: Colors.black,
    textAlign: "center",
  },
});

export default withNavigation(SettingsButton);
