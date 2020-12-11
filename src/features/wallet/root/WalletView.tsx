import React, { useRef } from 'react'
import { Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import AnimatedBox from '../../../components/AnimatedBox'
import Text from '../../../components/Text'
import BarChart from '../../../components/BarChart'
import Search from '../../../assets/images/search.svg'
import Add from '../../../assets/images/add.svg'
import BalanceCard from './BalanceCard'
import ActivityCard from './ActivityCard'
import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { triggerNotification } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
}

const WalletView = ({ layout, animationPoints }: Props) => {
  const { t } = useTranslation()

  const handlePress = () => {
    triggerNotification()
  }

  const { dragMax, dragMid, dragMin } = animationPoints
  const animatedValue = useRef(new Animated.Value(dragMid)).current
  // for debugging
  // animatedValue.addListener(({ value }) => console.log(value))

  const balanceTranslateY = animatedValue.interpolate({
    inputRange: [dragMid, dragMax],
    outputRange: [0, -layout.chartHeight],
    extrapolate: 'clamp',
  })

  const balanceInnerTranslateY = animatedValue.interpolate({
    inputRange: [dragMid, dragMax],
    outputRange: [0, -layout.balanceInnerTranslate],
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
    triggerNotification()
  }

  return (
    <Box flex={1} style={{ paddingTop: layout.notchHeight }}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="l"
        backgroundColor="primaryBackground"
        zIndex={1}
        height={layout.headerHeight}
      >
        <Text variant="header" fontSize={22}>
          {t('wallet.title')}
        </Text>

        <Box flexDirection="row" justifyContent="space-between" width={85}>
          <TouchableOpacityBox onPress={handlePress} padding="s">
            <Search width={22} height={22} />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={handlePress} padding="s">
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </Box>
      </Box>

      <Box paddingHorizontal="l">
        <BarChart height={layout.chartHeight} />
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
        animationPoints={animationPoints}
      />
    </Box>
  )
}

export default withWalletLayout(WalletView)
