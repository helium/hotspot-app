import React from 'react'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'

const SplashScreen = () => {
  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      justifyContent="space-evenly"
      alignContent="center"
      padding="xl"
      flexDirection="column"
    >
      <Text variant="header">Helium</Text>
    </SafeAreaBox>
  )
}

export default SplashScreen
