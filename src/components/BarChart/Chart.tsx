import React, { useState, useRef } from 'react'
import Svg, { Text, Rect } from 'react-native-svg'
import { PanResponder, Animated } from 'react-native'
import { maxBy, clamp } from 'lodash'

// TODO
// scale gap between bars
// if all downs are 0, no gap
// split the difference between the gaps when finding the data target

type ChartData = {
  id: number
  up: number
  down: number
  day: string
}

type Props = {
  width: number
  height: number
  data: ChartData[]
}

const BarChart = ({ width, height, data }: Props) => {
  const [focusedBar, setFocusedBar] = useState(null)

  const barWidth = width / (data.length + data.length - 1)
  const maxUp = maxBy(data, 'up')?.up || 0
  const maxDown = maxBy(data, 'down')?.down || 0
  const maxBarHeight = maxUp + barWidth / 1.5 + maxDown
  const vScale = (height - 20) / maxBarHeight

  const findDataIndex = (xCoord: number): number =>
    clamp(Math.floor(xCoord / (barWidth * 2)), 0, data.length)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const dataIndex = findDataIndex(evt.nativeEvent.locationX)
        setFocusedBar(data[dataIndex])
      },
      onPanResponderRelease: () => {
        setFocusedBar(null)
      },
    }),
  ).current

  const handleTouchStart = (evt) => {
    const dataIndex = findDataIndex(evt.nativeEvent.locationX)
    setFocusedBar(data[dataIndex])
  }

  const handleTouchEnd = () => {
    setFocusedBar(null)
  }

  return (
    <Animated.View
      style={{
        backgroundColor: 'rgba(255,0,0,0)',
        height,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...panResponder.panHandlers}
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
              opacity={!focusedBar || focusedBar?.id === v.id ? 1 : 0.4}
            />

            <Rect
              x={barWidth * (2 * i)}
              y={maxUp * vScale + barWidth / 1.5}
              rx={barWidth / 2}
              width={barWidth}
              height={v.down * vScale}
              fill="#1D91F8"
              opacity={!focusedBar || focusedBar?.id === v.id ? 1 : 0.4}
            />

            <Text
              fill="#fff"
              stroke="none"
              fontSize="12"
              fontWeight={300}
              x={barWidth * (2 * i) + barWidth / 2}
              y={height - 4}
              textAnchor="middle"
              opacity={focusedBar && focusedBar?.id === v.id ? 1 : 0.4}
            >
              {v.day}
            </Text>
          </React.Fragment>
        ))}
      </Svg>
    </Animated.View>
  )
}

export default BarChart
