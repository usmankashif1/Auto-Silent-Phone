import { NativeModules, Platform } from 'react-native';

export const startDndService = () => {
  if (Platform.OS === 'android') {
    NativeModules.DndModule.startForegroundService();
  }
};
