import React, { Component } from 'react';
import Wallpaper from '../components/Wallpaper';
import SignupForm from '../components/SignupForm'

export default class SignupScreen extends Component {
	render() {
		return (
      <Wallpaper>
        <SignupForm />
      </Wallpaper>
	  );
  }
}
