import * as functions from 'firebase-functions';
import { database, initializeApp } from 'firebase-admin';
import axios from 'axios';
import {tmpdir} from 'os';
import {join, dirname, basename} from 'path';
import * as sharp from "sharp";
import * as fs from "fs-extra";

const {Storage} = require("@google-cloud/storage");
const gcs = new Storage();

const HIGH_WIDTH = 1280;
const HIGH_HEIGHT = 960;
const LOW_WIDTH = 640;
const LOW_HEIGHT = 480;

initializeApp();

const GC_URL = "https://vision.googleapis.com/v1/images:annotate";
const GC_API_QUERY = `?key=${functions.config().gc.key}`;
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

const send_push = (title: string, message: string, data: Object, tokens: string[]) => {
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

const get_chat = (chat_id: string) => {
  return database().ref(`chats/${chat_id}`).orderByKey().once("value");
}

const get_chat_members = (chat_id: string) => {
  return database().ref(`members/${chat_id}`).orderByChild("member").equalTo(true).once("value");
}

const get_push_keys_of_user = (key: string) => {
  return database().ref(`/push_keys/${key}`).orderByKey().once("value");
}

const send_push_notification = async (text: string, sender_id: string, chat_id: string) => {
  // Get chat title
  const chat = await get_chat(chat_id);
  const chat_name: string = chat.val().title;
  // Get tokens for the push notification
  const chat_members = await get_chat_members(chat_id);
  const tokens: Promise<any>[] = [];
  chat_members.forEach((member: database.DataSnapshot) => {
    if (member.key !== sender_id) {
      tokens.push(get_push_keys_of_user(member.key));
    };
    return false;
    });

  Promise.all(tokens).then((resolved_tokens: database.DataSnapshot[]) => {
    const token_strings: string[] = [];
    for (let i = 0; i < resolved_tokens.length; i++) {
      const obj = resolved_tokens[i].val();
      if (obj) {
        for (const key of Object.keys(obj)) {
          token_strings.push(obj[key].token);
        }
      }
    }
    send_push(chat_name, text, {}, token_strings);
  }).catch((err) => console.error(err));
}

exports.newMessage = functions.database.ref('messages/{chat_id}/{message_id}')
  .onCreate((snapshot, context) => {
    // Get an object representing the document
    const message = snapshot.val();
    // We have either text or images, so...
    const text = message.text ? message.text : "New image";
    const sender_id = message.system ? undefined : message.user.auth_id;
    send_push_notification(text, sender_id, context.params.chat_id)
      .catch((err) => console.error(err));
    return true;
});

exports.newChatImage = functions.storage.object().onFinalize( async object => {

  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const fileName = basename(filePath);
  const bucketDir = dirname(filePath);

  if(fileName === "low") {
    console.log("Already created low");
    return;
  } else if (fileName === "LOW") {
    console.log("Already created LOW");
    return;
  } else if (fileName === "HIGH") {
    console.log("Already created HIGH");
    return;
  }

  console.log("This shouldn't be low, LOW or HIGH: ",fileName);

  if(!object.contentType.includes("image")) {
    console.log("exiting because not an image");
    return;
  }

  const workingDir = join(tmpdir(),'images');
  const tmpFilePath = join(workingDir, basename(bucketDir));

  await fs.ensureDir(workingDir);

  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  let sizes = [{width:LOW_WIDTH, height:LOW_HEIGHT, name: "LOW"},{width:HIGH_WIDTH, height:HIGH_HEIGHT, name: "HIGH"}];
  if(fileName === "high"){
    sizes = [{width:LOW_WIDTH, height:LOW_HEIGHT, name: "LOW"}];
  }

  const uploadPromises = sizes.map(async size => {

    const resizedName = size.name;
    const resizedPath = join(workingDir, resizedName);
    
    await sharp(tmpFilePath)
      .resize(size.width, size.height,{
        fit: 'inside',
      })
      .toFile(resizedPath);

    return bucket.upload(resizedPath, {
      destination: join(bucketDir, resizedName),
      metadata: {
        contentType: object.contentType,
      }
    });
  });

  await Promise.all(uploadPromises);
  fs.remove(workingDir)
  .then(() => {
    console.log("Removed succesfully");
    return;
  })


});

exports.NewImageLabel = functions.storage.object().onFinalize(async object => {

  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const fileName = basename(filePath);
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), 'images');
  const tmpFilePath = join(workingDir, basename(bucketDir));

  await fs.ensureDir(workingDir);

  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  // Read the file into memory.
  const imageFile = fs.readFileSync(tmpFilePath);
  // Convert the image data to a Buffer and base64 encode it.
  // We basically send a cloud function local copy of the file for ML.
  const encoded = Buffer.from(imageFile).toString('base64');

  const response = await axios.post(GC_URL + GC_API_QUERY, 
    {
      requests: [
        {
          image: {
            content: `${encoded}`,
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 1,
            }
          ]
        }
      ]
    }
  );
  const label = response.data.responses[0];
  console.info(label);

  if (label.labelAnnotations && label.labelAnnotations[0]) {
    const updates = {};
    updates[`/image_labels/${encodeURIComponent(filePath)}`] = label.labelAnnotations[0];
    return database().ref().update(updates);
  } else {
    // Error
    console.error("Failed to get response for file")
  }
  fs.remove(workingDir)
    .then(() => {
      console.log("Removed succesfully");
    });
});
