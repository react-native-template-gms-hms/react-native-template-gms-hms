/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

import { localStorage } from '@app/db/database';
import { Notification } from '@app/db/models';

export const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (message) => {
    console.log('[FCM] Received background message', JSON.stringify(message, null, 2));
    await Notification.add('background', JSON.stringify(message));
    await displayNotification(message.notification?.title ?? '', JSON.stringify(message.data, null, 2));
  });

  notifee.onBackgroundEvent(() => {
    return Promise.resolve();
  });
};

export const setForegroundMessageHandler = () => {
  return messaging().onMessage(async (message) => {
    console.log('[FCM] Received foreground message', JSON.stringify(message, null, 2));
    await Notification.add('foreground', JSON.stringify(message));
  });
};

const getToken = async () => {
  let fcmToken = await localStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await attemptToGetToken();

    if (fcmToken) {
      await localStorage.setItem('fcmToken', fcmToken);
    }
  }
  return fcmToken;
};

const attemptToGetToken = async () =>
  await messaging()
    .requestPermission()
    .then(() => messaging().getToken())
    .catch(() => null);

const displayNotification = async (title: string, body: string) => {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'background-channel',
    name: 'Background Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    vibration: true,
  });

  // Display a notification
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },

      //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    },
  });
};

export const remoteMessaging = {
  getToken,
  displayNotification,
};

export default messaging;
