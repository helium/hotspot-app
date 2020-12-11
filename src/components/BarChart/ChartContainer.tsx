import React, { useState } from 'react'
import { View } from 'react-native'
import Chart from './Chart'
import { ChartData } from './types'

type Props = {
  height: number
  data: ChartData[]
  onFocus: (data: ChartData | null) => void
}

const ChartContainer = ({ height, data, onFocus }: Props) => {
  const [width, setWidth] = useState(0)

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number } }
  }) => {
    setWidth(event.nativeEvent.layout.width)
  }

  return (
    <View onLayout={handleLayout} style={{ height }}>
      {width > 0 && (
        <Chart width={width} height={height} data={data} onFocus={onFocus} />
      )}
    </View>
  )
}

export default ChartContainer
