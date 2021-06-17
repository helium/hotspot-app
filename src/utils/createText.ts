import {
  BaseTheme,
  ColorProps,
  OpacityProps,
  VisibleProps,
  TypographyProps,
  SpacingProps,
  LayoutProps,
  TextShadowProps,
  VariantProps,
  SpacingShorthandProps,
  color,
  opacity,
  visible,
  typography,
  layout,
  spacing,
  spacingShorthand,
  textShadow,
  createVariant,
  createRestyleComponent,
  RestyleFunctionContainer,
} from '@shopify/restyle'
import React from 'react'
import { Text } from 'react-native'

type BaseTextProps<Theme extends BaseTheme> = ColorProps<Theme> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  TypographyProps<Theme> &
  SpacingProps<Theme> &
  LayoutProps<Theme> &
  TextShadowProps<Theme> &
  VariantProps<Theme, 'textVariants'>

export type TextProps<
  Theme extends BaseTheme,
  EnableShorthand extends boolean = true
> = EnableShorthand extends true
  ? BaseTextProps<Theme> & SpacingShorthandProps<Theme>
  : BaseTextProps<Theme>

export const textRestyleFunctions = [
  color,
  opacity,
  visible,
  typography,
  layout,
  spacing,
  spacingShorthand,
  textShadow,
  createVariant({ themeKey: 'textVariants' }),
]

const createText = <
  Theme extends BaseTheme,
  Props = React.ComponentProps<typeof Text> & { children?: React.ReactNode },
  EnableShorthand extends boolean = true
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BaseComponent: React.ComponentType<any> = Text,
) => {
  return createRestyleComponent<
    TextProps<Theme, EnableShorthand> &
      Omit<Props, keyof TextProps<Theme, EnableShorthand>>,
    Theme
  >(
    textRestyleFunctions as RestyleFunctionContainer<
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      TextProps<Theme, EnableShorthand>,
      Theme
    >[],
    BaseComponent,
  )
}

export default createText
