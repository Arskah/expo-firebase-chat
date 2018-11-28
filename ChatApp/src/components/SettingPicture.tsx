import * as React from "react";
import Layout from "../constants/Layout";
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import { Asset } from "expo";

export interface SettingPictureProps {}
export interface SettingPictureState {}

class SettingPicture extends React.Component<SettingPictureProps, SettingPictureState> {

  render() {

    return (
      <TouchableOpacity
      style={styles.container}
      onPress={() => alert("Change picture")}>
      <Image
          source={require("../../assets/images/robot-dev.png")}
          style={styles.image}
        />
    </TouchableOpacity>
    );
  }

}
const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default SettingPicture;
