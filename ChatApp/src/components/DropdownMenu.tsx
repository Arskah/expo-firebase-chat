import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { withNavigation } from "react-navigation";
import firebase from "firebase";
import CreateChatDialog from "./CreateChatDialog";

export interface DropdownMenuProps {
  navigation: any;
}
export interface DropdownMenuState {
  dialogVisible: boolean;
}

class DropdownMenu extends React.Component<DropdownMenuProps, DropdownMenuState> {
  constructor(props: DropdownMenuProps) {
    super(props);
    this.state = {
      dialogVisible: false,
    };
  }

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleCancel = () =>  {
    if (this.isMounted) {
      this.setState({dialogVisible: false});
    }
  }

  handleOnPress = (value) => {
    if (value === "logout") {
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
      }).catch(function (error) {
        // An error happened.
      });
    }
    if (value === "createChat") {
      this.setState({dialogVisible: true});
    }
    if (value === "userSearch") {
      this.props.navigation.navigate('UserSearchScreen')
    }
  }

  render() {
    return (
      <MenuProvider style={styles.menuPlacement}>
        <Menu onSelect={value => this.handleOnPress(value)}>

          <MenuTrigger  >
          <Text style={styles.headerText}>Menu</Text>
          </MenuTrigger  >

          <MenuOptions>
            <MenuOption value={"createChat"}>
              <Text style={styles.menuContent}>Create Chat</Text>
            </MenuOption>
            <MenuOption value={"userSearch"}>
              <Text style={styles.menuContent}>User Search</Text>
            </MenuOption>
            <MenuOption value={"logout"}>
              <Text style={styles.menuContent}>Logout</Text>
            </MenuOption>
          </MenuOptions>

        </Menu>

        <CreateChatDialog
          dialogVisible={this.state.dialogVisible}
          handleCancel={this.handleCancel}/>
      </MenuProvider>

    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  headerText: {
  fontSize: 20,
  margin: 10,
  fontWeight: "bold",
},
menuPlacement: {
  flexDirection: "column",
  padding: 10,
  justifyContent: "flex-end",
  alignItems: "flex-end",
},
menuContent: {
  color: "#000",
  fontWeight: "bold",
  padding: 2,
  fontSize: 20,
},
});

export default withNavigation(DropdownMenu);
