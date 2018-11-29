import React, {Component} from "react";
import Layout from "../constants/Layout";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import Colors from "../constants/Colors";

export interface SettingSaveProps {
  handleClick: any,
}
export interface SettingSaveState {}

class SettingSave extends Component<SettingSaveProps, SettingSaveState> {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.handleClick}>
          <Text style={styles.text}>Save changes</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: DEVICE_WIDTH,
    top: 50,
    marginBottom: 300,
    alignItems: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 20,
  },
});

export default SettingSave;
