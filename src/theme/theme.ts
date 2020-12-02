import { createTheme } from '@shopify/restyle'
import { TextProps, Platform } from 'react-native'

const palette = {
  black: '#000',
  white: '#FFF',
  blueGray: '#33414E',
  grayBlue: '#3D5A73',
  blue: '#4BABFF',
  lighterGray: '#465666',
  lightGray: '#DADADA',
  midGray: '#81909F',
  darkGray: '#202B37',
  steelGray: '#74869A',
  gray: '#5B6D7E',
  green: '#29D391',
  lightBlue: '#51AEFF',
  darkBlue: '#131F2A',
  darkestBlue: '#232E39',
  red: '#F97570',
  purple: '#B377FF',
}

export const Font = {
  main: {
    light: 'Soleil-Light',
    regular: 'Soleil-Regular',
    semiBold: Platform.OS === 'ios' ? 'SoleilW02-SemiBold' : 'Soleil-SemiBold',
  },
  mono: {
    light: 'InputMono-Light',
    regular: 'InputMono-Regular',
  },
}

const textVariants = {
  header: {
    fontFamily: Font.main.semiBold,
    fontSize: 34,
    lineHeight: 42.5,
    color: 'primaryText',
  },
  body: {
    fontFamily: Font.main.regular,
    fontSize: 16,
    lineHeight: 24,
    color: 'primaryText',
  },
  input: {
    fontFamily: Font.main.regular,
    flex: 1,
    borderWidth: 1,
    padding: 8,
  },
  button: {
    fontFamily: Font.main.semiBold,
    color: 'primaryText',
    textAlign: 'center',
    fontSize: 17,
  } as TextProps,
  keypad: {
    fontFamily: Font.mono.light,
    fontSize: 34,
    color: 'primaryText',
  },
}

export const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.blueGray,
    secondaryBackground: palette.darkBlue,
    cardBackground: palette.white,
    primaryMain: palette.green,
    primaryText: palette.white,
    primaryButtonText: palette.darkGray,
    secondaryMain: palette.lightBlue,
    secondaryText: palette.steelGray,
    disabled: palette.lighterGray,
    inputPlaceholderText: palette.lighterGray,
  },
  spacing: {
    n_xxl: -60,
    n_xl: -40,
    n_lx: -32,
    n_l: -24,
    n_lm: -20,
    n_m: -16,
    n_ms: -12,
    n_s: -8,
    n_xs: -4,
    n_xxs: -2,
    n_xxxs: -1,
    none: 0,
    xxxs: 1,
    xxs: 2,
    xs: 4,
    s: 8,
    ms: 12,
    m: 16,
    lm: 20,
    l: 24,
    lx: 32,
    xl: 40,
    xxl: 60,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    round: 1000,
  },
  breakpoints: {
    smallPhone: 0,
    phone: 375,
    tablet: 768,
  },
  cardVariants: {
    regular: {
      padding: 's',
    },
    elevated: {
      shadowColor: 'darkestBlue',
      borderRadius: 'm',
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 9,
    },
  },
  textVariants: {
    ...textVariants,
    bodyLight: { ...textVariants.body, fontFamily: Font.main.light },
    bodyBold: { ...textVariants.body, fontFamily: Font.main.semiBold },
    bodyMono: { ...textVariants.body, fontFamily: Font.mono.regular },
  },
  inputVariants: {
    regular: {
      backgroundColor: 'darkGray',
      fontFamily: Font.main.regular,
      fontSize: 18,
      color: 'white',
      borderRadius: 'm',
    },
  },
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
    secondaryBackground: palette.lightBlue,
    cardBackground: palette.black,
    primaryMain: palette.black,
    secondaryMain: palette.blueGray,
  },
  textVariants: {
    ...darkTextVariants,
    bodyBold: { ...darkTextVariants.body, fontFamily: Font.main.semiBold },
    bodyMono: { ...darkTextVariants.body, fontFamily: Font.mono.regular },
  },
}

export type Theme = typeof theme
export type Colors = keyof Theme['colors']
