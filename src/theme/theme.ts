import { createTheme } from '@shopify/restyle';
import { TextProps } from 'react-native';

const palette = {
  black: '#0B0B0B',
  white: '#F0F2F3',
  gray: '#33414E',
};

const textVariants = {
  header: {
    fontFamily: 'NotoSerif',
    fontWeight: 'bold',
    fontSize: 34,
    lineHeight: 42.5,
    color: 'white',
  },
  body: {
    fontFamily: 'NotoSerif',
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
  },
  input: {
    fontFamily: 'NotoSerif',
    flex: 1,
    borderWidth: 1,
    padding: 8,
  },
  button: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'NotoSerif',
  } as TextProps,
};

export const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.gray,
    cardPrimaryBackground: palette.white,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants,
});

const darkTextVariants = {
  header: { ...textVariants.header, color: 'black' },
  body: { ...textVariants.body, color: 'black' },
  input: { ...textVariants.input },
  button: { ...textVariants.button, color: 'black' },
};

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: palette.white,
    cardPrimaryBackground: palette.black,
  },
  textVariants: darkTextVariants,
};

export type Theme = typeof theme;
