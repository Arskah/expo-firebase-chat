import * as React from "react";
import { View, Platform, StyleSheet, Button, Text } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Dialog from "react-native-dialog";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface ChatRenderAccessoryProps {
  onImageCamera: any;
  onImageGallery: any;
}
export interface ChatRenderAccessoryState {
  visible: boolean;
}

class ChatRenderAccessory extends React.Component<ChatRenderAccessoryProps, ChatRenderAccessoryState> {
  constructor(props: ChatRenderAccessoryProps) {
    super(props);
    this.state = {
      visible: false,
    };
    this.handleImageCamera = this.handleImageCamera.bind(this);
    this.handleImageGallery = this.handleImageGallery.bind(this);
  }

  showDialog = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleImageCamera = () => {
    this.setState({ visible: false });
    this.props.onImageCamera();
  }

  handleImageGallery = () => {
    this.setState({visible: false});
    this.props.onImageGallery();
  }

  render() {
    return (
      <View style={styles.chatRenderAccessory }>
        <Button title={"Add a picture"} onPress={this.showDialog} />
        <Dialog.Container visible={this.state.visible}>
          <Dialog.Title>Pick a picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.handleImageGallery} />
          <Dialog.Button label="Camera" onPress={this.handleImageCamera} />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        </Dialog.Container>
          {Platform.OS === "android" ? <KeyboardSpacer /> : undefined}
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  chatRenderAccessory: {
  },
});

export default ChatRenderAccessory;
