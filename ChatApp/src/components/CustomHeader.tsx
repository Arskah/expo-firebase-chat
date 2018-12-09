import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import {Header} from "react-native-elements";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import {Font} from "expo";
import HeaderHome from "../components/HeaderHome";

export interface CustomHeaderProps {
  text: string,
  navigation: any,
}
export interface CustomHeaderState {
  fonts: boolean,
}

class CustomHeader extends React.Component<CustomHeaderProps, CustomHeaderState> {
  constructor(props: CustomHeaderProps) {
    super(props);
    this.state = {
      fonts: false,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')}) 
    this.setState({ fonts: true })
  }

  handleHomePress = () => {
    this.props.navigation.navigate("ActiveChatsScreen");
  }

  render() {
    if (this.state.fonts) {
      return (
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: this.props.text, style: { color: '#fff' } }}
          rightComponent={<HeaderHome handlePress={this.handleHomePress}/>}
        />
      );
    } else {
      return(
        <View></View>
      )
    }
  }
}

const DEVICE_WIDTH = Layout.window.width;
const DEVICE_HEIGHT = Layout.window.height;

const styles = StyleSheet.create({
  customHeader: {
  },
});

export default CustomHeader;
