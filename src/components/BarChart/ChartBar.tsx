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
  barGap: number
  maxUpBarHeight: number
  focusedBar: ChartData | null
  labelColor: string
  height: number
  data: ChartData
}

const ChartBar = ({
  index,
  showXAxisLabel,
  hasDownBars,
  barWidth,
  barHeight,
  upColor,
  barGap,
  focusedBar,
  downColor,
  labelColor,
  height,
  maxUpBarHeight,
  data,
}: Props) => {
  const showPlaceholderCircle = useMemo(
    () => data.up === 0 && data.down === 0,
    [data],
  )

  const opacity = useMemo(() => {
    if (showPlaceholderCircle) return 0.1
    return !focusedBar || focusedBar?.id === data.id ? 1 : 0.4
  }, [data.id, focusedBar, showPlaceholderCircle])

  return (
    <>
      <Rect
        x={barWidth * (2 * index)}
        y={maxUpBarHeight - barHeight(data.up)}
        rx={barWidth / 2}
        width={barWidth}
        height={barHeight(data.up)}
        fill={upColor}
        opacity={opacity}
      />

      {hasDownBars && (
        <Rect
          x={barWidth * (2 * index)}
          y={maxUpBarHeight + barGap}
          rx={barWidth / 2}
          width={barWidth}
          height={barHeight(data.down)}
          fill={downColor}
          opacity={opacity}
        />
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
