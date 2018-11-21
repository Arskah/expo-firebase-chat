import React, {Component} from 'react';
// import Logo from '../components/Login/Logo';
// import FormLogin from '../components/Login/FormLogin';
import Wallpaper from '../components/Login/Wallpaper';
// import ButtonLogin from '../components/Login/ButtonLogin';
import SignupSection from '../components/Login/SignupSection';

export default class LoginScreen extends Component {
  render() {
    return (
      <Wallpaper>
			  {/* <Logo /> */}
			  {/* <FormLogin /> */}
			  {/* <ButtonLogin /> */}
        <SignupSection />
      </Wallpaper>
    );
  }
}
