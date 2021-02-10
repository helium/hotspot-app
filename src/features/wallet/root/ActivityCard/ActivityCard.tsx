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

type AllTxns = (AnyTransaction | PendingTransaction)[]

type Props = {
  animationPoints: WalletAnimationPoints
  animatedIndex?: Animated.Value<number>
  onChange?: (index: number) => void
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  isResetting: boolean
  filter: FilterType
  status: Loading
}

const ActivityCard = forwardRef((props: Props, ref: Ref<BottomSheet>) => {
  const {
    animationPoints,
    animatedIndex,
    onChange,
    txns,
    pendingTxns,
    isResetting,
    filter,
    status,
  } = props
  const { dragMax, dragMid, dragMin } = animationPoints
  const sheet = useRef<BottomSheet>(null)

  // TODO is there an easier way to copy/forward these methods?
  useImperativeHandle(ref, () => ({
    snapTo(index: number, force?: boolean): void {
      sheet.current?.snapTo(index, force)
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

  const getData = useMemo((): AllTxns => {
    if (isResetting) return []

    if (filter === 'pending') {
      return pendingTxns
    }
    if (filter === 'all') {
      return [...pendingTxns, ...txns]
    }
    return txns
  }, [filter, isResetting, pendingTxns, txns])

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
      <ActivityCardListView
        data={getData}
        isResetting={isResetting}
        status={status}
      />
    </BottomSheet>
  )
})

export default memo(ActivityCard)
