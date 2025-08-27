/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import notifee, { EventType } from '@notifee/react-native';
import { setNormalMode, setSilentMode } from './src/services/DndService';

async function handleEvent({ type, detail }) {
  try {
    const kind = detail?.notification?.data?.kind;

    if (!kind) return;

    if (
      type === EventType.TRIGGER_NOTIFICATION_CREATED ||
      type === EventType.DELIVERED
    ) {
      if (kind === 'start') await setSilentMode();
      if (kind === 'end') await setNormalMode();
    }
  } catch (e) {
    console.warn('handleEvent error', e);
  }
}

notifee.onForegroundEvent(handleEvent);
notifee.onBackgroundEvent(handleEvent);

AppRegistry.registerComponent(appName, () => App);
