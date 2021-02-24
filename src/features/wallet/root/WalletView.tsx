import React, { memo, useState, useEffect } from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import Box from '../../../components/Box'
import BarChart from '../../../components/BarChart'
import BalanceCard from './BalanceCard/BalanceCard'
import ActivityCard from './ActivityCard/ActivityCard'

import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { ActivityViewState, FilterType } from './walletTypes'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
  showSkeleton: boolean
  activityViewState: ActivityViewState
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  setActivityCardIndex: (index: number) => void
  onReceivePress: () => void
  onSendPress: () => void
  activityCardRef: React.RefObject<BottomSheetMethods>
}

const WalletView = ({
  layout,
  animationPoints,
  showSkeleton,
  activityViewState,
  txns,
  pendingTxns,
  filter,
  setActivityCardIndex,
  onReceivePress,
  onSendPress,
  activityCardRef,
}: Props) => {
  const animatedCardIndex = useSharedValue<number>(1)
  const [hasNoResults, setHasNoResults] = useState(false)

  useEffect(() => {
    const noResults =
      activityViewState === 'activity' &&
      !showSkeleton &&
      pendingTxns.length === 0 &&
      txns.length === 0
    setHasNoResults(noResults)
  }, [activityViewState, pendingTxns.length, showSkeleton, txns.length])

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

  if (activityViewState === 'no_activity') return null
  return (
    <>
      <Box paddingHorizontal="l">
        <BarChart height={layout.chartHeight} />
      </Box>
      <Animated.View style={balanceCardStyles}>
        <BalanceCard
          layout={layout}
          onReceivePress={onReceivePress}
          onSendPress={onSendPress}
        />
      </Animated.View>

      <ActivityCard
        showSkeleton={showSkeleton}
        filter={filter}
        txns={txns}
        pendingTxns={pendingTxns}
        hasNoResults={hasNoResults}
        ref={activityCardRef}
        animationPoints={animationPoints}
        animatedIndex={animatedCardIndex}
        onChange={setActivityCardIndex}
      />
    </>
  )
}

export default memo(withWalletLayout(WalletView))
