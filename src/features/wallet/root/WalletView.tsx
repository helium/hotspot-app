import React, { useRef, memo, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import Search from '@assets/images/search.svg'
import Qr from '@assets/images/qr.svg'
import { ActivityIndicator } from 'react-native'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import BarChart from '../../../components/BarChart'
import BalanceCard from './BalanceCard/BalanceCard'
import ActivityCard from './ActivityCard/ActivityCard'

import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { triggerNavHaptic } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { hp } from '../../../utils/layout'
import WalletIntroCarousel from './WalletIntroCarousel'
import { Loading } from '../../../store/activity/activitySlice'
import { FilterType } from './walletTypes'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
  hasActivity: boolean
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  status: Loading
}

const WalletView = ({
  layout,
  animationPoints,
  hasActivity,
  txns,
  pendingTxns,
  filter,
  status,
}: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const activityCard = useRef<BottomSheet>(null)
  const balanceSheet = useRef<BottomSheet>(null)

  const [activityCardIndex, setActivityCardIndex] = useState(1)
  const [balanceSheetIndex, setBalanceSheetIndex] = useState(0)
  const animatedCardIndex = useSharedValue<number>(1)

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

  const toggleShowReceive = useCallback(() => {
    if (hasActivity) {
      const snapToIndex = activityCardIndex === 1 ? 0 : 1
      activityCard.current?.snapTo(snapToIndex)
    } else {
      const snapToIndex = balanceSheetIndex === 1 ? 0 : 1
      balanceSheet.current?.snapTo(snapToIndex)
    }
    triggerNavHaptic()
  }, [activityCardIndex, balanceSheetIndex, hasActivity])

  const balanceCardStyles = useAnimatedStyle(
    () => ({
      flex: 1,
      transform: [
        {
          translateY: interpolate(
            animatedCardIndex.value,
            [1, 2],
            [0, -layout.chartHeight],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedCardIndex, layout.chartHeight],
  )

  const containerStyle = useMemo(() => ({ paddingTop: layout.notchHeight }), [
    layout.notchHeight,
  ])

  return (
    <Box flex={1} style={containerStyle}>
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
          {hasActivity ? t('wallet.title') : ' '}
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

      {hasActivity === undefined && (
        <Box flex={1} justifyContent="center">
          <ActivityIndicator color="white" />
        </Box>
      )}

      {hasActivity && (
        <>
          <Box paddingHorizontal="l">
            <BarChart height={layout.chartHeight} />
          </Box>
          <Animated.View style={balanceCardStyles}>
            <BalanceCard
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </Animated.View>

          <ActivityCard
            filter={filter}
            txns={txns}
            pendingTxns={pendingTxns}
            status={status}
            ref={activityCard}
            animationPoints={animationPoints}
            animatedIndex={animatedCardIndex}
            onChange={setActivityCardIndex}
          />
        </>
      )}
      {hasActivity === false && (
        <>
          <WalletIntroCarousel />
          <BottomSheet
            index={balanceSheetIndex}
            onChange={setBalanceSheetIndex}
            handleComponent={null}
            backgroundComponent={null}
            snapPoints={[hp(20), hp(55)]}
            animateOnMount={false}
            ref={balanceSheet}
          >
            <BalanceCard
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </BottomSheet>
        </>
      )}
    </Box>
  )
}

export default memo(withWalletLayout(WalletView))
