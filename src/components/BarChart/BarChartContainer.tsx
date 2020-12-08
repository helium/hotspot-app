import React, { useState } from 'react'
import { View } from 'react-native'
import Chart from './Chart'

type Props = {
  height: number
}

const BarChartContainer = ({ height }: Props) => {
  const [width, setWidth] = useState(0)

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number } }
  }) => {
    setWidth(event.nativeEvent.layout.width)
  }

  return (
    <View
      onLayout={handleLayout}
      style={{ backgroundColor: 'rgba(255,0,0,0)', height, marginVertical: 40 }}
    >
      {width > 0 && <Chart width={width} height={height} data={data} />}
    </View>
  )
}

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

export default BarChartContainer
