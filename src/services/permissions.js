import { Platform } from 'react-native';
import notifee from '@notifee/react-native';

export async function ensureNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const settings = await notifee.getNotificationSettings();
    if (settings.authorizationStatus === notifee.AuthorizationStatus.DENIED) {
      await notifee.requestPermission();
    }
  }
}
