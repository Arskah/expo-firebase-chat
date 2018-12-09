import React, { Fragment } from "react";
import { View, Text, StyleSheet, BackHandler, Image } from "react-native";
import { ChatMessage, GalleryImage, chat_images, get_user_by_email, image_get_raw, get_gallery_images_recent } from "../Fire";
import firebase from "firebase";

export interface GalleryScreenProps {
  navigation: any;
}
export interface GalleryScreenState {
  images: ChatMessage[];
  resolution: "full" | "high" | "low",
  sort: "recent" | "label" | "author",
}

export default class GalleryScreen extends React.Component<GalleryScreenProps, GalleryScreenState> {
  chat_id: string;
  constructor(props: GalleryScreenProps) {
    super(props);
    const chat_id = this.props.navigation.getParam("chat_id", undefined);
    this.chat_id = chat_id;
    this.state = {
      images: [],
      resolution: undefined,
      sort: "recent",
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ChatScreen", {chat_id: this.chat_id});
      return true;
    });
    if (firebase.auth()) {
      const user = firebase.auth().currentUser;
      get_user_by_email(user.email)
        .then((response: firebase.database.DataSnapshot) => {
          return response.val().resolution;
        })
        .then((resolution) => {
          get_gallery_images(this.chat_id, resolution)
          .then((images) => {
            this.setState({
              resolution: resolution,
              images: images,
            });
          });
        })
        .catch((err) => console.error(err));
      } else {
      this.props.navigation.navigate("LoginScreen");
    }
  }

  componentDidUnMount() {
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  render() {
    const { images, resolution, sort } = this.state;
    const image_paths = images.map(message => {
      image_get_raw(message.image, resolution);
    });
    return (
      <View style={styles.container}>
      {images.map((message: ChatMessage) => (
        <Fragment>
          <Image source={message.image} />
          <Text>{message.user.name}</Text>
        </Fragment>
      ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
