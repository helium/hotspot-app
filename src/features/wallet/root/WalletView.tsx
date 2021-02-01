import React, { useRef, memo, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Animated, { Extrapolate, useValue } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import BarChart from '../../../components/BarChart'
import Search from '../../../assets/images/search.svg'
import Qr from '../../../assets/images/qr.svg'
import BalanceCard from './BalanceCard'
import ActivityCard from './ActivityCard'
import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { triggerNavHaptic } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
}

const WalletView = ({ layout, animationPoints }: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const card = useRef<BottomSheet>(null)
  const [cardIndex, setCardIndex] = useState(1)
  const animatedCardIndex = useValue(1)

  const handlePress = useCallback(() => {
    triggerNavHaptic()
  }, [])

  const navScan = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Scan')
  }, [navigation])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Send')
  }, [navigation])

  const animateActivityToBottom = useCallback(() => {
    const snapToIndex = cardIndex === 1 ? 0 : 1
    card.current?.snapTo(snapToIndex)
    triggerNavHaptic()
  }, [cardIndex])

  const balanceCardStyles = useMemo(
    () => [
      {
        flex: 1,
      },
      {
        transform: [
          {
            translateY: animatedCardIndex.interpolate({
              inputRange: [1, 2],
              outputRange: [0, -layout.chartHeight],
              extrapolate: Extrapolate.CLAMP,
            }),
          },
        ],
      },
    ],
    [animatedCardIndex, layout.chartHeight],
  )

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
        <Text variant="h1" fontSize={22}>
          {t('wallet.title')}
        </Text>

        <Box flexDirection="row" justifyContent="space-between" width={85}>
          <TouchableOpacityBox onPress={handlePress} padding="s">
            <Search width={22} height={22} />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={navScan} padding="s">
            <Qr width={22} height={22} color="white" />
          </TouchableOpacityBox>
        </Box>
      </Box>

      <Box paddingHorizontal="l">
        <BarChart height={layout.chartHeight} />
      </Box>

      <Animated.View style={balanceCardStyles}>
        <BalanceCard
          onReceivePress={animateActivityToBottom}
          onSendPress={handleSendPress}
        />
      </Animated.View>

      <ActivityCard
        ref={card}
        animationPoints={animationPoints}
        animatedIndex={animatedCardIndex}
        onChange={setCardIndex}
      />
    </Box>
  )
}

export default memo(withWalletLayout(WalletView))
