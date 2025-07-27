import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleReminder(
  title: string,
  body: string,
  triggerTime: Date
): Promise<boolean> {
  if (triggerTime <= new Date()) {
    return false;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("We need your permission to send you notifications");
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerTime,
    },
  });
  return true;
}
