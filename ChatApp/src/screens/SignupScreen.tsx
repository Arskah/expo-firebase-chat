import React, { Component } from 'react';
import WallPaper from '../components/Login/Wallpaper';
import Logo from '../components/Login/Logo';
import FormSignup from '../components/Login/FormSignup';
import ButtonSignup from '../components/Login/ButtonSignup';

export default class SignupScreen extends Component {
	render() {
		return (
      <WallPaper>
        <Logo />
        <FormSignup />
        <ButtonSignup />
      </WallPaper>
	  );
  }
}
