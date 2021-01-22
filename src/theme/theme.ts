import { createTheme } from '@shopify/restyle'
import { TextProps } from 'react-native'

// TODO restructure this color palatte like material or ant

const palette = {
  black: '#000000',
  white: '#FFFFFF',
  offwhite: '#F9FAFC',

  blueGrayLight: '#CDD7E5',
  blueGray: '#33414E',
  blueBright: '#1D91F8',
  blueLight: '#51AEFF',
  blueMain: '#4BABFF',
  blueDark: '#232E39',

  grayLight: '#DADADA',
  grayExtraLight: '#788AB4',
  grayMain: '#81909F',
  graySteel: '#74869A',
  grayDark: '#202B37',
  grayBlue: '#3D5A73',
  grayBox: '#F6F7FE',
  grayBlack: '#1C1C1C',
  grayText: '#667394',
  grayLightText: '#A7AACD',

  redMain: '#F97570',
  redMedium: '#FF6666',

  purple: '#B377FF',
  purpleBright: '#A667F6',
  whitePurple: '#FAF6FE',
  purpleLight: '#A0A5DA',
  purpleMain: '#474DFF',
  purple400: '#292E56',
  purple300: '#343964',
  purple200: '#23264b',
  purple100: '#383A6F',
  purpleDark: '#13162E',
  purpleMuted: '#666995',
  purpleBrightMuted: '#7788D4',

  greenBright: '#29D391',
  greenMain: '#32C48D',
  greenDark: '#13162E',
  greenOnline: '#29D344',

  orange: '#FF852F',
  yellow: '#FFCB46',
  gold: '#FFC769',
  gray: '#687A8C',
}

export const Font = {
  main: {
    light: 'Inter-Light',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
  },
  mono: {
    light: 'InputMono-Light',
    regular: 'InputMono-Regular',
  },
}

const textVariants = {
  h1: {
    fontFamily: Font.main.semiBold,
    fontSize: 40,
    lineHeight: 45.5,
    color: 'primaryText',
  },
  h2: {
    fontFamily: Font.main.semiBold,
    fontSize: 27,
    color: 'primaryText',
  },
  h3: {
    fontFamily: Font.main.semiBold,
    fontSize: 22,
    color: 'primaryText',
  },
  h4: {
    fontFamily: Font.main.semiBold,
    fontSize: 20,
    color: 'primaryText',
  },
  h5: {
    fontFamily: Font.main.semiBold,
    fontSize: 17,
    color: 'primaryText',
  },
  h6: {
    fontFamily: Font.main.semiBold,
    fontSize: 13,
    color: 'primaryText',
  },
  h7: {
    fontFamily: Font.main.semiBold,
    fontSize: 11,
    color: 'primaryText',
  },
  regular: {
    fontFamily: Font.main.regular,
    color: 'primaryText',
  },
  light: {
    fontFamily: Font.main.light,
    color: 'primaryText',
  },
  bold: {
    fontFamily: Font.main.semiBold,
    color: 'primaryText',
  },
  mono: {
    fontFamily: Font.mono.regular,
    color: 'primaryText',
  },
  medium: {
    fontFamily: Font.main.medium,
    color: 'primaryText',
  },
  subtitle: {
    fontFamily: Font.main.regular,
    fontSize: 19,
    lineHeight: 26,
    color: 'purpleLight',
  },
  body1: {
    fontFamily: Font.main.regular,
    fontSize: 17,
    color: 'primaryText',
  },
  body2: {
    fontFamily: Font.main.regular,
    fontSize: 14,
    color: 'primaryText',
  },
  body3: {
    fontFamily: Font.main.regular,
    fontSize: 11,
    color: 'primaryText',
  },
  input: {
    fontFamily: Font.main.regular,
    flex: 1,
    borderWidth: 1,
    padding: 8,
  },
  button: {
    fontFamily: Font.main.regular,
    color: 'primaryText',
    textAlign: 'center',
    fontSize: 17,
  } as TextProps,
  keypad: {
    fontFamily: Font.main.medium,
    fontSize: 40,
    color: 'primaryText',
  },
}

export const theme = createTheme({
  colors: {
    ...palette,
    primaryBackground: palette.purpleDark,
    cardBackground: palette.white,
    primaryMain: palette.purpleMain,
    primaryText: palette.white,
    primaryButtonText: palette.white,
    secondaryMain: palette.greenMain,
    secondaryText: palette.graySteel,
    disabled: palette.grayExtraLight,
    inputPlaceholderText: palette.grayExtraLight,
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
    none: 0,
    s: 4,
    ms: 6,
    m: 8,
    l: 12,
    xl: 20,
    round: 1000,
  },
  breakpoints: {
    smallPhone: 0,
    phone: 375,
    tablet: 768,
  },
  cardVariants: {
    regular: {
      padding: 'ms',
      borderRadius: 'ms',
      backgroundColor: 'grayBox',
    },
    elevated: {
      shadowColor: 'blueDark',
      borderRadius: 'm',
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 9,
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: 'xl',
    },
  },
  textVariants: {
    ...textVariants,

    buttonLight: { ...textVariants.button, ...textVariants.light },
    buttonMedium: { ...textVariants.button, ...textVariants.medium },
    buttonBold: { ...textVariants.button, ...textVariants.bold },
    buttonMono: { ...textVariants.button, ...textVariants.mono },

    body1Light: { ...textVariants.body1, ...textVariants.light },
    body1Medium: { ...textVariants.body1, ...textVariants.medium },
    body1Bold: { ...textVariants.body1, ...textVariants.bold },
    body1Mono: { ...textVariants.body1, ...textVariants.mono },

    body2Light: { ...textVariants.body2, ...textVariants.light },
    body2Medium: { ...textVariants.body2, ...textVariants.medium },
    body2Bold: { ...textVariants.body2, ...textVariants.bold },
    body2Mono: { ...textVariants.body2, ...textVariants.mono },

    subtitleLight: {
      ...textVariants.subtitle,
      fontFamily: textVariants.light.fontFamily,
    },
    subtitleRegular: { ...textVariants.subtitle, ...textVariants.regular },
    subtitleMedium: { ...textVariants.subtitle, ...textVariants.medium },
    subtitleBold: { ...textVariants.subtitle, ...textVariants.bold },
    subtitleMono: { ...textVariants.subtitle, ...textVariants.mono },
  },
  inputVariants: {
    regular: {
      backgroundColor: 'grayDark',
      fontFamily: Font.main.regular,
      fontSize: 18,
      color: 'white',
      borderRadius: 'm',
    },
    light: {
      backgroundColor: 'grayBox',
      fontFamily: Font.main.regular,
      fontSize: 18,
      color: 'black',
      borderRadius: 'm',
    },
  },
})

const darkTextVariants = {
  h1: { ...textVariants.h1, color: 'black' },
  body2: { ...textVariants.body2, color: 'black' },
  input: { ...textVariants.input },
  button: { ...textVariants.button, color: 'black' },
}

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    primaryBackground: palette.white,
    cardBackground: palette.black,
    primaryMain: palette.black,
    secondaryMain: palette.blueGray,
  },
  textVariants: {
    ...darkTextVariants,
    body2Bold: { ...darkTextVariants.body2, fontFamily: Font.main.semiBold },
    body2Mono: { ...darkTextVariants.body2, fontFamily: Font.mono.regular },
  },
}

export type Theme = typeof theme
export type Colors = keyof Theme['colors']
