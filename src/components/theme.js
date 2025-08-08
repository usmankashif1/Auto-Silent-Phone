import {Dimensions} from 'react-native';
import responsive from './Res';
const {height, width} = Dimensions.get('window');

export const clr = {
  primary: '#F8F8F8',
  white: '#FFFFFF',
  Text1: '#000000',
  Text2: '#7F7F7F',
  Text3: '#d7d7d7',
  bttonBg: '#21292B',
  icon: '#767676',
  Tertiary: '#3B82F6',
};

export const SIZES = {
  // FONTS Sizes
  large: responsive.fontSize(22),
  h1: responsive.fontSize(20),
  h2: responsive.fontSize(18),
  h3: responsive.fontSize(16),
  h4: responsive.fontSize(12),

  // App Dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: SIZES.large,
    //lineHeight: 55,
  },
  h1: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: SIZES.h1, //lineHeight: 36
  },
  h2: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: SIZES.h2, //lineHeight: 30
  },
  h3: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: SIZES.h3, //lineHeight: 22
  },
  h4: {
    fontFamily: 'Roboto-Regular',
    fontSize: SIZES.h4, //lineHeight: 20
  },
};

const appTheme = {clr, SIZES, FONTS};

export default appTheme;
