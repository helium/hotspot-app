import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'
import Box from '../../../components/Box'

const SendCompleteScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Wallet')
    }, 3000)
  }, [navigation])

  return (
    <>
      <Box
        backgroundColor="primaryBackground"
        flex={1}
        justifyContent="flex-start"
        alignContent="center"
        flexDirection="column"
      >
        <LottieView
          source={require('../../../assets/animations/sendAnimation.json')}
          autoPlay
          loop={false}
        />
      </Box>
    </>
  )
}

export default SendCompleteScreen
