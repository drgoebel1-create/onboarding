import { createLightTheme, createDarkTheme } from '@fluentui/react-components';
import type { BrandVariants } from '@fluentui/react-components';

const wernerSobekBrand: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263D',
  40: '#193253',
  50: '#1B3F6A',
  60: '#1C4C82',
  70: '#1D5A9A',
  80: '#1D68B3',
  90: '#3C78B8',
  100: '#5688BE',
  110: '#6B98C4',
  120: '#80A8CA',
  130: '#94B8D1',
  140: '#A8C8D8',
  150: '#BDD8E0',
  160: '#D2E8E8',
};

export const lightTheme = createLightTheme(wernerSobekBrand);
export const darkTheme = createDarkTheme(wernerSobekBrand);
