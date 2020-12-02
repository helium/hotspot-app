/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Trans } from 'react-i18next'
import { TextProps } from '@shopify/restyle'
import Text from './Text'
import { Font, Theme } from '../theme/theme'

const components = {
  b: <Text fontFamily={Font.main.semiBold} />,
  red: <Text color="red" />,
  blue: <Text color="blue" />,
}

type Props = TextProps<Theme> & { i18nKey: string }
const TextTransform = ({ i18nKey, ...props }: Props) => {
  return (
    <Text {...props}>
      <Trans i18nKey={i18nKey} components={components} />
    </Text>
  )
}
export default TextTransform
