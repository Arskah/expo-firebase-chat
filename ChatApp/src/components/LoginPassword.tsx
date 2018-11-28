import * as React from "react";
import Layout from '../constants/Layout';
import {TextInput, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";

export interface LoginPasswordProps {}
export interface LoginPasswordState {
  password: string;
}

class LoginPassword extends React.Component<LoginPasswordProps, LoginPasswordState> {
  constructor(props: any) {
    super(props);
    this.state = {
      password: ""
    }
  }
  render() {
    return (
      <TextInput
        onChangeText={(text) => this.setState({ password: text})}
        secureTextEntry={true}
        placeholder={"Password"}
        style={styles.loginPassword}/>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  loginPassword: {
    fontSize: 20,
    color: Colors.white,
    backgroundColor: 'transparent',
  },
});

export default LoginPassword;
