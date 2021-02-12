import React, { useEffect, useState, useMemo } from 'react'
import { ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { round } from 'lodash'
import { useSelector } from 'react-redux'
import ChartContainer from './ChartContainer'
import CarotLeft from '../../assets/images/carot-left.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import Box from '../Box'
import Text from '../Text'
import { ChartData, ChartRange } from './types'
import { triggerImpact } from '../../utils/haptic'
import { useColors } from '../../theme/themeHooks'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import { fetchRewardsChart } from '../../store/account/accountSlice'

type Props = {
  height: number
}

const WalletChart = ({ height }: Props) => {
  const dispatch = useAppDispatch()
  const {
    account: { rewardsChart },
  } = useSelector((state: RootState) => state)

  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const [timeframe, setTimeframe] = useState<ChartRange>('daily')

  const { data } = rewardsChart[timeframe]

  useEffect(() => {
    dispatch(fetchRewardsChart(timeframe))
  }, [dispatch, timeframe])

  const headerHeight = 30
  const padding = 20
  const chartHeight = height - headerHeight - padding

  const changeTimeframe = (range: ChartRange) => {
    setTimeframe(range)
    triggerImpact()
  }

  const handleFocusData = (chartData: ChartData | null): void => {
    setFocusedData(chartData)
  }

  const { greenBright } = useColors()

  const containerStyle = useMemo(() => ({ paddingVertical: padding / 2 }), [])

  return (
    <Box justifyContent="space-around" style={containerStyle}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        height={headerHeight}
      >
        <Box flexDirection="row" flex={1.5}>
          {focusedData && (
            <>
              <Box flexDirection="row" alignItems="center" marginRight="s">
                <CarotLeft
                  width={12}
                  height={12}
                  stroke={greenBright}
                  strokeWidth={2}
                />
                <Text variant="body2" marginLeft="xs">
                  {round(focusedData?.up, 2).toLocaleString()}
                </Text>
              </Box>

              <Box
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 50,
                }}
              >
                <CarotRight width={12} height={12} style={{ marginRight: 4 }} />
                <Text variant="body2" marginLeft="xs">
                  {round(focusedData?.down, 2).toLocaleString()}
                </Text>
              </Box>
            </>
          )}
        </Box>
        <Box flex={1} flexDirection="row" justifyContent="space-between">
          <TouchableWithoutFeedback onPress={() => changeTimeframe('daily')}>
            <Text variant="body1" opacity={timeframe === 'daily' ? 1 : 0.3}>
              14D
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeTimeframe('weekly')}>
            <Text variant="body1" opacity={timeframe === 'weekly' ? 1 : 0.3}>
              12W
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => changeTimeframe('monthly')}>
            <Text variant="body1" opacity={timeframe === 'monthly' ? 1 : 0.3}>
              12M
            </Text>
          </TouchableWithoutFeedback>
        </Box>
      </Box>
      {data.length === 0 && (
        <Box
          height={chartHeight}
          width="100%"
          justifyContent="center"
          position="absolute"
        >
          <ActivityIndicator />
        </Box>
      )}
      <ChartContainer
        height={chartHeight}
        data={data}
        onFocus={handleFocusData}
      />
    </Box>
  )
}

export default WalletChart
