import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface ChatTitlesListProps {}
export interface ChatTitlesListState {}

class ChatTitlesList extends React.Component<ChatTitlesListProps, ChatTitlesListState> {
  render() {
    return (
      <Text style={styles.chatTitlesList }>
        Chat Titles List
      </Text>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  chatTitlesList: {
  },
});

export default ChatTitlesList;
