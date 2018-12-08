import * as React from "react";
import { View, Text, StyleSheet, Alert} from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { withNavigation } from "react-navigation";
import Dialog from "react-native-dialog";
import firebase from "firebase";
import { chat_create } from "../Fire";

export interface CreateChatDialogProps {
  navigation: any;
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
    let createdPromise, new_chat;
    [createdPromise, new_chat] = chat_create(this.chatTitle, uid);
    createdPromise.then(() => {
      Alert.alert("Chat", "Chat created successfully");
      this.props.handleCancel();
      let tmp_chat_id = Object.keys(new_chat)[0].split("/")[2];
      this.props.navigation.navigate("ChatScreen", {chat_id: tmp_chat_id});
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
export default withNavigation(CreateChatDialog);
