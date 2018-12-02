import React from "react";
import { ImageStyle, View, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat } from 'react-native-gifted-chat'
import { chat_send } from '../Fire';

export interface ChatInterface {
  chat_id?: string
  user_id?: string
};

export default class ChatScreen extends React.Component<ChatInterface, any> {
  constructor(props: any){
    super(props)
    this.state = {
      messages: [],
    }
  }
  
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developers',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    messages.forEach(msg => {
      chat_send("test", msg, "test")  
    });
    
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.user_id,
          }}
          //imageStyle={new ImageStyle()}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    )
  }
}