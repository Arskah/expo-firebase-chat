import * as React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { active_chats, get_user_by_email } from "../Fire"; 
import * as firebase from 'firebase';
import { object } from "prop-types";

export interface ActiveChatsScreenProps {
  
}
export interface ActiveChatsScreenState {
  displayname: string;
  activeChatsList: object;
}

export default class ActiveChatsScreen extends React.Component<ActiveChatsScreenProps, ActiveChatsScreenState> {
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
      active_chats(email).then((actives) => {
        //console.log(typeof(actives));
        this.setState({activeChatsList : actives})
        //console.log(this.state.activeChatsList);

      });
    };
  }

  render() {
    var temp_list = new Array;
    for (var i in this.state.activeChatsList){
      temp_list.push(this.state.activeChatsList[i]);
    }

    return (
      <View style = {styles.container}>
        <FlatList
          data={temp_list}
          renderItem= {({item}) => <Text style={styles.activeChatsScreen}>{item}</Text>}/>
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  activeChatsScreen: {
  },

  container: {

  },
});

