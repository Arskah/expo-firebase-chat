import * as React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { active_chats, get_user_by_email, get_chat_details } from "../Fire";
import * as firebase from "firebase";
import { object } from "prop-types";
import Wallpaper from "../components/Wallpaper";

export interface ActiveChatsScreenProps {}

export interface ActiveChatsScreenState {
  displayname: string;
  activeChatsList: object;
  // activeChatsDetailsList: Array<object>;
  titles_lastMessages: Array<{}>;
}

export default class ActiveChatsScreen extends React.Component<ActiveChatsScreenProps, ActiveChatsScreenState> {
  constructor(props: ActiveChatsScreenProps) {
    super(props);
    this.state = {
      displayname: "",
      activeChatsList: undefined,
      // activeChatsDetailsList: [],
      titles_lastMessages: [],
      };
  }

   // Object of all active chat rooms
   componentDidMount() {
    if (firebase.auth()) {
      const email = firebase.auth().currentUser.email;
      active_chats().then((actives) => {
        this.setState({activeChatsList : actives});
        let temp_list = new Array;
        for (let i in actives) {
          temp_list.push(actives[i]);
        }
        // console.log(this.state);
        this.chat_details(temp_list, this);

      });
    }
  }

  get_titles_lastMessages = (results) => {
    let return_list = [];
    for (let i in results) {
      return_list.push({title: results[i].val().title, lastMessage: results[i].val().lastMessage});
    }
    this.setState({titles_lastMessages: return_list});
  }

  /*get_last_messages = (results) => {
    let last_messages = [];
    for (let i in results){
      last_messages.push(results[i].val().lastMessage);
    }
    this.setState({lastMessages:last_messages})
  }*/

  chat_details = (chats_list, this_) => {
    let chat_promises = chats_list.map(function(key) {
      return firebase.database().ref("chats").child(key).once("value");
    });
    Promise.all(chat_promises).then(function (snapshots) {
      let results = [];
      snapshots.forEach(function(snapshot) {
        results.push(snapshot);
      });
      this_.get_titles_lastMessages(results);
    });
  }

  render() {
    // console.log(this.state.activeChatsDetailsList);
    // let lastMessages = this.get_last_messages();

    return (
      <Wallpaper>
        <View style = {styles.container}>
          <FlatList
            data = {this.state.titles_lastMessages}
            renderItem = {({item}) =>
              <Text style={styles.activeChatsScreen}> {item.title} {"\n"} {item.lastMessage} </Text>}/>
        </View>
      </Wallpaper>

    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  activeChatsScreen: {
    padding: 8,
    fontSize: 18,
    height: 60,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },

  container: {
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
});