import firebase, { User } from "firebase";
import { Alert } from "react-native";
import { ENV } from "../environment";
import { FileSystem } from "expo";

/*
  - /chats/
    - chat_id
      - title
      - lastMessage
  - /users/
    - user_id
      - displayName
      - email
      - resolution
      - picture
  - /members/
    - chat_id
      - displayName1: false
      - dispalyName2: true
      - ... (TODO: decide what is the best way to handle users) displayNames are unique, but still...
  - /messages/
    - chat_id
      - message_id
        - author (displayName)
        - message
*/

let fb_app: firebase.app.App;
let fb_db: firebase.database.Reference;

const defaultPicture = "https://firebasestorage.googleapis.com/v0/b/mcc-fall-2018-g13.appspot.com/o/robot-prod.png?alt=media&token=1088c6f3-b0e8-4fde-845e-a77095c33f15";
const defaultResolution = "full";

export const init = () => {
  const config = {
    apiKey: ENV.APIKEY,
    authDomain: ENV.AUTH_DOMAIN,
    databaseURL: ENV.DB_URL,
    projectId: ENV.PID,
    storageBucket: ENV.SBUCKET,
    messagingSenderId: ENV.SEND_ID,
  };
  fb_app = firebase.initializeApp(config);
  fb_db = firebase.database().ref();
};

// Create new chatroom
export const chat_create = (name: string, username: string) => {
  let postData = {
    title: name,
    lastMessage: "",
  };
  let new_key = fb_db.ref.child("chats").push().key;
  let updates = {};
  // Add
  updates[`/chats/${new_key}/`] = postData;
  updates[`/members/${new_key}/${username}`] = true;
  return fb_db.ref.update(updates);
};

// Add new user to chatroom
export const chat_adduser = (chat_id: string, user_id: string, adder_id: string) => {
  let new_key = fb_db.ref.child("messages").push().key;
  let updates = {};
  let message = `User ${user_id} was added by ${adder_id}`;
  updates[`/members/${chat_id}/${user_id}`] = true;
  updates[`/chats/${chat_id}/lastMessage/`] = message;
  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates);
};

// Send a message in chat
// reference images with some funky syntax
export const chat_send = (chat_id: string, message: string, author: string) => {
  let postData = {
    author: author,
    message: message,
  };
  let new_key = fb_db.ref.child("messages").push().key;
  let updates = {};
  updates[`/chats/${chat_id}/lastMessage/`] = `${author}: ${message}`;
  updates[`/messages/${chat_id}/${new_key}/`] = postData;
  return fb_db.ref.update(updates);
};

// Leave chatroom
export const chat_leave = (chat_id: string, user_id: string) => {
  let new_key = fb_db.ref.child("messages").push().key;
  let message = `User ${user_id} left`;
  let updates = {};
  updates[`/members/${chat_id}/${user_id}`] = false;
  updates[`/chats/${chat_id}/lastMessage/`] = message;
  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates);
};

export const get_chat_message = (chat_id: string) => {
  return;
};

// retrieve list of images on given chat
export const chat_images = (chat_id: string, sort?: string) => {
  return;
};

// get image with given resolution
export const image_get_raw = (image_url: string, resolution: string) => {
  return;
};

// same as above but with settings mandated resolution
export const image_get = (image_url: string) => {
  return;
};

// upload image to firebase => get image url
export const image_upload = async (image_path: string, folder: string, name: string) => {

  const blob = await urlToBlob(image_path);
  const ref = firebase.storage().ref(folder).child(name);
  const result = await ref.put(blob);
  return result.ref.getDownloadURL();

};

export const image_upload_chat = (chat_id: string, image_path: string) => {
  return;
};

export const image_upload_profile = async (user_id: string, image_path: string) => {
  const result = await image_upload(image_path, "profile_pictures", user_id);
  return result;
};

function urlToBlob(url: string) {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
              resolve(xhr.response);
          }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
  });
}

// params are the mandatory info, not sure yet
export const user_create = (username: string, email: string, password: string) => {
  get_user_by_name(username).then((user_profile) => {
    // Check if username is free
    if (!user_profile) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert(errorMessage);
        })
        .then((user) => {
          update_user(username);
          console.log(user);
          if (user) {
            // Create userprofile on authentication success
            let postData = {
              displayName: username,
              email: email,
              resolution: defaultResolution,
              picture: defaultPicture,
            };
            // Also set user membership in all chats as false
            let new_key = fb_db.ref.child("users").push().key;
            let updates = {};
            updates[`/users/${new_key}`] = postData;
            // TODO: Not sure if .on() is the correct method...
            // If we see missing chatrooms after new chat room creation this may be the issue
            fb_db.ref.child("chats").on("value", (snapshot) => {
              updates["members/" + snapshot.key + `/${username}`] = false;
            });
            fb_db.ref.update(updates);
          }
        });
    } else {
      Alert.alert("Username is already in use!");
    }
  });
};

export const update_user = (displayName: string) => {
  let user = firebase.auth().currentUser;
  user.updateProfile({
    displayName: displayName,
    photoURL: undefined,
  }).then(function() {
    console.log("Updated displayname successfully");
  }).catch(function(error) {
    console.log(error);
  });
};

export const user_state_change = (callback) => {
  firebase.auth().onAuthStateChanged(callback);
};

interface UserProfile {
  displayName: string;
  email: string;
  resolution: string;
  picture: string;
}

export const user_login = (username: string, passwd: string) => {
  const user_promise = get_user_by_name(username).then((user_profile: UserProfile) => {
    if (user_profile) {
      user_login_email(user_profile.email, passwd);
    }
  });
};

export const user_login_email = (email: string, passwd: string) => {
  firebase.auth().signInWithEmailAndPassword(email, passwd)
    .catch((error) => {
      // var errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert(errorMessage);
    });
};

export const get_user_by_name = async (username: string) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref().child("users").orderByChild("displayName")
      .equalTo(username).on("value", (snapshot) => {
        snapshot.forEach((data) => {
          resolve(data.val());
        });
        resolve(undefined);
    });
  });
};

export const get_user_by_name2 = async (username: string) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref().child("users").orderByChild("displayName")
      .equalTo(username).on("value", (snapshot) => {
        snapshot.forEach((data) => {
          resolve(data);
        });
        resolve(undefined);
    });
  });
};

export const get_user_by_email = (email) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref().child("users").orderByChild("email")
      .equalTo(email).on("value", (snapshot) => {
        snapshot.forEach((data) => {
          resolve(data);
        });
    });
  });
};

// results
export const user_search = async (search_term: string) => {
  return;
};

// value
export const settings_get = (key: string) => {
  return;
};

// value
export const settings_set = (key: string, value: UserProfile) => {
  let updates = {};
  updates[`/users/${key}`] = value;
  fb_db.ref.update(updates);
};

export const profile_picture_set = () => {
  return;
};

// SETTINGS_KEYS
// -------------
// DISPLAY_NAME
// RESOLUTION
