import React, { useState } from 'react'
import Haptic from 'react-native-haptic-feedback'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { random, times } from 'lodash'
import ChartContainer from './ChartContainer'
import CarotLeft from '../../assets/images/carot-left.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import Box from '../Box'
import Text from '../Text'

type Props = {
  height: number
}

const WalletChart = ({ height }: Props) => {
  const [focusedData, setFocusedData] = useState(null)
  const [timeframe, setTimeframe] = useState(0)

  const changeTimeframe = (t) => {
    setTimeframe(t)
    Haptic.trigger('impactMedium')
  }

  return (
    <Box marginVertical="m">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        height={20}
        marginBottom="m"
      >
        <Box flexDirection="row" flex={1.5}>
          {focusedData && (
            <>
              <Box flexDirection="row" alignItems="center" width={50}>
                <CarotLeft width={12} height={12} />
                <Text variant="body2" marginLeft="xs">
                  {focusedData?.up}
                </Text>
              </Box>

              <Box
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 50,
                }}
              >
                <CarotRight width={12} height={12} style={{ marginRight: 4 }} />
                <Text variant="body2" marginLeft="xs">
                  {focusedData?.down}
                </Text>
              </Box>
            </>
          )}
        </Box>
        <Box flex={1} flexDirection="row" justifyContent="space-between">
          <TouchableWithoutFeedback onPress={() => changeTimeframe(0)}>
            <Text variant="body1" opacity={timeframe === 0 ? 1 : 0.3}>
              14D
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeTimeframe(1)}>
            <Text variant="body1" opacity={timeframe === 1 ? 1 : 0.3}>
              12W
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeTimeframe(2)}>
            <Text variant="body1" opacity={timeframe === 2 ? 1 : 0.3}>
              12M
            </Text>
          </TouchableWithoutFeedback>
        </Box>
      </Box>
      <ChartContainer
        height={height}
        data={data[timeframe]}
        onFocus={setFocusedData}
      />
    </Box>
  )
}

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const data = {
  0: [
    {
      up: 52,
      down: 0,
      day: 'T',
      id: 0,
    },
    {
      up: 28,
      down: 0,
      day: 'W',
      id: 1,
    },
    {
      up: 20,
      down: 12,
      // down: 0,
      day: 'T',
      id: 2,
    },
    {
      up: 70,
      down: 0,
      day: 'F',
      id: 3,
    },
    {
      up: 50,
      down: 0,
      day: 'S',
      id: 4,
    },
    {
      up: 63,
      down: 0,
      day: 'S',
      id: 5,
    },
    {
      up: 28,
      down: 0,
      day: 'M',
      id: 6,
    },
    {
      up: 72,
      down: 29,
      // down: 0,
      day: 'T',
      id: 7,
    },
    {
      up: 40,
      down: 0,
      day: 'W',
      id: 8,
    },
    {
      up: 70,
      down: 0,
      day: 'T',
      id: 9,
    },
    {
      up: 42,
      down: 0,
      day: 'F',
      id: 10,
    },
    {
      up: 63,
      down: 16,
      // down: 0,
      day: 'S',
      id: 11,
    },
    {
      up: 20,
      down: 0,
      day: 'S',
      id: 12,
    },
    {
      up: 42,
      down: 0,
      day: 'M',
      id: 13,
    },
  ],
  1: [
    {
      up: 52,
      down: 0,
      day: 'T',
      id: 0,
    },
    {
      up: 28,
      down: 0,
      day: 'W',
      id: 1,
    },
    {
      up: 20,
      down: 12,
      // down: 0,
      day: 'T',
      id: 2,
    },
    {
      up: 70,
      down: 0,
      day: 'F',
      id: 3,
    },
    {
      up: 50,
      down: 0,
      day: 'S',
      id: 4,
    },
    {
      up: 63,
      down: 0,
      day: 'S',
      id: 5,
    },
    {
      up: 28,
      down: 0,
      day: 'M',
      id: 6,
    },
    {
      up: 72,
      down: 29,
      // down: 0,
      day: 'T',
      id: 7,
    },
    {
      up: 40,
      down: 0,
      day: 'W',
      id: 8,
    },
    {
      up: 70,
      down: 0,
      day: 'T',
      id: 9,
    },
    {
      up: 42,
      down: 0,
      day: 'F',
      id: 10,
    },
    {
      up: 63,
      down: 16,
      // down: 0,
      day: 'S',
      id: 11,
    },
  ],
  2: times(12).map((v, i) => ({
    up: random(0, 100),
    down: random(0, 1) ? random(0, 40) : 0,
    day: weekdays[i % 7],
    id: i,
  })),
}

export default WalletChart
