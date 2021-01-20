/* eslint-disable react/jsx-props-no-spreading */
import { useNavigation } from '@react-navigation/native'
import { BoxProps } from '@shopify/restyle'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { Theme } from '../theme/theme'
import { useColors } from '../theme/themeHooks'
import BackButton from './BackButton'
import Box from './Box'
// import SafeAreaBox from './SafeAreaBox'

type Props = BoxProps<Theme> & { children: React.ReactNode }

const BackScreen = ({
  backgroundColor,
  children,
  flex,
  padding,
  ...rest
}: Props) => {
  const navigation = useNavigation()
  const colors = useColors()
  // return (
  //   <SafeAreaBox
  //     backgroundColor={backgroundColor || 'primaryBackground'}
  //     flex={1}
  //   >
  //     <BackButton marginHorizontal="n_s" onPress={navigation.goBack} />
  //     <Box padding={padding || 'lx'} flex={flex || 1} {...rest}>
  //       {children}
  //     </Box>
  //   </SafeAreaBox>
  // )
  return (
    <>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: colors.primaryBackground }}
      />
      <Box
        backgroundColor={backgroundColor || 'primaryBackground'}
        paddingBottom="lx"
        flex={1}
      >
        <Box backgroundColor="primaryBackground">
          <BackButton marginHorizontal="n_s" onPress={navigation.goBack} />
        </Box>
        <Box padding={padding || 'lx'} flex={flex || 1} {...rest}>
          {children}
        </Box>
      </Box>
    </>
  )
}

export default BackScreen
