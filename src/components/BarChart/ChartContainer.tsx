import React, { memo, useCallback, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Chart from './Chart'
import { ChartData } from './types'
import { useColors } from '../../theme/themeHooks'

type Props = {
  height: number
  data: ChartData[]
  onFocus: (data: ChartData | null) => void
  showXAxisLabel?: boolean
  upColor?: string
  downColor?: string
  labelColor?: string
  paddingTop?: number
  loading?: boolean
}

const ChartContainer = ({
  height,
  data,
  onFocus,
  showXAxisLabel,
  upColor,
  downColor,
  labelColor,
  paddingTop,
  loading,
}: Props) => {
  const [width, setWidth] = useState(0)
  const colors = useColors()

  const handleLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setWidth(event.nativeEvent.layout.width)
    },
    [],
  )

  if (loading) {
    return (
      <ActivityIndicator
        style={{ height, paddingTop }}
        size="small"
        color={colors.grayMain}
      />
    )
  }

  return (
    <View onLayout={handleLayout} style={{ height, paddingTop }}>
      {width > 0 && (
        <Chart
          width={width}
          height={height}
          data={data}
          onFocus={onFocus}
          showXAxisLabel={showXAxisLabel}
          upColor={upColor}
          downColor={downColor}
          labelColor={labelColor}
        />
      )}
    </View>
  )
}

export default memo(ChartContainer)
