import React, { useState } from 'react'
import Svg, { Text, Rect } from 'react-native-svg'
import { View } from 'react-native'
import { maxBy } from 'lodash'

const data = [
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
]

// TODO
// scale gap between bars
// if all downs are 0, no gap

type Props = {
  height: number
}

const BarChart = ({ height }: Props) => {
  const [width, setWidth] = useState(0)

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number } }
  }) => {
    setWidth(event.nativeEvent.layout.width)
  }

  const barWidth = width / (data.length + data.length - 1)
  const maxUp = maxBy(data, 'up')?.up || 0
  const maxDown = maxBy(data, 'down')?.down || 0
  const maxBarHeight = maxUp + barWidth / 1.5 + maxDown
  const vScale = (height - 20) / maxBarHeight

  return (
    <View
      onLayout={handleLayout}
      style={{ backgroundColor: 'rgba(255,0,0,0)', height, marginVertical: 40 }}
    >
      <Svg height="100%" width="100%">
        {data.map((v, i) => (
          <React.Fragment key={`frag-${v.id}`}>
            <Rect
              x={barWidth * (2 * i)}
              y={maxUp * vScale - v.up * vScale}
              rx={barWidth / 2}
              width={barWidth}
              height={v.up * vScale}
              fill="#29D391"
            />

            <Rect
              x={barWidth * (2 * i)}
              y={maxUp * vScale + barWidth / 1.5}
              rx={barWidth / 2}
              width={barWidth}
              height={v.down * vScale}
              fill="#1D91F8"
            />

            <Text
              fill="#667394"
              stroke="none"
              fontSize="12"
              fontWeight={300}
              x={barWidth * (2 * i) + barWidth / 2}
              y={height - 4}
              textAnchor="middle"
            >
              {v.day}
            </Text>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  )
}

export default BarChart
