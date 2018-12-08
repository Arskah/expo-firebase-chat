import React from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";

export interface GalleryScreenProps {
  navigation: any;
}
export interface GalleryScreenState { }

export default class GalleryScreen extends React.Component<GalleryScreenProps, GalleryScreenState> {
  chat_id: string;
  constructor(props: GalleryScreenProps) {
    super(props);
    const chat_id = this.props.navigation.getParam("chat_id", undefined);
    this.chat_id = chat_id;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ChatScreen", {chat_id: this.chat_id});
      return true;
    });
  }

  componentDidUnMount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Gallery of {this.chat_id}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
