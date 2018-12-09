import * as React from "react";
import { BackHandler, View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { active_chats, get_chat_details } from "../Fire";
import * as firebase from "firebase";
import Wallpaper from "../components/Wallpaper";
import DropdownMenu from "../components/DropdownMenu";
import CustomHeader from "../components/CustomHeader";

export interface ActiveChatsScreenProps {
  navigation: any;
}

export interface ActiveChatsScreenState {
  displayname: string;
  activeChatsList: object;
  titles_lastMessages: Array<object>;
}

export default class ActiveChatsScreen extends React.Component<ActiveChatsScreenProps, ActiveChatsScreenState> {
  _isMounted = false;
  constructor(props: ActiveChatsScreenProps) {
    super(props);
    this.state = {
      displayname: "",
      activeChatsList: undefined,
      titles_lastMessages: undefined,
      };
  }

   // Object of all active chat rooms
   componentDidMount() {
     this._isMounted = true;
    if (firebase.auth()) {
      const email = firebase.auth().currentUser.email;
      active_chats().then((actives) => {
        let temp_list = new Array;
        for (let i of Object.keys(actives)) {
          temp_list.push(actives[i]);
        }
        this.chat_details(temp_list, this);
        if (this._isMounted) {
          this.setState({activeChatsList : actives});
        }
      });
    }

    BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
    this._isMounted = false;
  }

  get_titles_lastMessages = (results) => {
    let return_list = [];
    for (let i of Object.keys(results)) {
      return_list.push({title: results[i][0].val().title,
                        lastMessage: results[i][0].val().lastMessage,
                        key: results[i][1]});
    }
    if (this._isMounted) {
      this.setState({titles_lastMessages: return_list});
    }
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

  handleOnPress = (chat_id, chat_title) => {
    this.props.navigation.navigate("ChatScreen", {chat_id: chat_id, chat_title: chat_title});
  }

  onSwipeRight() {
    this.props.navigation.navigate("SettingsScreen");
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <Wallpaper>
        <GestureRecognizer
          onSwipeRight={() => this.onSwipeRight()}
          config={config}
          style={{
            backgroundColor: "transparent",
            flex: 1,
          }}
        >
        <CustomHeader text={"Chat list"} navigation={this.props.navigation} />
        <View style = {styles.container}>
          <FlatList
            data = {this.state.titles_lastMessages}
            renderItem = {({item}) =>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => this.handleOnPress(item["key"], item["title"])}>
                <Text style={styles.titleText}> {item["title"]} {"\n"}</Text>
                <Text style={styles.lastMessageText}> {item["lastMessage"]} </Text>
              </TouchableOpacity>
            }
          />
        </View>
        <DropdownMenu />

        </GestureRecognizer>
      </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  chatButton: {
    padding: 8,
    fontSize: 14,
    height: 60,
    width: DEVICE_WIDTH,
    alignItems: "flex-start",
    backgroundColor: "#00000022",
    borderColor: "black",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  container: {
    top: 30,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    height: DEVICE_HEIGHT - 30,
    flex: 3,
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
