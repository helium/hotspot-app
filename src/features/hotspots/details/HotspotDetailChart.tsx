import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChartData } from '../../../components/BarChart/types'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ChartContainer from '../../../components/BarChart/ChartContainer'

type Props = {
  title: string
  number?: string
  change?: string
  percentage?: number
  data: ChartData[]
  color: string
}
const HotspotDetailChart = ({
  title,
  number,
  change,
  percentage,
  data,
  color,
}: Props) => {
  const { t } = useTranslation()
  const [focusedData, setFocusedData] = useState<ChartData | null>()
  const onFocus = (chartData: ChartData | null) => {
    setFocusedData(chartData)
  }
  return (
    <Box marginBottom="m">
      <Text fontSize={16} color="black" marginVertical="s">
        {title}
      </Text>
      <Box
        backgroundColor="grayBox"
        padding="l"
        borderRadius="m"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {percentage ? (
          <Box>
            <Text fontSize={12} color="grayLightText" marginBottom="s">
              {t('hotspot_details.pass_rate')}
            </Text>
            <Text variant="light" fontSize={34} color="black" marginBottom="s">
              {`${focusedData ? focusedData.up : percentage}%`}
            </Text>
          </Box>
        ) : (
          <Box>
            <Text variant="light" fontSize={34} color="black" marginBottom="s">
              {focusedData ? focusedData.up : number}
            </Text>
            <Box
              style={{ backgroundColor: color }}
              padding="xs"
              borderRadius="s"
              alignSelf="baseline"
            >
              <Text color="white" fontWeight="bold">
                {change}
              </Text>
            </Box>
          </Box>
        )}
        <Box paddingStart="l" width="65%">
          <ChartContainer
            height={75}
            data={data}
            onFocus={onFocus}
            showDays={false}
            upColor={color}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default HotspotDetailChart
