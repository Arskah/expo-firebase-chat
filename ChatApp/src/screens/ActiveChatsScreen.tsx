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

interface UserProfile {
  displayName: string;
  email: string;
  resolution: string;
  picture: string;
}

class ActiveChatsScreen extends React.Component<ActiveChatsScreenProps, ActiveChatsScreenState> {
  constructor(props: ActiveChatsScreenProps) {
    super(props);
    this.state = {
      displayname: "",
      activeChatsList: null,
      };
  }

  componentDidMount() {
    if (firebase.auth()) {
      const email = firebase.auth().currentUser.email;
      //const name = get_user_by_email(email);
      var active;
      //var username = "";
      //const user_promise = name.then((user_profile: UserProfile) => {
      //  if (user_profile) {
          //console.log(user_profile.displayName);
          //this.setState({actives: active_chats('Arska')});
      active_chats(email).then((actives) => {
        console.log(actives)
        this.setState({activeChatsList : actives})
        console.log(this.state.activeChatsList);

      });
      //  }
      //});

      //console.log(this.state.actives);
      //if (username) {
        //this.setState({displayname: name});
        //console.log(this.state.displayname);
        //active_chats(name);
      //}
    
      
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
