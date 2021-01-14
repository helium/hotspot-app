import React, { useState } from 'react'
import { View } from 'react-native'
import Chart from './Chart'
import { ChartData } from './types'

type Props = {
  height: number
  data: ChartData[]
  onFocus: (data: ChartData | null) => void
  showDays?: boolean
  upColor?: string
  downColor?: string
}

const ChartContainer = ({
  height,
  data,
  onFocus,
  showDays,
  upColor,
  downColor,
}: Props) => {
  const [width, setWidth] = useState(0)

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number } }
  }) => {
    setWidth(event.nativeEvent.layout.width)
  }

  return (
    <View onLayout={handleLayout} style={{ height }}>
      {width > 0 && (
        <Chart
          width={width}
          height={height}
          data={data}
          onFocus={onFocus}
          showDays={showDays}
          upColor={upColor}
          downColor={downColor}
        />
      )}
    </View>
  )
}

export default ChartContainer
