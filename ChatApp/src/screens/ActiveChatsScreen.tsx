import * as React from "react";
import { BackHandler, View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { active_chats, get_chat_details } from "../Fire";
import * as firebase from "firebase";
import { object } from "prop-types";
import Wallpaper from "../components/Wallpaper";

export interface ActiveChatsScreenProps {
  navigation: any;
}

export interface ActiveChatsScreenState {
  displayname: string;
  activeChatsList: object;
  titles_lastMessages: Array<{}>;
}

export default class ActiveChatsScreen extends React.Component<ActiveChatsScreenProps, ActiveChatsScreenState> {
  constructor(props: ActiveChatsScreenProps) {
    super(props);
    this.state = {
      displayname: "",
      activeChatsList: undefined,
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
        for (let i of Object.keys(actives)) {
          temp_list.push(actives[i]);
        }
        this.chat_details(temp_list, this);

      });
    }

    BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  get_titles_lastMessages = (results) => {
    let return_list = [];
    for (let i of Object.keys(results)) {
      return_list.push({key: results[i][0].val().title,
                        lastMessage: results[i][0].val().lastMessage,
                        chatId: results[i][1]});
    }
    this.setState({titles_lastMessages: return_list});
  }

  chat_details = (chats_list, this_) => {
    let chat_promises = get_chat_details(chats_list);
    Promise.all(chat_promises).then(function (snapshots) {
      let results = [];
      snapshots.forEach(function(snapshot) {
        results.push([snapshot, snapshot.key]);
      });
      this_.get_titles_lastMessages(results);
    });
  }

  handleOnPress = (chat_id) => {
    console.log(chat_id);
    this.props.navigation.navigate("ChatScreen", {chat_id: chat_id});
  }

  render() {
    return (
      <Wallpaper>
        <View style = {styles.container}>
          <FlatList
            data = {this.state.titles_lastMessages}
            renderItem = {({item}) =>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => this.handleOnPress(item.chatId)}>
                <Text style={styles.titleText}> {item.key} {"\n"}</Text>
                <Text style={styles.lastMessageText}> {item.lastMessage} </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </Wallpaper>

    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  chatButton: {
    padding: 8,
    fontSize: 18,
    height: 60,
    width: DEVICE_WIDTH - 50,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "black",
  },
  container: {
    top: 30,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    height: 25,
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessageText: {
    height: 25,
    fontSize: 16,
  },
});
