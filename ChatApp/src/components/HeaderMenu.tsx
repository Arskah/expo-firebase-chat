import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface HeaderMenuProps {}
export interface HeaderMenuState {}

class HeaderMenu extends React.Component<HeaderMenuProps, HeaderMenuState> {
  render() {
    return (
      <Text style={styles.headerMenu }>
        Header Menu
      </Text>
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
