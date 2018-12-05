import React from "react";
import { ImageStyle, View, Platform, Text, Button, Alert} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";
import { chat_send, get_user, ChatMessage, UserChatMessage, get_chat_messages } from "../Fire";
import firebase from "firebase";
import Dialog from "react-native-dialog";
import { ImagePicker, Permissions } from "expo";
import {image_upload_chat} from "../Fire";

export interface ChatScreenProps {
  navigation: any,
  chat_id?: string
  user_id?: string
}

export interface ChatScreenState {
  messages: any,
  displayName: string,
  id: string,
  chat_id: string,
  dbref: any,
  visible: boolean,

}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props: any) {
    super(props);
    if(!this.props.chat_id){
      this.state = {
        messages: [],
        displayName: undefined,
        id: undefined,
        chat_id: "123",
        dbref: firebase.database().ref("messages").child("123"),
        visible: false,
      };
    }
    else{
      this.state = {
        messages: [],
        displayName: undefined,
        id: undefined,
        chat_id: this.props.chat_id,
        dbref: firebase.database().ref("messages").child(this.props.chat_id),
        visible: false,
      };
    }
    
  }

  componentDidMount() {

    if (firebase.auth()) {
      this.state.dbref.on("child_added", (child) => {
        let messages = [];
        /* tslint:disable:no-string-literal */
      
        if (child && child.val() && child.val()["_id"]) {

          let message: ChatMessage;
          let userObject: UserChatMessage;

          userObject = {
            _id: child.val()["user"]["_id"],
            name: child.val()["user"]["name"],
            avatar: child.val()["user"]["avatar"],
          };

          message = {
            _id: child.val()["_id"],
            createdAt: child.val()["createdAt"],
            text: child.val()["text"],
            user: userObject,

          };
          messages.push(message);
        }
        /* tslint:enable:no-string-literal */
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }));
      });

      const user = firebase.auth().currentUser;
      let value = user.displayName;
      let method: "displayName" | "email" = "displayName";
      if (!user.displayName) {
        value = user.email;
        method = "email";
      }
      get_user(value, method)
      .then((response: firebase.database.DataSnapshot) => {
        this.setState({
          displayName: response.val().displayName,
          id: response.key,
        });
      });
    } else {
      this.props.navigation.navigate("LoginScreen");
    }
  }

  componentDidUnMount() {
    this.state.dbref.off("value");
  }

  onSend(messages = []) {
    if (messages[0]) {
      chat_send(this.state.chat_id, messages[0]);
    }
  }

  pickFromCamera = async () => {
    this.setState({ visible: false});
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync(
        {
          allowsEditing: true,
          aspect: [4, 3],
        },
      );
      if (!result.cancelled) {
        // @ts-ignore
        image_upload_chat(this.state.chat_id, result.uri);
        Alert.alert("Send picture from camera");
        
      }
    }
  }

  pickFromGallery = async () => {
    this.setState({ visible: false});
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      // @ts-ignore
      image_upload_chat(this.state.chat_id, result.uri);
      Alert.alert("Send picture from gallery")
    }
  }

  showDialog = () => {
    this.setState({ visible: true });
  }


  handleCancel = () => {
    this.setState({ visible: false });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.id,
            name: this.state.displayName,
          }}
          renderAccessory={() => <Button title={"Add a picture"} onPress={this.showDialog}></Button>}
          // imageStyle={new ImageStyle()}
        />
        <Dialog.Container visible={this.state.visible}>
          <Dialog.Title>Pick a picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.pickFromGallery} />
          <Dialog.Button label="Camera" onPress={this.pickFromCamera} />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        </Dialog.Container>
        {Platform.OS === "android" ? <KeyboardSpacer /> : undefined }
      </View>
    );
  }
}
