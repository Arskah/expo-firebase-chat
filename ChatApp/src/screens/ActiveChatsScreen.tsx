import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { active_chats, get_user_by_email } from "../Fire"; 
import * as firebase from 'firebase';

export interface ActiveChatsScreenProps {
  
}
export interface ActiveChatsScreenState {
  displayname: string;
  activeChatsList: object;
}

class ActiveChatsScreen extends React.Component<ActiveChatsScreenProps, ActiveChatsScreenState> {
  constructor(props: ActiveChatsScreenProps) {
    super(props);
    this.state = {
      displayname: "",
      activeChatsList: null,
      };
  }

  //Object of all active chat rooms
  componentDidMount() {
    if (firebase.auth()) {
      const email = firebase.auth().currentUser.email;
      var active;
      active_chats(email).then((actives) => {
        this.setState({activeChatsList : actives})
        console.log(this.state.activeChatsList);
      });
    };
  }

  render() {
    return (
      <Text style={styles.activeChatsScreen }>
        
      </Text>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  activeChatsScreen: {
  },
});

export default ActiveChatsScreen;
