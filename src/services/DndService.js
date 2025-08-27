import { NativeModules } from 'react-native';

const { DndModule } = NativeModules;

export const setSilentMode = () => DndModule.setSilentMode();
export const setNormalMode = () => DndModule.setNormalMode();
