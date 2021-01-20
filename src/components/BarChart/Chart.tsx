import React, { useState, useEffect } from 'react'
import Svg, { Text, Rect } from 'react-native-svg'
import { PanResponder, Animated, GestureResponderEvent } from 'react-native'
import { maxBy, clamp, max } from 'lodash'
import { triggerImpact } from '../../utils/haptic'
import { ChartData } from './types'
import { useColors } from '../../theme/themeHooks'

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
  onFocus: (data: ChartData | null) => void
  showXAxisLabel?: boolean
  upColor?: string
  downColor?: string
}

const BarChart = ({
  width,
  height,
  data,
  onFocus,
  showXAxisLabel = true,
  upColor,
  downColor,
}: Props) => {
  const [focusedBar, setFocusedBar] = useState<ChartData | null>(null)
  const { greenBright, blueBright, white } = useColors()
  const barOffset = showXAxisLabel ? 20 : 0

  // trigger haptic feedback when the focused bar changes
  useEffect(() => {
    if (focusedBar) {
      triggerImpact()
    }
    onFocus(focusedBar)
  }, [focusedBar, onFocus])

  // SVG maths
  const barWidth = width / (data.length + data.length - 1)
  const maxUp = maxBy(data, 'up')?.up || 0
  const maxDown = maxBy(data, 'down')?.down || 0
  const maxBarHeight = maxUp + barWidth / 1.5 + maxDown
  const vScale = (height - barOffset) / maxBarHeight
  const minBarHeight = barWidth

  const barHeight = (value: number | undefined): number => {
    if (value === 0 || value === undefined) return 0
    return max([value * vScale, minBarHeight]) || 0
  }

  // maps x coordinates to elements in our data
  const findDataIndex = (xCoord: number): number =>
    clamp(Math.floor(xCoord / (barWidth * 2)), 0, data.length)

  // handle initial touch events to the chart that haven't
  // yet been registered by the pan responder
  const handleTouchStart = (evt: GestureResponderEvent) => {
    const dataIndex = findDataIndex(evt.nativeEvent.locationX)
    setFocusedBar(data[dataIndex])
  }

  const handleTouchEnd = () => {
    setFocusedBar(null)
  }

  // pan responder is responsible for the slide interaction
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const dataIndex = findDataIndex(evt.nativeEvent.locationX)
      setFocusedBar(data[dataIndex])
    },
    onPanResponderRelease: () => {
      setFocusedBar(null)
    },
  })

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
              y={maxUp * vScale - barHeight(v?.up)}
              rx={barWidth / 2}
              width={barWidth}
              height={barHeight(v?.up)}
              fill={upColor || greenBright}
              opacity={!focusedBar || focusedBar?.id === v.id ? 1 : 0.4}
            />

            <Rect
              x={barWidth * (2 * i)}
              y={maxUp * vScale + barWidth / 1.5}
              rx={barWidth / 2}
              width={barWidth}
              height={barHeight(v?.down)}
              fill={downColor || blueBright}
              opacity={!focusedBar || focusedBar?.id === v.id ? 1 : 0.4}
            />

            {showXAxisLabel && (
              <Text
                fill={white}
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
            )}
          </React.Fragment>
        ))}
      </Svg>
    </Animated.View>
  )
}

export default BarChart
