import * as React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { BackHandler, FlatList, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import {Font} from "expo";
import { user_search, active_chats, get_chat_details, chat_adduser } from "../Fire";
import * as firebase from "firebase";


export interface UserSearchProps {}
export interface UserSearchState {
  searchText: string,
  users: any,
  selectedUser?: Object
  availableChats: any,
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

  /*
  async componentWillMount() {
    await Font.loadAsync({'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')}) 
    this.setState({ fonts: true })
  }*/

  chat_details = (chats_list, this_) => {
    let chat_promises = get_chat_details(chats_list);
    Promise.all(chat_promises).then(function (snapshots) {
      let chats = snapshots.map((snapshot)=>{
        let chat = snapshot.val()
        chat.key = snapshot.key
        return chat;
      })
      this_.setState({availableChats: chats});
    });
  }
  searchUsers = () => {
    if (this.state.searchText.length>1){
      user_search(this.state.searchText).then((users)=>{
        this.setState({
          selectedUser: null,
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

  handlePress = async (item) => {
    if (firebase.auth()){
      let user = firebase.auth().currentUser;
      //@ts-ignore
      let promise = chat_adduser(item.key, this.state.selectedUser.key, this.state.selectedUser.displayName, user.uid, user.displayName);
      promise
      .then(response => {
        console.log(response);
        if(!response){
          Alert.alert("User already in the chat");
        } else {
          //@ts-ignore
          Alert.alert(`${this.state.selectedUser.displayName} was added to chat ${item.title}`);
        }
      })
    };
  }


  render() {
    return (
      <View style={styles.container}>  
      <Text style={styles.title}>Search users</Text>
      <SearchBar
        style={styles.searchButton}
        onChangeText={(text) => this.setState({searchText:text})}
        onSubmitEditing={this.searchUsers}
        placeholder='Search user'/>
      
       <FlatList
            data = {this.state.users}
            renderItem = {({item}) =>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => {this.setState({selectedUser: item})}}> 
                //@ts-ignore
                <Text> {item.displayName}: {item.email} </Text>
              </TouchableOpacity>
            }
          />
      { this.state.selectedUser !== null && 
      <View>
      //@ts-ignore
      <Text style={styles.title} >Add {this.state.selectedUser.displayName} to Group</Text>
      <FlatList
            style={{maxHeight:300}}
            data = {this.state.availableChats}
            renderItem = {({item}) =>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => this.handlePress(item)}> 
                //@ts-ignore
                <Text style={{marginLeft:"auto", marginRight:"auto"}}>{item.title} </Text>
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
  searchButton: {
    marginTop: 10,
    height:60,
  },
  container: {
    marginTop: 20
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 25,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: "bold"
  },
  chatButton: {
    marginTop: 16,
    padding: 8,
    fontSize: 14,
    height:40,
    backgroundColor: "#bb77bb",
    marginLeft:20,
    width: DEVICE_WIDTH - 50,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "black",
  },

});


export default UserSearch;
