/* eslint-disable react/jsx-props-no-spreading */
import { useNavigation } from '@react-navigation/native'
import { BoxProps } from '@shopify/restyle'
import React from 'react'
import { Theme } from '../theme/theme'
import BackButton from './BackButton'
import Box from './Box'
import SafeAreaBox from './SafeAreaBox'

type Props = BoxProps<Theme> & { children: React.ReactNode }

const BackScreen = ({ backgroundColor, children, flex, ...rest }: Props) => {
  const navigation = useNavigation()
  return (
    <SafeAreaBox
      backgroundColor={backgroundColor || 'primaryBackground'}
      flex={1}
    >
      <BackButton paddingHorizontal="l" onPress={navigation.goBack} />
      <Box flex={flex || 1} {...rest}>
        {children}
      </Box>
    </SafeAreaBox>
  )
}

export default BackScreen
