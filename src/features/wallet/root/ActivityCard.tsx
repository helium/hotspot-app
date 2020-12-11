/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Animated } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { orderBy, random, times } from 'lodash'
import CardHandle from './CardHandle'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ActivityItem from './ActivityItem'
import CarotDown from '../../../assets/images/carot-down.svg'
import { WalletAnimationPoints } from './walletLayout'
import { triggerNotification } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = {
  animatedValue: Animated.Value
  scrollOffset: Animated.Value
  animationPoints: WalletAnimationPoints
}

const ActivityCard = ({
  animatedValue,
  scrollOffset,
  animationPoints,
}: Props) => {
  const renderItem = ({ item, index }: { item: TxnData; index: number }) => (
    <ActivityItem
      type={item.type}
      time={item.time}
      amount={item.amount}
      isFirst={index === 0}
      isLast={index === data.length - 1}
    />
  )

  const handlePress = () => {
    triggerNotification()
  }

  const { dragMax, dragMid, dragMin } = animationPoints

  return (
    <SlidingUpPanel
      animatedValue={animatedValue}
      draggableRange={{ top: dragMax, bottom: dragMin }}
      snappingPoints={[dragMid]}
      showBackdrop={false}
      friction={2}
    >
      {(dragHandler) => (
        <Box flex={1} backgroundColor="white" borderRadius="l">
          <Box {...dragHandler} padding="m">
            <Box alignItems="center" padding="s">
              <CardHandle />
            </Box>
            <Box flexDirection="row" alignItems="center">
              <Text color="grayDark" fontSize={20} fontWeight="600">
                View
              </Text>
              <TouchableOpacityBox
                flexDirection="row"
                marginHorizontal="xs"
                onPress={handlePress}
              >
                <Text color="purpleMain" fontSize={20} fontWeight="600">
                  All Activity
                </Text>
                <Box padding="xs" paddingTop="ms">
                  <CarotDown />
                </Box>
              </TouchableOpacityBox>
            </Box>
          </Box>
          <Box paddingHorizontal="m">
            <Animated.FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { y: scrollOffset } },
                  },
                ],
                {
                  useNativeDriver: true,
                },
              )}
              contentContainerStyle={{
                paddingBottom: 400,
              }}
            />
          </Box>
        </Box>
      )}
    </SlidingUpPanel>
  )
}

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
