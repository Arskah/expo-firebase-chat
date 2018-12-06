import React, { Children } from "react";
import { ImageStyle, View, Platform, Text, Button, Alert, BackHandler} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";
import { chat_send, get_user, ChatMessage, UserChatMessage, get_chat_messages, get_new_key } from "../Fire";
import firebase from "firebase";
import Dialog from "react-native-dialog";
import { ImagePicker, Permissions } from "expo";
import {image_upload_chat} from "../Fire";

export interface ChatScreenProps {
  navigation: any
}

export interface ChatScreenState {
  messages: any,
  displayName: string,
  user_id: string,
  chat_id: string,
  dbref: any,
  visible: boolean,
  avatar: string,
}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props: any) {
    super(props);
    const chat_id = this.props.navigation.getParam("chat_id", undefined);
    if (!chat_id) {
      this.props.navigation.navigate("ActiveChatsScreen");
    }
    this.state = {
      messages: [],
      displayName: undefined,
      user_id: undefined,
      chat_id: chat_id,
      dbref: firebase.database().ref("messages").child(chat_id),
      visible: false,
      avatar: undefined,
    };
  }

  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ActiveChatsScreen");
      return true;
    });

    if (firebase.auth()) {

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
          user_id: response.key,
          avatar: response.val().picture,
        });
      });
      // Load messages before starting the chat in order
      this.state.dbref.once("value", (snapshot) => {
        let messages = [];
        /* tslint:disable:no-string-literal */
        snapshot.forEach(child => {
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
              image: child.val()["image"],
            };
            messages.push(message);
          }
          /* tslint:enable:no-string-literal */
        });
        this.setState({messages: messages.reverse()});
      });
      // Load only messages that have come after the creation of start_key
      let start_key = get_new_key("messages");
      this.state.dbref.orderByKey().startAt(start_key).on("child_added", (child) => {
        let messages = [];
        /* tslint:disable:no-string-literal */

        if (child && child.val() && child.val()["_id"]) {
          if (this.state.messages.findIndex(m => m._id === child.val()["_id"]) === -1) {
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
              image: child.val()["image"],
            };
        /* tslint:enable:no-string-literal */
            get_user(userObject.name)
            .then((response: firebase.database.DataSnapshot) => {
              if (response && response.val()) {
                message.user.avatar = response.val().picture;
              }
              messages.push(message);

              this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, messages),
              }));
            })
          }
        }
      });

    } else {
      this.props.navigation.navigate("LoginScreen");
    }
  }

  componentDidUnMount() {
    this.state.dbref.off("child_added");
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  onSend(messages = []) {
    let msg = messages[0];
    if (msg) {
      msg._id = undefined;
      chat_send(this.state.chat_id, msg);
    }
  }

  pickFromCamera = async () => {
    this.setState({ visible: false});
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync(
        {
          allowsEditing: true,
        },
      );
      if (!result.cancelled) {

        let new_key = get_new_key("messages");
        let user: UserChatMessage = {
          _id: this.state.user_id,
          name: this.state.displayName,
          avatar: this.state.avatar,
        };

        let message: ChatMessage = {
          _id: new_key,
          createdAt: new Date(),
          user: user,
          image: result.uri,
        };
        let messages = [];
        messages.push(message);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }));

        const url = await image_upload_chat(this.state.chat_id, result.uri);

        message.image = url;

        chat_send(this.state.chat_id, message)
        .catch(error => console.log(error));
      }
    }
  }

  pickFromGallery = async () => {
    this.setState({ visible: false});
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!result.cancelled) {

      let new_key = get_new_key("messages");
      let user: UserChatMessage = {
        _id: this.state.user_id,
        name: this.state.displayName,
        avatar: this.state.avatar,
      };

      let message: ChatMessage = {
        _id: new_key,
        createdAt: new Date(),
        user: user,
        image: result.uri,
      };
      let messages = [];
      messages.push(message);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }));

      const url = await image_upload_chat(this.state.chat_id, result.uri);

      message.image = url;

      chat_send(this.state.chat_id, message)
      .catch(error => console.log(error));
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
            _id: this.state.user_id,
            name: this.state.displayName,
          }}
          renderAccessory={() => <Button title={"Add a picture"} onPress={this.showDialog}></Button>}
          showUserAvatar = {true}
          imageStyle={undefined}
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
