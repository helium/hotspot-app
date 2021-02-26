/* eslint-disable react/jsx-props-no-spreading */
import { useNavigation } from '@react-navigation/native'
import { BoxProps } from '@shopify/restyle'
import React from 'react'
import { Edge } from 'react-native-safe-area-context'
import { Theme } from '../theme/theme'
import BackButton from './BackButton'
import Box from './Box'
import SafeAreaBox from './SafeAreaBox'

type Props = BoxProps<Theme> & { children: React.ReactNode; edges?: Edge[] }

const BackScreen = ({
  backgroundColor,
  children,
  flex,
  padding,
  edges,
  ...rest
}: Props) => {
  const navigation = useNavigation()
  return (
    <SafeAreaBox
      edges={edges || undefined}
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
