import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 375; 
const BASE_HEIGHT = 812;

const scaleSize = size => (width / BASE_WIDTH) * size;
const verticalScaleSize = size => (height / BASE_HEIGHT) * size;

const responsiveFontSize = size => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};

const scalePercentage = percentage => (width / 100) * percentage;

const trueUniformScale = size => (Math.min(width, height) / BASE_WIDTH) * size;

const res = {
  width: size =>
    typeof size === 'string' && size.includes('%')
      ? scalePercentage(parseFloat(size))
      : scaleSize(size),

  height: size =>
    typeof size === 'string' && size.includes('%')
      ? (height / 100) * parseFloat(size)
      : verticalScaleSize(size),

  fontSize: size => responsiveFontSize(size),
  margin: size => scaleSize(size),
  padding: size => scaleSize(size),
  borderRadius: size => scaleSize(size),

  uniform: size => trueUniformScale(size),
};

export default res;
