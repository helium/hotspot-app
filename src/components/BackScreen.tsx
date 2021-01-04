/* eslint-disable react/jsx-props-no-spreading */
import { useNavigation } from '@react-navigation/native'
import { BoxProps } from '@shopify/restyle'
import React from 'react'
import { Theme } from '../theme/theme'
import BackButton from './BackButton'
import Box from './Box'
import SafeAreaBox from './SafeAreaBox'

type Props = BoxProps<Theme> & { children: React.ReactNode }

const BackScreen = ({
  backgroundColor,
  children,
  flex,
  padding,
  ...rest
}: Props) => {
  const navigation = useNavigation()
  return (
    <SafeAreaBox
      backgroundColor={backgroundColor || 'primaryBackground'}
      flex={1}
    >
      <BackButton marginHorizontal="n_s" onPress={navigation.goBack} />
      <Box padding={padding || 'lx'} flex={flex || 1} {...rest}>
        {children}
      </Box>
    </SafeAreaBox>
  )
}

export default BackScreen
