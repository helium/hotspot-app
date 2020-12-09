/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { orderBy, random, times } from 'lodash'
import Haptic from 'react-native-haptic-feedback'
import CardHandle from './CardHandle'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ActivityItem from './ActivityItem'
import CarotDown from '../../../assets/images/carot-down.svg'

type Props = {
  animatedValue: Animated.Value
}

const ActivityCard = ({ animatedValue }: Props) => {
  const renderItem = ({ item, index }) => (
    <ActivityItem
      type={item.type}
      time={item.time}
      amount={item.amount}
      isFirst={index === 0}
      isLast={index === data.length - 1}
    />
  )

  const handlePress = () => {
    Haptic.trigger('notificationWarning')
  }

  return (
    <SlidingUpPanel
      animatedValue={animatedValue}
      draggableRange={{ top: 600, bottom: 40 }}
      snappingPoints={[280]}
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
              <TouchableOpacity onPress={handlePress}>
                <Box flexDirection="row" marginHorizontal="xs">
                  <Text color="purpleMain" fontSize={20} fontWeight="600">
                    All Activity
                  </Text>
                  <Box padding="xs" paddingTop="ms">
                    <CarotDown />
                  </Box>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>
          <Box paddingHorizontal="m">
            <Animated.FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
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

const types = ['rewards', 'sent', 'received', 'add']

const data = orderBy(
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
