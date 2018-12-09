import * as React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {Icon} from "react-native-elements";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface HeaderHomeProps {
  handlePress: any,
}
export interface HeaderHomeState {}

class HeaderHome extends React.Component<HeaderHomeProps, HeaderHomeState> {
  render() {
    return (
      <Icon name={"home"} color={"#fff"} onPress={this.props.handlePress}></Icon>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  headerHome: {
  },
});

export default HeaderHome;
