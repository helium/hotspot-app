import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import Svg, { Text, Rect } from 'react-native-svg'
import { PanResponder, Animated, GestureResponderEvent } from 'react-native'
import { maxBy, clamp, max, some } from 'lodash'
import { triggerImpact } from '../../utils/haptic'
import { ChartData } from './types'
import { useColors } from '../../theme/themeHooks'

// TODO
// animate in?

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

  // trigger haptic feedback when the focused bar changes
  useEffect(() => {
    if (focusedBar) {
      triggerImpact()
    }
    onFocus(focusedBar)
  }, [focusedBar, onFocus])

  // support charts that have no down values
  const hasDownBars = useMemo(() => some(data, ({ down }) => down > 0), [data])

  // pixel value of the height of x axis labels
  const bottomOffset = useMemo(() => (showXAxisLabel ? 20 : 0), [
    showXAxisLabel,
  ])

  // pixel value of bar width derived from container width and number of bars
  const barWidth = useMemo(() => width / (data.length + data.length - 1), [
    width,
    data.length,
  ])

  // min bar height is the same as bar width to form circles
  const minBarHeight = useMemo(() => barWidth, [barWidth])

  // the pixel value of the space between up and down bars
  const barGap = useMemo(() => (hasDownBars ? barWidth / 1.5 : 0), [
    hasDownBars,
    barWidth,
  ])

  // raw max up value
  const maxUp = useMemo(() => maxBy(data, 'up')?.up || minBarHeight, [
    data,
    minBarHeight,
  ])

  // raw max down value
  const maxDown = useMemo(() => maxBy(data, 'down')?.down || minBarHeight, [
    data,
    minBarHeight,
  ])

  // scaling factor used to turn raw values into pixel height values
  const vScale = useMemo(() => {
    const maxVerticalValue = hasDownBars ? maxUp + maxDown : maxUp
    const usableHeight = height - bottomOffset - barGap
    return usableHeight / maxVerticalValue
  }, [height, bottomOffset, hasDownBars, maxUp, maxDown, barGap])

  // pixel value of the tallest up bar
  const maxUpBarHeight = useMemo(() => {
    return max([maxUp * vScale, minBarHeight]) || 0
  }, [maxUp, minBarHeight, vScale])

  const barHeight = useCallback(
    (value: number | undefined): number => {
      if (value === 0 || value === undefined) return 0
      if (maxUpBarHeight === minBarHeight) {
        return max([value * vScale - minBarHeight, minBarHeight]) || 0
      }
      return max([value * vScale, minBarHeight]) || 0
    },
    [minBarHeight, vScale, maxUpBarHeight],
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
          <React.Fragment key={`frag-${v.id}`}>
            <Rect
              x={barWidth * (2 * i)}
              y={maxUpBarHeight - barHeight(v?.up)}
              rx={barWidth / 2}
              width={barWidth}
              height={barHeight(v?.up)}
              fill={upColor || greenBright}
              opacity={!focusedBar || focusedBar?.id === v.id ? 1 : 0.4}
            />

            {hasDownBars && (
              <Rect
                x={barWidth * (2 * i)}
                y={maxUpBarHeight + barGap}
                rx={barWidth / 2}
                width={barWidth}
                height={barHeight(v?.down)}
                fill={downColor || blueBright}
                opacity={!focusedBar || focusedBar?.id === v.id ? 1 : 0.4}
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
                opacity={focusedBar && focusedBar?.id === v.id ? 1 : 0.4}
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
