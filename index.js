/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import notifee, { EventType } from '@notifee/react-native';
import { setNormalMode, setSilentMode } from './src/services/DndService';

// MUST return a Promise (async) so Android keeps the headless task alive
async function handleEvent({ type, detail }) {
  try {
    const kind = detail?.notification?.data?.kind;

    if (type === EventType.TRIGGER_NOTIFICATION_CREATED) {
      if (kind === 'start') await setSilentMode();
      if (kind === 'end')   await setNormalMode();
    }

    if (type === EventType.DELIVERED) {
      if (kind === 'start') await setSilentMode();
      if (kind === 'end')   await setNormalMode();
    }

    if (type === EventType.ACTION_PRESS && detail?.pressAction?.id === 'apply') {
      if (kind === 'start') await setSilentMode();
      if (kind === 'end')   await setNormalMode();
    }

    if (type === EventType.PRESS) {
      if (kind === 'start') await setSilentMode();
      if (kind === 'end')   await setNormalMode();
    }
  } catch (e) {
    console.warn('handleEvent error', e);
  }
}

notifee.onForegroundEvent(handleEvent);
notifee.onBackgroundEvent(handleEvent);

AppRegistry.registerComponent(appName, () => App);
