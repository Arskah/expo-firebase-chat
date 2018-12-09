import * as React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {Icon} from "react-native-elements";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface HeaderMenuProps {handlePress: any,}
export interface HeaderMenuState {}

class HeaderMenu extends React.Component<HeaderMenuProps, HeaderMenuState> {

  render() {
    return (
      <Icon name={"menu"} color={"#fff"} onPress={this.props.handlePress}></Icon>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  headerMenu: {
  },
});

export default HeaderMenu;
