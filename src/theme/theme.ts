import { createTheme } from '@shopify/restyle'
import { TextProps, Platform } from 'react-native'

const palette = {
  black: '#000',
  white: '#FFF',
  blueGray: '#33414E',
  lightGray: '#EEEEEE',
  gray: '#5B6D7E',
  green: '#29D391',
  lightBlue: '#51AEFF',
  darkGray: '#252F3B',
}

export const Font = {
  main: {
    regular: 'Soleil-Regular',
    semiBold: Platform.OS === 'ios' ? 'SoleilW02-SemiBold' : 'Soleil-SemiBold',
  },
}

const textVariants = {
  header: {
    fontFamily: Font.main.semiBold,
    fontSize: 34,
    lineHeight: 42.5,
    color: 'white',
  },
  body: {
    fontFamily: Font.main.regular,
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
  },
  input: {
    fontFamily: Font.main.regular,
    flex: 1,
    borderWidth: 1,
    padding: 8,
  },
  button: {
    fontFamily: Font.main.semiBold,
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
  } as TextProps,
}

export const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.blueGray,
    cardBackground: palette.white,
    primaryMain: palette.green,
    primaryText: palette.darkGray,
    secondaryMain: palette.lightBlue,
    secondaryText: palette.gray,
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    ms: 12,
    m: 16,
    lm: 20,
    l: 24,
    xl: 40,
    xxl: 60,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
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
      borderRadius: 's',
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
    primaryMain: palette.black,
    secondaryMain: palette.blueGray,
  },
  textVariants: darkTextVariants,
}

export type Theme = typeof theme
export type Colors = keyof Theme['colors']
