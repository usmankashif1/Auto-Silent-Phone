import { NativeModules } from 'react-native';

const { DndModule } = NativeModules;

// These return real Promises (resolved by native code)
export const setSilentMode = () => DndModule.setSilentMode();
export const setNormalMode = () => DndModule.setNormalMode();
