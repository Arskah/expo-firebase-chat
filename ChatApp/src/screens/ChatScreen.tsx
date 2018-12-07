import React, { Children } from "react";
import { ImageStyle, View, Platform, Text, Button, Alert, BackHandler} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";
import { chat_send, get_user, ChatMessage, UserChatMessage, get_new_key } from "../Fire";
import { image_upload_chat, get_old_chat_messages, get_new_chat_messages } from "../Fire";
import firebase from "firebase";
import Dialog from "react-native-dialog";
import { ImagePicker, Permissions, ImageManipulator } from "expo";

const HIGH_WIDTH = 1280;
const HIGH_HEIGHT = 960;
const LOW_WIDTH = 640;
const LOW_HEIGHT = 480;

export interface ChatScreenProps {
  navigation: any
}

export interface ChatScreenState {
  messages: any,
  displayName: string,
  user_id: string,
  chat_id: string,
  dbref: any,
  visible: boolean,
  avatar: string,
  resolution: "full" | "high" | "low",
}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props: any) {
    super(props);
    const chat_id = this.props.navigation.getParam("chat_id", undefined);
    if (!chat_id) {
      this.props.navigation.navigate("ActiveChatsScreen");
    }
    this.state = {
      messages: [],
      displayName: undefined,
      user_id: undefined,
      chat_id: chat_id,
      dbref: firebase.database().ref("messages").child(chat_id),
      visible: false,
      avatar: undefined,
      resolution: undefined,
    };
  }

  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("ActiveChatsScreen");
      return true;
    });

    if (firebase.auth()) {

      const user = firebase.auth().currentUser;
      let value = user.displayName;
      let method: "displayName" | "email" = "displayName";
      if (!user.displayName) {
        value = user.email;
        method = "email";
      }
      const userPromise = get_user(value, method)
      .then((response: firebase.database.DataSnapshot) => {
        this.setState({
          displayName: response.val().displayName,
          user_id: response.key,
          avatar: response.val().picture,
          resolution: response.val().resolution,
        });
      
        // Load messages before starting the chat in order
        get_old_chat_messages(this.state.chat_id, response.val().resolution)
        .then(messages => {
          if (messages) {
            this.setState({messages: messages.sort(this.sortByDate)});
          }
        });

      // Load only messages that have come after the creation of start_key
        get_new_chat_messages(this.state.chat_id, response.val().resolution)
        .then(new_messages => {
          if (this.state.messages.findIndex(m => m._id === new_messages[0]._id) === -1) {
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, new_messages).sort(this.sortByDate),
            }));
          }
        });
      });

    } else {
      this.props.navigation.navigate("LoginScreen");
    }
  }

  componentDidUnMount() {
    this.state.dbref.off("child_added");
    BackHandler.removeEventListener("hardwareBackPress", () => { return; });
  }

  sortByDate = (a, b) => {
    let date1 = new Date(a.createdAt).getTime();
    let date2 = new Date(b.createdAt).getTime();
    return date1 < date2 ? 1 : (date2 < date1 ? -1 : 0);
  }

  onSend(messages = []) {
    let msg = messages[0];
    if (msg) {
      msg._id = get_new_key("messages");
      chat_send(this.state.chat_id, msg);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, msg),
      }));
    }
  }

  image_resize = async (uri: string, orig_width: number, orig_height: number) => {

    if (this.state.resolution === "full") {
      console.log("Didn't resize because resolution was full");
      return uri;
    } else if (this.state.resolution === "high") {
        if (orig_width > HIGH_WIDTH || orig_height > HIGH_HEIGHT) {
          let manipResult;
          if (orig_width / HIGH_WIDTH >= orig_height / HIGH_HEIGHT) {
            manipResult = await ImageManipulator.manipulate(uri, [{resize: {width: HIGH_WIDTH}}]);
          } else {
            manipResult = await ImageManipulator.manipulate(uri, [{resize: {height: HIGH_HEIGHT}}]);
          }
          return manipResult.uri;
        } else {
          return uri;
        }
    } else {
      if (orig_width > LOW_WIDTH || orig_height > LOW_HEIGHT) {
        let manipResult;
        if (orig_width / LOW_WIDTH >= orig_height / LOW_HEIGHT) {
          manipResult = await ImageManipulator.manipulate(uri, [{resize: {width: LOW_WIDTH}}]);
        } else {
          manipResult = await ImageManipulator.manipulate(uri, [{resize: {height: LOW_HEIGHT}}]);
        }
        return manipResult.uri;
      } else {
        return uri;
      }
    }
  }
  /* tslint:disable:no-shadowed-variable */
  pickFromCamera = async () => {
    this.setState({ visible: false});
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === "granted") {
        /* tslint:enable:no-shadowed-variable */
        let result = await ImagePicker.launchCameraAsync(
          {
            allowsEditing: true,
          },
        );
        if (result.cancelled !== true) {

          const resized_uri = await this.image_resize(result.uri, result.width, result.height);
          let new_key = get_new_key("messages");
          let user: UserChatMessage = {
            _id: this.state.user_id,
            auth_id: firebase.auth().currentUser.uid,
            name: this.state.displayName,
            avatar: this.state.avatar,
          };

          let message: ChatMessage = {
            _id: new_key,
            createdAt: new Date(),
            user: user,
            image: resized_uri,
          };
          let messages = [];
          messages.push(message);
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
          }));

          const url = await image_upload_chat(this.state.chat_id, resized_uri, this.state.resolution);

          message.image = url;

          chat_send(this.state.chat_id, message)
          .catch(error => console.log(error));
        }
      } else {
        Alert.alert("You can't take pictures without CAMERA permissions");
      }
    } else {
      Alert.alert("You can't take pictures without CAMERA_ROLL permissions");
    }
  }

  pickFromGallery = async () => {
    this.setState({ visible: false});
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (result.cancelled !== true) {

      const resized_uri = await this.image_resize(result.uri, result.width, result.height);
      let new_key = get_new_key("messages");
      let user: UserChatMessage = {
        _id: this.state.user_id,
        auth_id: firebase.auth().currentUser.uid,
        name: this.state.displayName,
        avatar: this.state.avatar,
      };

      let message: ChatMessage = {
        _id: new_key,
        createdAt: new Date(),
        user: user,
        image: resized_uri,
      };
      let messages = [];
      messages.push(message);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }));

      const url = await image_upload_chat(this.state.chat_id, resized_uri, this.state.resolution);

      message.image = url;

      chat_send(this.state.chat_id, message)
      .catch(error => console.log(error));
    }
  }

  showDialog = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  renderSystemMessage = (message) => {
    return;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user_id,
            auth_id: firebase.auth().currentUser.uid,
            name: this.state.displayName,
          }}
          renderAccessory={() => <Button title={"Add a picture"} onPress={this.showDialog}></Button>}
          showUserAvatar = {true}
          imageStyle={undefined}
          // renderSystemMessage={this.renderSystemMessage}
        />
        <Dialog.Container visible={this.state.visible}>
          <Dialog.Title>Pick a picture from</Dialog.Title>
          <Dialog.Button label="Gallery" onPress={this.pickFromGallery} />
          <Dialog.Button label="Camera" onPress={this.pickFromCamera} />
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        </Dialog.Container>
        {Platform.OS === "android" ? <KeyboardSpacer /> : undefined }
      </View>
    );
  }
}
