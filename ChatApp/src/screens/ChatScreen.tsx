import React from "react";
import { ImageStyle, View, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat } from 'react-native-gifted-chat'
import { chat_send, get_user, ChatMessage, UserChatMessage } from '../Fire';
import firebase from "firebase";

export interface ChatScreenProps {
  navigation: any,
  chat_id?: string
  user_id?: string
};

export interface ChatScreenState { 
  messages: any,
  displayName: string,
  id: string,
  chat_id: string,
  dbref: any

}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props: any){
    super(props)
    this.state = {
      messages: [],
      displayName: undefined,
      id: undefined,
      chat_id: "123",
      dbref: undefined
    }
  }

  componentDidMount() {

    if (firebase.auth()) {
      
      let dbref = firebase.database().ref('messages').child("123");
      /*
      dbref.on('value', (e) => {
        var rows = [];
        if ( e && e.val() && e.val().map ) {
            e.val().map((v) => rows.push ( v ));
        }
        console.log("Rows: ",rows);
      });*/
      
      dbref.on('value', (snapshot) => {
        console.log(snapshot)
        let messages = []
        snapshot.forEach(value => {
          if(value && value.val() && value.val()["_id"]){

            let message : ChatMessage;
            let user : UserChatMessage;

            user = {
              _id: value.val()["user"]["_id"],
              name: value.val()["user"]["name"],
              avatar: value.val()["user"]["avatar"]
            }

            message = {
              _id: value.val()["_id"],
              createdAt: value.val()["createdAt"],
              text: value.val()["text"],
              user: user

            }

            messages.push(message);

          }
          this.setState({messages:messages.reverse()})
        })
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
          dbref: dbref
        });
      });
    }
    else{
      this.props.navigation.navigate("LoginScreen");
    }
  }

  componentDidUnMount() {
    this.state.dbref.off('value');
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    if(messages[0]){
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
          //imageStyle={new ImageStyle()}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    )
  }
}