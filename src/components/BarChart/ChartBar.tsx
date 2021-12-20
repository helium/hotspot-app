import React, { memo, useMemo } from 'react'

import { Rect, Text } from 'react-native-svg'
import { ChartData } from './types'

type Props = {
  index: number
  showXAxisLabel: boolean
  hasDownBars: boolean
  barWidth: number
  barHeight: (value: number | undefined) => number
  upColor: string
  downColor: string
  stackedUpColor: string
  stackedDownColor: string
  barGap: number
  maxUpBarHeight: number
  focusedBar: ChartData | null
  labelColor: string
  height: number
  data: ChartData
  stackedData: ChartData
}

const ChartBar = ({
  index,
  showXAxisLabel,
  hasDownBars,
  barWidth,
  barHeight,
  upColor,
  stackedUpColor,
  stackedDownColor,
  barGap,
  focusedBar,
  downColor,
  labelColor,
  height,
  maxUpBarHeight,
  data,
  stackedData,
}: Props) => {
  const hasStackedData = useMemo(() => stackedData !== undefined, [stackedData])

  const showPlaceholderCircle = useMemo(
    () => data.up === 0 && data.down === 0,
    [data],
  )

  const opacity = useMemo(() => {
    if (showPlaceholderCircle) return 0.1
    return !focusedBar || focusedBar?.id === data.id ? 1 : 0.4
  }, [data.id, focusedBar, showPlaceholderCircle])

  const stackedOpacity = useMemo(() => {
    if (stackedData?.up === 0 && stackedData?.down === 0) return 0.1
    return !focusedBar || focusedBar?.id === data.id ? 1 : 0.4
  }, [data.id, focusedBar, stackedData?.down, stackedData?.up])

  return (
    <>
      <Rect
        x={barWidth * (2 * index)}
        y={maxUpBarHeight - barHeight(data.up)}
        rx={hasStackedData ? barWidth / 4 : barWidth / 2}
        width={hasStackedData ? barWidth / 2 : barWidth}
        height={barHeight(data.up)}
        fill={upColor}
        opacity={opacity}
      />

      {hasStackedData && (
        <Rect
          x={barWidth * (2 * index) + barWidth / 2}
          y={maxUpBarHeight - barHeight(stackedData.up)}
          rx={barWidth / 4}
          width={barWidth / 2}
          height={barHeight(stackedData.up)}
          fill={stackedUpColor}
          opacity={stackedOpacity}
        />
      )}

      {hasDownBars && (
        <>
          <Rect
            x={barWidth * (2 * index)}
            y={maxUpBarHeight + barGap}
            rx={hasStackedData ? barWidth / 4 : barWidth / 2}
            width={hasStackedData ? barWidth / 2 : barWidth}
            height={data.down === 0 ? 0 : barHeight(data.down)}
            fill={downColor}
            opacity={opacity}
          />

          {hasStackedData && (
            <Rect
              x={barWidth * (2 * index) + barWidth / 2}
              y={maxUpBarHeight + barGap}
              rx={barWidth / 4}
              width={barWidth}
              height={data.down === 0 ? 0 : barHeight(data.down)}
              fill={stackedDownColor}
              opacity={stackedOpacity}
            />
          )}
        </>
      )}

      {showXAxisLabel && (
        <Text
          fill={labelColor}
          stroke="none"
          fontSize="12"
          fontWeight={300}
          x={barWidth * (2 * index) + barWidth / 2}
          y={height - 4}
          textAnchor="middle"
          opacity={focusedBar && focusedBar?.id === data.id ? 1 : 0.4}
        >
          {data.label}
        </Text>
      )}
    </>
  )
}

export default memo(ChartBar)
