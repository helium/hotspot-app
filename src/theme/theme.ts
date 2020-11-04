import { createTheme } from '@shopify/restyle'
import { TextProps } from 'react-native'

const palette = {
  black: '#000',
  white: '#FFF',
  blueGray: '#33414E',
  lightGray: '#EEEEEE',
}

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
}

export const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.blueGray,
    cardBackground: palette.white,
    primary: palette.white,
    secondary: palette.lightGray,
  },
  spacing: {
    none: 0,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  cardVariants: {
    regular: {
      padding: 's',
    },
    elevated: {
      backgroundColor: 'white',
      padding: 's',
      shadowColor: 'black',
      borderRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 9,
    },
  },
  textVariants,
})

const darkTextVariants = {
  header: { ...textVariants.header, color: 'black' },
  body: { ...textVariants.body, color: 'black' },
  input: { ...textVariants.input },
  button: { ...textVariants.button, color: 'black' },
}

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: palette.white,
    cardBackground: palette.black,
    primary: palette.black,
    secondary: palette.blueGray,
  },
  textVariants: darkTextVariants,
}

export type Theme = typeof theme
