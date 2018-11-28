import React, { Component } from 'react';
import {BackHandler} from 'react-native';
import Wallpaper from '../components/Wallpaper';
import SignupForm from '../components/SignupForm';

export interface SignupScreenProps {
  navigation: any
}
export interface SignupScreenState { }
export default class SignupScreen extends Component<SignupScreenProps, SignupScreenState> {
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('LoginScreen');
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

	render() {
		return (
      <Wallpaper>
        <SignupForm />
      </Wallpaper>
	  );
  }
}
