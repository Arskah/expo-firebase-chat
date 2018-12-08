import * as React from "react";
import { View, Platform, StyleSheet, Button, Text } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Dialog from "react-native-dialog";
import { withNavigation } from "react-navigation";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export interface ChatRenderAccessoryProps {
  onImageCamera: any;
  onImageGallery: any;
  navigation: any;
  chat_id: string;
}
export interface ChatRenderAccessoryState {
  DialogVisible: boolean;
}

class ChatRenderAccessory extends React.Component<ChatRenderAccessoryProps, ChatRenderAccessoryState> {
  constructor(props: ChatRenderAccessoryProps) {
    super(props);
    this.state = {
      DialogVisible: false,
    };
    this.handleImageCamera = this.handleImageCamera.bind(this);
    this.handleImageGallery = this.handleImageGallery.bind(this);
  }

  showDialog = () => {
    this.setState({ DialogVisible: true });
  }

  handleDialogCancel = () => {
    this.setState({ DialogVisible: false });
  }

  showGallery = () => {
    this.props.navigation.navigate("GalleryScreen", { chat_id: this.props.chat_id });
  }

  handleImageCamera = () => {
    this.setState({ DialogVisible: false });
    this.props.onImageCamera();
  }

  handleImageGallery = () => {
    this.setState({ DialogVisible: false});
    this.props.onImageGallery();
  }

  render() {
    return (
      <View style={styles.chatRenderAccessory}>
        <Button title={"Add a picture"} onPress={this.showDialog} />
        <Dialog.Container visible={this.state.DialogVisible}>
          <Dialog.Title>Pick a picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.handleImageGallery} />
          <Dialog.Button label="Camera" onPress={this.handleImageCamera} />
          <Dialog.Button label="Cancel" onPress={this.handleDialogCancel} />
        </Dialog.Container>
          {Platform.OS === "android" ? <KeyboardSpacer /> : undefined}
        <Button title={"Show gallery"} onPress={this.showGallery}>
        </Button>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  chatRenderAccessory: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default withNavigation(ChatRenderAccessory);
