import * as React from "react";
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {StyleSheet, TextInput} from 'react-native';

export interface LoginUsernameProps {}
export interface LoginUsernameState {
  username: string;
}

class LoginUsername extends React.Component<LoginUsernameProps, LoginUsernameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
    };
  }
  render() {
    return (
      <TextInput
        onChangeText={(text) => this.setState({ username: text })}
        style={styles.loginUsername }
        autoFocus={true}
        placeholder={"Username"} />
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  loginUsername: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default LoginUsername;
