import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  Ref,
  useCallback,
  memo,
  useMemo,
} from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import Animated from 'react-native-reanimated'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import { WalletAnimationPoints } from '../walletLayout'
import ActivityCardHeader from './ActivityCardHeader'
import { Loading } from '../../../../store/activity/activitySlice'
import { FilterType } from '../walletTypes'
import ActivityCardListView from './ActivityCardListView'
import { skeletonData } from './SkeletonData'

type Props = {
  animationPoints: WalletAnimationPoints
  animatedIndex?: Animated.SharedValue<number>
  onChange?: (index: number) => void
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  status: Loading
  showSkeleton: boolean
}

const ActivityCard = forwardRef((props: Props, ref: Ref<BottomSheet>) => {
  const {
    animationPoints,
    animatedIndex,
    onChange,
    txns,
    pendingTxns,
    filter,
    status,
    showSkeleton,
  } = props
  const { dragMax, dragMid, dragMin } = animationPoints
  const sheet = useRef<BottomSheet>(null)

  // TODO is there an easier way to copy/forward these methods?
  useImperativeHandle(ref, () => ({
    snapTo(index: number): void {
      sheet.current?.snapTo(index)
    },
    expand() {
      sheet.current?.expand()
    },
    collapse() {
      sheet.current?.collapse()
    },
    close() {
      sheet.current?.close()
    },
  }))

  const getData = useMemo(() => {
    let data: (AnyTransaction | PendingTransaction)[] = txns
    if (filter === 'pending') {
      data = pendingTxns
    }

    if (filter === 'all') {
      data = [...pendingTxns, ...txns]
    }

    if (showSkeleton) {
      return skeletonData(data.length)
    }
    return data
  }, [filter, pendingTxns, txns, showSkeleton])

  const header = useCallback(() => <ActivityCardHeader filter={filter} />, [
    filter,
  ])

  const getSnapPoints = useMemo(() => [dragMin, dragMid, dragMax], [
    dragMax,
    dragMid,
    dragMin,
  ])

  return (
    <BottomSheet
      handleComponent={header}
      snapPoints={getSnapPoints}
      index={1}
      animateOnMount={false}
      ref={sheet}
      onChange={onChange}
      animatedIndex={animatedIndex}
    >
      <ActivityCardListView data={getData} status={status} />
    </BottomSheet>
  )
})

export default memo(ActivityCard)
