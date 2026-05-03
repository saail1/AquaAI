import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleWaterReminder = async (intervalMinutes = 60) => {
  // Pehle sab purane reminders cancel karo
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestPermissions();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 Time to Hydrate!',
      body: 'Your body needs water — take a sip now!',
      sound: true,
    },
    trigger: {
      seconds: intervalMinutes * 60,
      repeats: true,
    },
  });

  return true;
};

export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};