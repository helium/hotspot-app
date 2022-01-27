import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Svg from 'react-native-svg'
import { clamp, max, maxBy, some } from 'lodash'
import {
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { Animated, GestureResponderEvent } from 'react-native'
import useHaptic from '../../utils/useHaptic'
import { ChartData } from './types'
import { useColors } from '../../theme/themeHooks'
import usePrevious from '../../utils/usePrevious'
import ChartBar from './ChartBar'

type Props = {
  width: number
  height: number
  data: ChartData[]
  stackedData?: ChartData[]
  onFocus: (data: ChartData | null, stackedData: ChartData | null) => void
  showXAxisLabel?: boolean
  upColor?: string
  downColor?: string
  stackedUpColor?: string
  stackedDownColor?: string
  labelColor?: string
}

const BarChart = ({
  width,
  height,
  data,
  stackedData = [],
  onFocus,
  showXAxisLabel = true,
  labelColor,
  upColor,
  downColor,
  stackedUpColor,
  stackedDownColor,
}: Props) => {
  const [focusedBar, setFocusedBar] = useState<ChartData | null>(null)
  const [focusedStackedBar, setFocusedStackedBar] = useState<ChartData | null>(
    null,
  )
  const prevFocusedBar = usePrevious(focusedBar)
  const { greenBright, blueBright, white, grayLight } = useColors()
  const { triggerImpact } = useHaptic()

  // trigger haptic feedback when the focused bar changes
  useEffect(() => {
    if (focusedBar) {
      triggerImpact()
    }

    if (prevFocusedBar !== undefined && prevFocusedBar !== focusedBar) {
      onFocus(focusedBar, focusedStackedBar)
    }
  }, [focusedBar, focusedStackedBar, onFocus, prevFocusedBar, triggerImpact])

  const hasStackedData = useMemo(
    () => stackedData !== undefined && stackedData.length > 0,
    [stackedData],
  )

  const allData = useMemo(() => [...data, ...stackedData], [data, stackedData])

  // support charts that have no down values
  const hasDownBars = useMemo(() => some(allData, ({ down }) => down > 0), [
    allData,
  ])

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
  const minBarHeight = useMemo(() => barWidth / (hasStackedData ? 2 : 1), [
    barWidth,
    hasStackedData,
  ])

  // the pixel value of the space between up and down bars
  const barGap = useMemo(() => (hasDownBars ? barWidth / 1.5 : 0), [
    hasDownBars,
    barWidth,
  ])

  // raw max up value
  const maxUp = useMemo(() => maxBy(allData, 'up')?.up || minBarHeight, [
    allData,
    minBarHeight,
  ])

  // raw max down value
  const maxDown = useMemo(() => maxBy(allData, 'down')?.down || minBarHeight, [
    allData,
    minBarHeight,
  ])

  // scaling factor used to turn raw values into pixel height values
  const vScale = useMemo(() => {
    const maxVerticalValue = hasDownBars ? maxUp + maxDown : maxUp
    const usableHeight = height - bottomOffset - barGap
    return usableHeight / maxVerticalValue
  }, [height, bottomOffset, hasDownBars, maxUp, maxDown, barGap])

  // pixel value of the tallest down bar
  const maxDownBarHeight = useMemo(() => {
    return max([maxDown * vScale, minBarHeight]) || 0
  }, [maxDown, minBarHeight, vScale])

  // pixel value of the tallest up bar
  const maxUpBarHeight = useMemo(() => {
    if (maxDownBarHeight === minBarHeight) {
      return max([maxUp * vScale - minBarHeight, minBarHeight]) || 0
    }
    return max([maxUp * vScale, minBarHeight]) || 0
  }, [maxDownBarHeight, maxUp, minBarHeight, vScale])

  const barHeight = useCallback(
    (value: number | undefined): number => {
      if (value === 0 || value === undefined) return minBarHeight
      if (
        maxUpBarHeight === minBarHeight ||
        maxDownBarHeight === minBarHeight
      ) {
        return max([value * vScale - minBarHeight, minBarHeight]) || 0
      }
      return max([value * vScale, minBarHeight]) || 0
    },
    [minBarHeight, vScale, maxUpBarHeight, maxDownBarHeight],
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
      setFocusedStackedBar(stackedData[dataIndex])
    },
    [data, findDataIndex, stackedData],
  )

  const handleTouchEnd = useCallback(() => {
    setFocusedBar(null)
    setFocusedStackedBar(null)
  }, [])

  // pan responder is responsible for the slide interaction
  const onPanEvent = useCallback(
    (event: { nativeEvent: PanGestureHandlerEventPayload }) => {
      const dataIndex = findDataIndex(event.nativeEvent.x)
      setFocusedBar(data[dataIndex])
      setFocusedStackedBar(stackedData[dataIndex])
    },
    [data, findDataIndex, stackedData],
  )

  const barStyle = useMemo(
    () => ({
      backgroundColor: 'rgba(255,0,0,0)',
      width,
      height,
    }),
    [width, height],
  )

  const activeOffsetX = useMemo(() => [-5, 5], []) // only activate the gesture if x moves 5 pixels

  return (
    <PanGestureHandler
      activeOffsetX={activeOffsetX}
      onGestureEvent={onPanEvent}
      onEnded={handleTouchEnd}
    >
      <Animated.View
        style={barStyle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Svg height="100%" width="100%">
          {data.map((v, i) => (
            <ChartBar
              key={`frag-${v.id}`}
              index={i}
              showXAxisLabel={showXAxisLabel}
              hasDownBars={hasDownBars}
              barWidth={barWidth}
              barHeight={barHeight}
              upColor={upColor || greenBright}
              stackedUpColor={stackedUpColor || grayLight}
              barGap={barGap}
              focusedBar={focusedBar}
              downColor={downColor || blueBright}
              stackedDownColor={stackedDownColor || grayLight}
              labelColor={labelColor || white}
              height={height}
              maxUpBarHeight={maxUpBarHeight}
              data={v}
              stackedData={stackedData[i]}
            />
          ))}
        </Svg>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default memo(BarChart)
