import React from 'react'
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
              PASS RATE
            </Text>
            <Text variant="light" fontSize={34} color="black" marginBottom="s">
              {`${percentage}%`}
            </Text>
          </Box>
        ) : (
          <Box>
            <Text variant="light" fontSize={34} color="black" marginBottom="s">
              {number}
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
            onFocus={() => {}}
            showDays={false}
            upColor={color}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default HotspotDetailChart
