import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import Svg, { Text, Rect } from 'react-native-svg'
import { PanResponder, Animated, GestureResponderEvent } from 'react-native'
import { maxBy, clamp, max, some } from 'lodash'
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
  labelColor?: string
}

const BarChart = ({
  width,
  height,
  data,
  onFocus,
  showXAxisLabel = true,
  labelColor,
  upColor,
  downColor,
}: Props) => {
  const [focusedBar, setFocusedBar] = useState<ChartData | null>(null)
  const { greenBright, blueBright, white } = useColors()
  const barOffset = useMemo(() => (showXAxisLabel ? 20 : 0), [showXAxisLabel])

  // trigger haptic feedback when the focused bar changes
  useEffect(() => {
    if (focusedBar) {
      triggerImpact()
    }
    onFocus(focusedBar)
  }, [focusedBar, onFocus])

  // width 366 hasDownBars true barWidth 13.555555555555555
  // minBarHeight 13.555555555555555 maxUp 119.04227876
  // maxDown 13.555555555555555 maxBarHeight 141.63487135259257
  // vScale 1.0873028550760293

  // SVG maths
  const barWidth = useMemo(() => width / (data.length + data.length - 1), [
    width,
    data.length,
  ])
  const minBarHeight = useMemo(() => barWidth, [barWidth])
  const maxUp = useMemo(() => maxBy(data, 'up')?.up || minBarHeight, [
    data,
    minBarHeight,
  ])
  const maxDown = useMemo(() => maxBy(data, 'down')?.down || minBarHeight, [
    data,
    minBarHeight,
  ])
  const hasDownBars = useMemo(() => some(data, ({ down }) => down > 0), [data])
  const maxBarHeight = useMemo(
    () => (hasDownBars ? maxUp + barWidth / 1.5 + maxDown : maxUp),
    [hasDownBars, maxUp, barWidth, maxDown],
  )
  const vScale = useMemo(() => (height - barOffset) / maxBarHeight, [
    height,
    barOffset,
    maxBarHeight,
  ])

  // console.log(
  //   'width',
  //   width,
  //   'hasDownBars',
  //   hasDownBars,
  //   'barWidth',
  //   barWidth,
  //   'minBarHeight',
  //   minBarHeight,
  //   'maxUp',
  //   maxUp,
  //   'maxDown',
  //   maxDown,
  //   'maxBarHeight',
  //   maxBarHeight,
  //   'vScale',
  //   vScale,
  // )

  const barHeight = useCallback(
    (value: number | undefined): number => {
      if (value === 0 || value === undefined) return 0
      return max([value * vScale, minBarHeight]) || 0
    },
    [minBarHeight, vScale],
  )

  // maps x coordinates to elements in our data
  const findDataIndex = useCallback(
    (xCoord: number): number => {
      return clamp(Math.floor(xCoord / (barWidth * 2)), 0, data.length)
    },
    [barWidth, data.length],
  )

  // handle initial touch events to the chart that haven't
  // yet been registered by the pan responder
  const handleTouchStart = useCallback(
    (evt: GestureResponderEvent) => {
      const dataIndex = findDataIndex(evt.nativeEvent.locationX)
      setFocusedBar(data[dataIndex])
    },
    [data, findDataIndex],
  )

  const handleTouchEnd = useCallback(() => {
    setFocusedBar(null)
  }, [])

  // pan responder is responsible for the slide interaction
  const panResponder = useMemo(
    () =>
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
    [data, findDataIndex],
  )

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
          <React.Fragment key={`frag-${v.timestamp}`}>
            <Rect
              x={barWidth * (2 * i)}
              y={maxUp * vScale - barHeight(v?.up)}
              rx={barWidth / 2}
              width={barWidth}
              height={barHeight(v?.up)}
              fill={upColor || greenBright}
              opacity={
                !focusedBar || focusedBar?.timestamp === v.timestamp ? 1 : 0.4
              }
            />

            {hasDownBars && (
              <Rect
                x={barWidth * (2 * i)}
                y={maxUp * vScale + barWidth / 1.5}
                rx={barWidth / 2}
                width={barWidth}
                height={barHeight(v?.down)}
                fill={downColor || blueBright}
                opacity={
                  !focusedBar || focusedBar?.timestamp === v.timestamp ? 1 : 0.4
                }
              />
            )}

            {showXAxisLabel && (
              <Text
                fill={labelColor || white}
                stroke="none"
                fontSize="12"
                fontWeight={300}
                x={barWidth * (2 * i) + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                opacity={
                  focusedBar && focusedBar?.timestamp === v.timestamp ? 1 : 0.4
                }
              >
                {v.label}
              </Text>
            )}
          </React.Fragment>
        ))}
      </Svg>
    </Animated.View>
  )
}

export default memo(BarChart)
