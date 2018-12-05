import React from "react";
import { ImageStyle, View, Platform } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";
import { chat_send, get_user, ChatMessage, UserChatMessage } from "../Fire";
import firebase from "firebase";

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
  dbref: any

}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props: any) {
    super(props);
    this.state = {
      messages: [],
      displayName: undefined,
      id: undefined,
      chat_id: "",
      dbref: undefined,
    };
  }

  componentDidMount() {

    if (firebase.auth()) {
      let chatId = this.props.navigation.getParam("chat_id", "ERROR NO CHAT ID");
      this.setState({chat_id: chatId});
      let dbref = firebase.database().ref("messages").child(chatId);
      dbref.on("value", (snapshot) => {
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

            };
            messages.push(message);
          }
          /* tslint:enable:no-string-literal */
        });
        this.setState({messages: messages.reverse()});
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
          dbref: dbref,
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
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    if (messages[0]) {
      chat_send(this.state.chat_id, messages[0]);
    }
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
          // imageStyle={new ImageStyle()}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : undefined }
      </View>
    );
  }
}
