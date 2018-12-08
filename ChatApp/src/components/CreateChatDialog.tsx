import * as React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Dialog from "react-native-dialog";
import firebase from "firebase";
import { chat_create } from "../Fire";

export interface CreateChatDialogProps {
  dialogVisible: boolean;
  handleCancel: any;
}
export interface CreateChatDialogState {
  reRender: string,
}

class CreateChatDialog extends React.Component<CreateChatDialogProps, CreateChatDialogState> {
  constructor(props: CreateChatDialogProps) {
    super(props);
    this.state = {
      reRender: "render",
    };
  }

  chatTitle = firebase.auth().currentUser.displayName;
  componentWillUnmount() {
    this.props.handleCancel();
  }

  createPressed = () => {
    let uid = firebase.auth().currentUser.uid;
    let this_ = this;
    chat_create(this.chatTitle, uid).then(function () {
      Alert.alert("Chat", "Chat created successfully");
      this_.props.handleCancel();
    });
  }

  render() {
    return (
      <View>
        <Dialog.Container visible={this.props.dialogVisible}>
          <Dialog.Title>Create a new chat</Dialog.Title>
          <Dialog.Input label="Chat title:" defaultValue={firebase.auth().currentUser.displayName}
          onChangeText={(name: string) => this.chatTitle = name} />
          <Dialog.Button label="Cancel" onPress={this.props.handleCancel} />
          <Dialog.Button label="Create" onPress={this.createPressed} />
        </Dialog.Container>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  createChatDialog: {
    backgroundColor: Colors.darkBlue,
    padding: 20,
    width: DEVICE_WIDTH,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
  },
  chatDialogNameText: {
    color: Colors.white,
  },
});
export default CreateChatDialog;
