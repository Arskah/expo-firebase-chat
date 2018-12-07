import * as functions from 'firebase-functions';
import { database, initializeApp } from 'firebase-admin';
import axios from 'axios';

initializeApp();

const ExpoURL = "https://expo.io/--/api/v2/push/send";
type PushMessage = {
  /**
   * An Expo push token specifying the recipient of this message.
   */
  to: string,
  /**
   * A JSON object delivered to your app. It may be up to about 4KiB; the total
   * notification payload sent to Apple and Google must be at most 4KiB or else
   * you will get a "Message Too Big" error.
   */
  data?: Object,
  /**
   * The title to display in the notification. Devices often display this in
   * bold above the notification body. Only the title might be displayed on
   * devices with smaller screens like Apple Watch.
   */
  title?: string,
  /**
   * The message to display in the notification
   */
  body?: string,
  /**
   * Time to Live: the number of seconds for which the message may be kept
   * around for redelivery if it hasn't been delivered yet. Defaults to 0.
   *
   * On Android, we make a best effort to deliver messages with zero TTL
   * immediately and do not throttle them
   *
   * This field takes precedence over `expiration` when both are specified.
   */
  ttl?: number,
  /**
   * A timestamp since the UNIX epoch specifying when the message expires. This
   * has the same effect as the `ttl` field and is just an absolute timestamp
   * instead of a relative time.
   */
  expiration?: number,

  /**
   * The delivery priority of the message. Specify "default" or omit this field
   * to use the default priority on each platform, which is "normal" on Android
   * and "high" on iOS.
   *
   * On Android, normal-priority messages won't open network connections on
   * sleeping devices and their delivery may be delayed to conserve the battery.
   * High-priority messages are delivered immediately if possible and may wake
   * sleeping devices to open network connections, consuming energy.
   *
   * On iOS, normal-priority messages are sent at a time that takes into account
   * power considerations for the device, and may be grouped and delivered in
   * bursts. They are throttled and may not be delivered by Apple. High-priority
   * messages are sent immediately. Normal priority corresponds to APNs priority
   * level 5 and high priority to 10.
   */
  priority?: 'default' | 'normal' | 'high',
  // iOS-specific fields
  /**
   * A sound to play when the recipient receives this notification. Specify
   * "default" to play the device's default notification sound, or omit this
   * field to play no sound.
   *
   * Note that on apps that target Android 8.0+ (if using `expo build`, built
   * in June 2018 or later), this setting will have no effect on Android.
   * Instead, use `channelId` and a channel with the desired setting.
   */
  sound?: 'default' | null,
  /**
   * Number to display in the badge on the app icon. Specify zero to clear the
   * badge.
   */
  badge?: number,
  // Android-specific fields
  /**
   * ID of the Notification Channel through which to display this notification
   * on Android devices. If an ID is specified but the corresponding channel
   * does not exist on the device (i.e. has not yet been created by your app),
   * the notification will not be displayed to the user.
   *
   * If left null, a "Default" channel will be used, and Expo will create the
   * channel on the device if it does not yet exist. However, use caution, as
   * the "Default" channel is user-facing and you may not be able to fully
   * delete it.
   */
  channelId?: string
}

export const send_push = (title: string, message: string, data: Object, tokens: string[]) => {
  tokens.forEach(token => {
    const push: PushMessage = {
      to: token,
      title: title,
      body: message,
      data: data,
    }
    console.info(push);
    axios.post(ExpoURL, push);
  });
}

export const get_chat = async (chat_id: string) => {
  return new Promise<database.DataSnapshot>((resolve, reject) => {
    database().ref(`chats/${chat_id}`).orderByKey().on("value", (snapshot) => {
      resolve(snapshot);
    })
  });
}

export const get_chat_members = async (chat_id: string) => {
  return new Promise<database.DataSnapshot>((resolve, reject) => {
    database().ref(`members/${chat_id}`).orderByKey().on("value", (snapshot) => {
      resolve(snapshot);
    });
  });
}

export const get_chat_push_tokens = (chat_id: string) => {
  return new Promise<Array<string>>((resolve, reject) => {
    get_chat_members(chat_id)
    .then((members: database.DataSnapshot) => {
      const tokens: string[] = [];
      members.forEach((data) => {
        database().ref(`push_keys/${data.key}`).on("value", (snapshot_tokens: database.DataSnapshot) => {
          snapshot_tokens.forEach((data_push) => {
            console.info(data_push.val().token);
            tokens.push(data_push.val().token);
            // Next line is just to please Typescript
            return false;
          });
          resolve(tokens);
        });
      // Next line is just to please Typescript
      return false;
      });
    })
    .catch((err) => {
      reject(err);
    });
  });
};

exports.newMessage = functions.database.ref('messages/{chat_id}/{message_id}')
.onCreate((snapshot, context) => {
  // Get an object representing the document
  const message = snapshot.val();
  // We have either text or images, so...
  const text = message.text ? message.text: "New image";
  // const sender_id = message.user._id;
  get_chat(context.params.chat_id).then((chat: database.DataSnapshot) => {
    const chat_name = chat.val().title;
    get_chat_push_tokens(context.params.chat_id).then((tokens: string[]) => {
      console.info(tokens);
      send_push(chat_name, text, {}, tokens);
    })
    .catch((err) => {
      console.error("Error in get_chat_push_tokens");
      console.error(err);
    });
  })
  .catch(err => {
    console.error(err);
  })
  return true;
});
