/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Trans } from 'react-i18next'
import { TextProps } from '@shopify/restyle'
import Text from './Text'
import { Theme } from '../theme/theme'

const components = { b: <Text variant="bodyBold" /> }

type Props = TextProps<Theme> & { i18nKey: string }
const TextTransform = ({ i18nKey, ...props }: Props) => {
  return (
    <Text {...props}>
      <Trans i18nKey={i18nKey} components={components} />
    </Text>
  )
}
export default TextTransform
