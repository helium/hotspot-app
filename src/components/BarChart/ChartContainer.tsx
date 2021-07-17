/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useState } from 'react'
import { BoxProps } from '@shopify/restyle'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Chart from './Chart'
import { ChartData } from './types'
import Box from '../Box'
import { Theme } from '../../theme/theme'

type Props = BoxProps<Theme> & {
  height: number
  data?: ChartData[] | null
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

  const handleLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setWidth(event.nativeEvent.layout.width)
    },
    [],
  )

  if (loading) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item height={boxProps.height} width={width} />
      </SkeletonPlaceholder>
    )
  }

  return (
    <Box onLayout={handleLayout} justifyContent="center" {...boxProps}>
      {width > 0 && data && !loading && (
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
