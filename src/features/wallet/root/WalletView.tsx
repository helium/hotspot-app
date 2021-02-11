import React, { useRef, memo, useCallback, useState, useEffect } from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import { ActivityIndicator } from 'react-native'
import Box from '../../../components/Box'
import BarChart from '../../../components/BarChart'
import BalanceCard from './BalanceCard/BalanceCard'
import ActivityCard from './ActivityCard/ActivityCard'

import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { triggerNavHaptic } from '../../../utils/haptic'
import { Loading } from '../../../store/activity/activitySlice'
import { FilterType } from './walletTypes'

export type WalletViewState = 'loading' | 'no_activity' | 'has_activity'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
  walletViewState: WalletViewState
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  status: Loading
  balanceSheetIndex: number
  activityCardIndex: number
  setActivityCardIndex: (index: number) => void
}

const WalletView = ({
  layout,
  animationPoints,
  walletViewState,
  txns,
  pendingTxns,
  filter,
  status,
  balanceSheetIndex,
  activityCardIndex,
  setActivityCardIndex,
}: Props) => {
  const navigation = useNavigation()
  const activityCard = useRef<BottomSheet>(null)
  const balanceSheet = useRef<BottomSheet>(null)

  const animatedCardIndex = useSharedValue<number>(1)
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    setShowSkeleton(walletViewState !== 'has_activity')
  }, [walletViewState])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Send')
  }, [navigation])

  const toggleShowReceive = useCallback(() => {
    if (walletViewState === 'has_activity') {
      const snapToIndex = activityCardIndex === 1 ? 0 : 1
      activityCard.current?.snapTo(snapToIndex)
    } else {
      const snapToIndex = balanceSheetIndex === 1 ? 0 : 1
      balanceSheet.current?.snapTo(snapToIndex)
    }
    triggerNavHaptic()
  }, [activityCardIndex, balanceSheetIndex, walletViewState])

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

  if (walletViewState === 'no_activity') return null

  if (showSkeleton) return <ActivityIndicator color="white" />

  return (
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
  )
}

export default memo(withWalletLayout(WalletView))
