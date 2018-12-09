import * as React from "react";
import { View, Platform, StyleSheet, Button, Text, Alert } from "react-native";
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
  onLeave: any;
  chat_title: string;
}
export interface ChatRenderAccessoryState {
  PictureDialogVisible: boolean;
  LeaveDialogVisible: boolean;
}

class ChatRenderAccessory extends React.Component<ChatRenderAccessoryProps, ChatRenderAccessoryState> {
  constructor(props: ChatRenderAccessoryProps) {
    super(props);
    this.state = {
      PictureDialogVisible: false,
      LeaveDialogVisible: false,
    };
    this.handleImageCamera = this.handleImageCamera.bind(this);
    this.handleImageGallery = this.handleImageGallery.bind(this);
  }

  showPictureDialog = () => {
    this.setState({ PictureDialogVisible: true });
  }

  showLeaveDialog = () => {
    this.setState({ LeaveDialogVisible: true });
  }


  handleDialogCancel = () => {
    this.setState({ PictureDialogVisible: false, LeaveDialogVisible: false });
  }

  showGallery = () => {
    this.props.navigation.navigate("GalleryScreen", { chat_id: this.props.chat_id, chat_title: this.props.chat_title });
  }

  handleImageCamera = () => {
    this.setState({ PictureDialogVisible: false });
    this.props.onImageCamera();
  }

  handleImageGallery = () => {
    this.setState({ PictureDialogVisible: false});
    this.props.onImageGallery();
  }

  handleDialogLeave = () => {
    this.setState({ LeaveDialogVisible: false});
    this.props.onLeave();
  }

  render() {
    return (
      <View style={styles.chatRenderAccessory}>
        <Button title={"Add a picture"} onPress={this.showPictureDialog} />
        <Dialog.Container visible={this.state.PictureDialogVisible}>
          <Dialog.Title>Pick a picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.handleImageGallery} />
          <Dialog.Button label="Camera" onPress={this.handleImageCamera} />
          <Dialog.Button label="Cancel" onPress={this.handleDialogCancel} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.LeaveDialogVisible}>
          <Dialog.Title>Are you sure you want to leave this group?</Dialog.Title>
          <Dialog.Button label="Yes, let me out" onPress={this.handleDialogLeave} />
          <Dialog.Button label="No, I'm good here" onPress={this.handleDialogCancel} />
        </Dialog.Container>
        <Button title={"Show gallery"} onPress={this.showGallery}>
        </Button>
        <Button title={"Leave chat"} onPress={this.showLeaveDialog} />
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
