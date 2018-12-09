import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BackHandler, FlatList, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { user_search, active_chats, get_chat_details, chat_adduser } from "../Fire";
import * as firebase from "firebase";


export interface UserSearchProps {}
export interface UserSearchState {
  searchText: string,
  users: any,
  selectedUser?: Object
  availableChats: any
}


class UserSearch extends React.Component<UserSearchProps, UserSearchState> {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {
      searchText: '',
      users: [],
      selectedUser: null,
      availableChats: [],
    };
  }
  chat_details = (chats_list, this_) => {
    let chat_promises = get_chat_details(chats_list);
    Promise.all(chat_promises).then(function (snapshots) {
      let chats = snapshots.map((snapshot)=>{
        let chat = snapshot.val()
        chat.key = snapshot.key
        console.log(chat);
        return chat;
      })
      this_.setState({availableChats: chats});
    });
  }
  searchUsers = () => {
    if (this.state.searchText.length>1){
      user_search(this.state.searchText).then((users)=>{
        console.log(users);
        this.setState({
          users: users,
        })
      })
    }
  }
  componentDidMount(){
    this._isMounted = true;
    if (firebase.auth()) {
      const email = firebase.auth().currentUser.email;
      active_chats().then((actives) => {
        let temp_list = new Array;
        for (let i of Object.keys(actives)) {
          temp_list.push(actives[i]);
        }
        this.chat_details(temp_list, this);
      });
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>  
      <SearchBar
        onChangeText={(text) => this.setState({searchText:text})}
        onSubmitEditing={this.searchUsers}
        placeholder='Search user'/>
      
       <FlatList
            data = {this.state.users}
            renderItem = {({item}) =>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => {this.setState({selectedUser: item})}}> 
                <Text> {item.displayName}: {item.email} </Text>
              </TouchableOpacity>
            }
          />
      { this.state.selectedUser && 
      <View>
      <Text>Add {this.state.selectedUser ? this.state.selectedUser.displayName: "None"} to Group</Text>
      <FlatList
            data = {this.state.availableChats}
            renderItem = {({item}) =>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => {
                  if (firebase.auth()){
                    chat_adduser(item.key, this.state.selectedUser.key, firebase.auth().currentUser.uid)};
                  }
                  }> 
                <Text>{item.title} </Text>
              </TouchableOpacity>
            }
          />
      </View>
      }
      </View>
      
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  chatButton: {
    padding: 8,
    fontSize: 14,
    height:40,
    width: DEVICE_WIDTH - 50,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "black",
  },

});


export default UserSearch;
