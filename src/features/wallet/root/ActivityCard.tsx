import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  ElementRef,
  Ref,
} from 'react'
import { orderBy, random, times } from 'lodash'
import BottomSheet from 'react-native-holy-sheet'
import Animated from 'react-native-reanimated'
import ActivityItem from './ActivityItem'
import { WalletAnimationPoints } from './walletLayout'
import ActivityCardHeader from './ActivityCardHeader'

type Props = {
  animationPoints: WalletAnimationPoints
  snapProgress?: Animated.SharedValue<number>
}

type ActivityCardHandle = {
  snapTo: (index?: number) => void
}

const ActivityCard = forwardRef(
  (props: Props, ref: Ref<ActivityCardHandle>) => {
    const { animationPoints, snapProgress } = props

    type BottomSheetHandle = ElementRef<typeof BottomSheet>
    const sheet = useRef<BottomSheetHandle>(null)

    useImperativeHandle(ref, () => ({
      snapTo(index?: number): void {
        sheet.current?.snapTo(index)
      },
    }))

    const renderItem = ({ item, index }: { item: TxnData; index: number }) => (
      <ActivityItem
        type={item.type}
        time={item.time}
        amount={item.amount}
        isFirst={index === 0}
        isLast={index === data.length - 1}
      />
    )

    const { dragMax, dragMid, dragMin } = animationPoints

    return (
      <BottomSheet
        ref={sheet}
        snapPoints={[dragMin, dragMid, dragMax]}
        initialSnapIndex={1}
        snapProgress={snapProgress}
        renderHeader={() => <ActivityCardHeader />}
        flatListProps={{
          data,
          keyExtractor: (item) => item.id,
          renderItem,
        }}
      />
    )
  },
)

// this is just for filler data, the actual activity txn
// handlers will be more complex
const types: TxnType[] = ['rewards', 'sent', 'received', 'add']

type TxnType = 'rewards' | 'sent' | 'received' | 'add'
type TxnData = { id: string; type: TxnType; time: number; amount: number }

const data: TxnData[] = orderBy(
  times(50).map((i) => ({
    id: i.toString(),
    type: types[random(0, types.length - 1)],
    time: Math.floor(Date.now()) - random(0, 60 * 60 * 24 * 60 * 1000),
    amount: random(1, 100, true),
  })),
  ['time'],
  ['desc'],
)

export default ActivityCard
