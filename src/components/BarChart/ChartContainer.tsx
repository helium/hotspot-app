/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { BoxProps } from '@shopify/restyle'
import Chart from './Chart'
import { ChartData } from './types'
import { useColors } from '../../theme/themeHooks'
import Box from '../Box'
import { Theme } from '../../theme/theme'

type Props = BoxProps<Theme> & {
  height: number
  data: ChartData[]
  onFocus: (data: ChartData | null) => void
  showXAxisLabel?: boolean
  upColor?: string
  downColor?: string
  labelColor?: string
  loading?: boolean
}

const ChartContainer = ({
  data,
  onFocus,
  showXAxisLabel,
  upColor,
  downColor,
  labelColor,
  loading,
  ...boxProps
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
    return <ActivityIndicator size="small" color={colors.grayMain} />
  }

  return (
    <Box onLayout={handleLayout} {...boxProps}>
      {width > 0 && (
        <Chart
          width={width}
          height={boxProps.height}
          data={data}
          onFocus={onFocus}
          showXAxisLabel={showXAxisLabel}
          upColor={upColor}
          downColor={downColor}
          labelColor={labelColor}
        />
      )}
    </Box>
  )
}

export default memo(ChartContainer)
