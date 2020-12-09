import React, { useRef } from 'react'
import { TouchableOpacity, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import Haptic from 'react-native-haptic-feedback'
import Box from '../../../components/Box'
import AnimatedBox from '../../../components/AnimatedBox'
import Text from '../../../components/Text'
import BarChart from '../../../components/BarChart'
import Search from '../../../assets/images/search.svg'
import Add from '../../../assets/images/add.svg'
import BalanceCard from './BalanceCard'
import ActivityCard from './ActivityCard'

// TODO
// need to do device size math to make sure these values
// are compatible across devices

const WalletView = () => {
  const { t } = useTranslation()

  const handlePress = () => {
    Haptic.trigger('notificationWarning')
  }

  const animatedValue = useRef(new Animated.Value(280)).current
  animatedValue.addListener(({ value }) => console.log(value))

  const balanceTranslateY = animatedValue.interpolate({
    inputRange: [280, 600],
    outputRange: [0, -210],
    extrapolate: 'clamp',
  })

  const balanceInnerTranslateY = animatedValue.interpolate({
    inputRange: [400, 600],
    outputRange: [0, -35],
    extrapolate: 'clamp',
  })

  const balanceInnerScale = animatedValue.interpolate({
    inputRange: [400, 600],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  })

  const animateActivityToBottom = () => {
    Animated.timing(animatedValue, {
      toValue: 40,
      duration: 200,
      useNativeDriver: true,
    }).start()
    Haptic.trigger('notificationSuccess')
  }

  return (
    <Box flex={1}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="l"
        backgroundColor="primaryBackground"
        zIndex={1}
      >
        <Text variant="header" fontSize={22}>
          {t('wallet.title')}
        </Text>

        <Box flexDirection="row" justifyContent="space-between" width={85}>
          <TouchableOpacity onPress={handlePress}>
            <Box padding="s">
              <Search width={22} height={22} />
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Box padding="s">
              <Add width={22} height={22} />
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>

      <Box paddingHorizontal="l">
        <BarChart height={150} />
      </Box>

      <AnimatedBox
        flex={1}
        style={[{ transform: [{ translateY: balanceTranslateY }] }]}
      >
        <BalanceCard
          translateY={balanceInnerTranslateY}
          scale={balanceInnerScale}
          onReceivePress={animateActivityToBottom}
        />
      </AnimatedBox>

      <ActivityCard animatedValue={animatedValue} />
    </Box>
  )
}

export default WalletView
