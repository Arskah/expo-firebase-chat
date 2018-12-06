import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BackHandler, FlatList, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { user_search } from "../Fire";


export interface UserSearchProps {}
export interface UserSearchState {
  searchText: string,
  users: any,
}

class UserSearch extends React.Component<UserSearchProps, UserSearchState> {

  constructor(props){
    super(props);
    this.state = {
      searchText: '',
      users: [],
    };
  }
  
  searchUsers = () => {
    user_search(this.state.searchText).then((users)=>{
      this.setState({
        searchText: this.state.searchText,
        users: users,
      })
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.userSearch }>
        User Search
      </Text>
      
      <SearchBar
        onChangeText={(text) => this.setState({searchText:text, users: this.state.users})}
        onSubmitEditing={this.searchUsers}
        placeholder='Search user'/>
      
       <FlatList
            data = {this.state.users}
            renderItem = {({item}) =>
              <TouchableOpacity
                onPress={() => {}}>
                <Text> {item.displayName}: {item.email} </Text>
              </TouchableOpacity>
            }
          />
      </View>
      
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  userSearch: {
  },
});

export default UserSearch;
