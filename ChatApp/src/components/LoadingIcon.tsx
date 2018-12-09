import * as React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface LoadingIconProps {image: any}
export interface LoadingIconState {}

class LoadingIcon extends React.Component<LoadingIconProps, LoadingIconState> {
  render() {
    return (
      <View style={styles.loadingIcon}><Image source={this.props.image}></Image><Text>Loading</Text></View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  loadingIcon: {
    justifyContent: 'center',
    flex: 1,
    alignItems:"center",
  },
});

export default LoadingIcon;
