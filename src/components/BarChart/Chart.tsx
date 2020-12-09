import React, { useState, useRef, useEffect } from 'react'
import Svg, { Text, Rect } from 'react-native-svg'
import { PanResponder, Animated } from 'react-native'
import { maxBy, clamp } from 'lodash'
import Haptic from 'react-native-haptic-feedback'
import { ChartData } from './types'

// TODO
// scale gap between bars
// if all downs are 0, no gap
// split the difference between the gaps when finding the data target
// min height, circle
// animate in

type Props = {
  width: number
  height: number
  data: ChartData[]
  onFocus: () => void
}

const BarChart = ({ width, height, data, onFocus }: Props) => {
  const [focusedBar, setFocusedBar] = useState(null)

  // trigger haptic feedback when the focused bar changes
  useEffect(() => {
    if (focusedBar) {
      Haptic.trigger('impactMedium')
    }
    onFocus(focusedBar)
  }, [focusedBar, onFocus])

  // SVG maths
  const barWidth = width / (data.length + data.length - 1)
  const maxUp = maxBy(data, 'up')?.up || 0
  const maxDown = maxBy(data, 'down')?.down || 0
  const maxBarHeight = maxUp + barWidth / 1.5 + maxDown
  const vScale = (height - 20) / maxBarHeight

  // maps x coordinates to elements in our data
  const findDataIndex = (xCoord: number): number =>
    clamp(Math.floor(xCoord / (barWidth * 2)), 0, data.length)

  // handle initial touch events to the chart that haven't
  // yet been registered by the pan responder
  const handleTouchStart = (evt) => {
    const dataIndex = findDataIndex(evt.nativeEvent.locationX)
    setFocusedBar(data[dataIndex])
  }

  const handleTouchEnd = () => {
    setFocusedBar(null)
  }

  // pan responder is responsible for the slide interaction
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

  return (
    <Animated.View
      style={{
        backgroundColor: 'rgba(255,0,0,0)',
        width,
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
