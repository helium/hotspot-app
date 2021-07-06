import React, { memo, useMemo, forwardRef, Ref } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import Animated from 'react-native-reanimated'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import ActivityCardHeader from './ActivityCardHeader'
import { FilterType } from '../walletTypes'
import ActivityCardListView from './ActivityCardListView'
import { Spacing } from '../../../../theme/theme'

type Props = {
  animatedIndex?: Animated.SharedValue<number>
  onChange?: (index: number) => void
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  hasNoResults: boolean
  showSkeleton: boolean
  snapPoints: (string | number)[]
  paddingVertical: Spacing
}

const ActivityCard = forwardRef(
  (
    {
      animatedIndex,
      onChange,
      txns,
      pendingTxns,
      filter,
      hasNoResults,
      showSkeleton,
      snapPoints,
      paddingVertical,
    }: Props,
    ref: Ref<BottomSheet>,
  ) => {
    const getData = useMemo(() => {
      let data: (AnyTransaction | PendingTransaction)[] = txns
      if (filter === 'pending') {
        data = pendingTxns
      }

      if (filter === 'all') {
        data = [...pendingTxns, ...txns]
      }

      return data
    }, [filter, pendingTxns, txns])

    return (
      <BottomSheet
        handleComponent={null}
        snapPoints={snapPoints}
        index={1}
        animateOnMount={false}
        ref={ref}
        onChange={onChange}
        animatedIndex={animatedIndex}
      >
        <>
          <ActivityCardHeader
            filter={filter}
            paddingVertical={paddingVertical}
          />
          <ActivityCardListView
            data={getData}
            hasNoResults={hasNoResults}
            showSkeleton={showSkeleton}
          />
        </>
      </BottomSheet>
    )
  },
)

export default memo(ActivityCard, (prev, next) => {
  return (
    prev.filter === next.filter &&
    prev.onChange === next.onChange &&
    prev.txns === next.txns &&
    prev.pendingTxns === next.pendingTxns &&
    prev.hasNoResults === next.hasNoResults &&
    prev.showSkeleton === next.showSkeleton
  )
})
