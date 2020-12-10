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
import { walletAnimationPoints, walletLayout } from './walletLayout'

const WalletView = () => {
  const { t } = useTranslation()

  const handlePress = () => {
    Haptic.trigger('notificationWarning')
  }

  const animatedValue = useRef(new Animated.Value(280)).current
  // for debugging
  // animatedValue.addListener(({ value }) => console.log(value))

  const { dragMax, dragMid, dragMin } = walletAnimationPoints

  const balanceTranslateY = animatedValue.interpolate({
    inputRange: [dragMid, dragMax],
    outputRange: [0, -walletLayout.chartHeight],
    extrapolate: 'clamp',
  })

  const balanceInnerTranslateY = animatedValue.interpolate({
    inputRange: [dragMid, dragMax],
    outputRange: [0, -walletLayout.balanceInnerTranslate],
    extrapolate: 'clamp',
  })

  const balanceInnerScale = animatedValue.interpolate({
    inputRange: [dragMid, dragMax],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  })

  const animateActivityToBottom = () => {
    Animated.timing(animatedValue, {
      toValue: dragMin,
      duration: 200,
      useNativeDriver: true,
    }).start()
    Haptic.trigger('notificationSuccess')
  }

  return (
    <Box flex={1} style={{ paddingTop: walletLayout.notchHeight }}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="l"
        backgroundColor="primaryBackground"
        zIndex={1}
        height={walletLayout.headerHeight}
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
        <BarChart height={walletLayout.chartHeight} />
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

      <ActivityCard
        animatedValue={animatedValue}
        animationPoints={walletAnimationPoints}
      />
    </Box>
  )
}

export default WalletView
