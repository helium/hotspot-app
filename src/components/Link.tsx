import React, { ReactNode } from 'react'
import { Linking } from 'react-native'
import Text from './Text'

type Props = { children?: ReactNode; href?: string }
const Link = ({ children, href }: Props) => (
  <Text onPress={() => href && Linking.openURL(href)}>{children}</Text>
)

export default Link
