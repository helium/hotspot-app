import React from 'react'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import HeliumLogo from '../../assets/images/logo.svg'

const SplashScreen = () => {
  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
    >
      <HeliumLogo />
      <Text marginLeft="s" variant="h1">
        Helium
      </Text>
    </SafeAreaBox>
  )
}

export default SplashScreen
