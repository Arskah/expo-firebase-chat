import * as React from "react";
import { TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import { Fragment } from "react";

const onPressLogin = (username: string, password: string) => {
  alert(username);
}

export interface LoginFormProps {}
export interface LoginFormState {
  username: string;
  password: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
    }
  }

  handleOnPress = () => {
    onPressLogin(this.state.username, this.state.password);
  }

  render() {
    return (
      <Fragment>
        <TextInput
          onChangeText={(text) => this.setState({ username: text })}
          style={styles.loginUsername}
          autoFocus={true}
          placeholder={"Username"} />
        <TextInput
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry={true}
          placeholder={"Password"}
          style={styles.loginPassword} />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={this.handleOnPress}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </Fragment>
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
  loginPassword: {
    fontSize: 20,
    color: Colors.white,
    backgroundColor: 'transparent',
  },
  loginButton: {
    backgroundColor: Colors.darkBlue,
    padding: 20,
  },
  loginText: {
    color: Colors.white,
    textAlign: 'center',
  }
});

export default LoginForm;
