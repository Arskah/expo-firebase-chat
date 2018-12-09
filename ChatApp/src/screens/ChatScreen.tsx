import React from "react";
import { View, Platform, Alert, BackHandler, Image, Text, Button} from "react-native";
import { Overlay, Card } from "react-native-elements";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { GiftedChat } from "react-native-gifted-chat";
import { chat_send, get_user, ChatMessage, UserChatMessage, get_new_key, fb_db, image_get_raw, update_expo_push_notification } from "../Fire";
import { image_upload_chat, get_old_chat_messages, update_message_info, chat_leave, get_chat_details } from "../Fire";
import firebase from "firebase";
import { ImagePicker, Permissions, ImageManipulator, Font } from "expo";
import ChatRenderAccessory from "../components/ChatRenderAccessory";
import LoadingIcon from "../components/LoadingIcon";
import CustomHeader from "../components/CustomHeader";
import Wallpaper from "../components/Wallpaper";

let loading_image = require("../assets/icons/loading.gif");

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
  title: string,
  uid: string,
  dbref: any,
  avatar: string,
  resolution: "full" | "high" | "low",
  loading: boolean,
  overlayVisible: boolean,
  selectedAvatar: string,
  selectedName: string,
}

export default class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  constructor(props: ChatScreenProps) {
    super(props);
    const chat_id = this.props.navigation.getParam("chat_id", undefined);
    const chat_title = this.props.navigation.getParam("chat_title", "");
    if (!chat_id) {
      this.props.navigation.navigate("ActiveChatsScreen");
    }
    this.state = {
      messages: [],
      displayName: undefined,
      user_id: undefined,
      chat_id: chat_id,
      title: chat_title,
      uid: undefined,
      dbref: firebase.database().ref("messages").child(chat_id),
      avatar: undefined,
      resolution: undefined,
      loading: true,
      overlayVisible: false,
      selectedAvatar: undefined,
      selectedName: undefined,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (!this.state.overlayVisible) {
        this.props.navigation.navigate("ActiveChatsScreen");
        return true;
      } else {
        this.setState({overlayVisible: false});
        return true;
      }
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
          uid: user.uid,
          avatar: response.val().picture,
          resolution: response.val().resolution,
        });

        // Load messages before starting the chat in order
        get_old_chat_messages(this.state.chat_id, response.val().resolution, user.uid)
        .then(messages => {
          if (messages) {
            let promises = messages.map(m => update_message_info(m, this.state.chat_id));
            Promise.all(promises).then(results => {
              this.setState({messages: results.filter(r => r).sort(this.sortByDate), loading: false});
            });
          }
        });

      // Load only messages that have come after the creation of start_key
        let start_key = get_new_key("messages");
        fb_db.ref.child("messages").child(this.state.chat_id).orderByKey().startAt(start_key).on("child_added", (child) => {
          /* tslint:disable:no-string-literal */
          if (child && child.val()) {
            let message_container = [];
            let new_message = child.val();
            if (new_message.system || new_message.user._id !== user.uid) {
              update_message_info(new_message, this.state.chat_id)
              .then(updated_message => {
                console.log(updated_message);
                //@ts-ignore
                if (updated_message.image) {
                  //@ts-ignore
                  image_get_raw(updated_message.image, this.state.resolution)
                  .then(image => {
                    console.log(image);
                    //@ts-ignore
                    updated_message.image = image;
                    message_container.push(new_message);
                    this.setState(previousState => ({
                      messages: GiftedChat.append(previousState.messages, message_container).sort(this.sortByDate),
                    }));
                  });
                } else {
                  message_container.push(new_message);
                  this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, message_container).sort(this.sortByDate),
                  }));
                }

              });
            }
          }
        });
      });

    } else {
      this.props.navigation.navigate("LandingScreen");
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
          manipResult = await ImageManipulator.manipulate(uri, [{ resize: { width: HIGH_WIDTH } }]);
        } else {
          manipResult = await ImageManipulator.manipulate(uri, [{ resize: { height: HIGH_HEIGHT } }]);
        }
        return manipResult.uri;
      } else {
        return uri;
      }
    } else {
      if (orig_width > LOW_WIDTH || orig_height > LOW_HEIGHT) {
        let manipResult;
        if (orig_width / LOW_WIDTH >= orig_height / LOW_HEIGHT) {
          manipResult = await ImageManipulator.manipulate(uri, [{ resize: { width: LOW_WIDTH } }]);
        } else {
          manipResult = await ImageManipulator.manipulate(uri, [{ resize: { height: LOW_HEIGHT } }]);
        }
        return manipResult.uri;
      } else {
        return uri;
      }
    }
  }

  /* tslint:disable:no-shadowed-variable */
  pickFromCamera = async () => {
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

          let messageLocal: ChatMessage = {
            _id: new_key,
            createdAt: new Date(),
            user: user,
            image: resized_uri,
          };
          let messages = [];
          messages.push(messageLocal);
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
          }));

          const url = await image_upload_chat(this.state.chat_id, resized_uri, this.state.resolution);

          let messageServer: ChatMessage = {
            _id: new_key,
            createdAt: new Date(),
            user: user,
            image: url,
          };

          chat_send(this.state.chat_id, messageServer)
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

      let messageLocal: ChatMessage = {
        _id: new_key,
        createdAt: new Date(),
        user: user,
        image: resized_uri,
      };
      let messages = [];
      messages.push(messageLocal);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }));

      const url = await image_upload_chat(this.state.chat_id, resized_uri, this.state.resolution);

      let messageServer: ChatMessage = {
        _id: new_key,
        createdAt: new Date(),
        user: user,
        image: url,
      };

      chat_send(this.state.chat_id, messageServer)
        .catch(error => console.log(error));
    }
  }

  renderSystemMessage = (message) => {
    return;
  }

  leaveChat = () => {
    chat_leave(this.state.chat_id, this.state.uid, this.state.displayName);
    this.props.navigation.navigate("ActiveChatsScreen");
  }

  render() {
    if (!this.state.loading) {
      return (
        <Wallpaper>
        <View style={{flex: 1}}>
        <CustomHeader text={this.state.title} navigation={this.props.navigation} />
        <Overlay
          isVisible={this.state.overlayVisible}
          width="auto"
          height="auto"
          >
          <Card
          title={this.state.selectedName}
          titleStyle={{fontSize: 20, color: "#000"}}
          image={{uri: this.state.selectedAvatar}}
          imageStyle={{width: 150}}
          />
        </Overlay>

          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.user_id,
              name: this.state.displayName,
              avatar: this.state.avatar,
            }}
            renderAccessory={() =>
              <ChatRenderAccessory
                onImageCamera={this.pickFromCamera}
                onImageGallery={this.pickFromGallery}
                chat_id={this.state.chat_id}
                onLeave={this.leaveChat}
                />}
            showUserAvatar = {true}
            imageStyle={undefined}
            onPressAvatar={(user) => {
              this.setState({
                selectedAvatar: user.avatar,
                selectedName: user.name,
                overlayVisible: true,
              });
            }}
          />
          {Platform.OS === "android" ? <KeyboardSpacer /> : undefined}
        </View>
        </Wallpaper>
      );
    } else {
      return(<LoadingIcon image={loading_image}></LoadingIcon>);
    }
  }
}
