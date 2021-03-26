import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { isEqual } from 'lodash'
import { useSelector } from 'react-redux'
import { add } from 'date-fns'
import ChartContainer from './ChartContainer'
import CarotLeft from '../../assets/images/carot-left.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import Box from '../Box'
import Text from '../Text'
import { ChartData, ChartRange } from './types'
import useHaptic from '../../utils/useHaptic'
import { useColors } from '../../theme/themeHooks'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import accountSlice, {
  fetchActivityChart,
} from '../../store/account/accountSlice'
import useCurrency from '../../utils/useCurrency'
import DateModule from '../../utils/DateModule'

type Props = {
  height: number
}

const WalletChart = ({ height }: Props) => {
  const dispatch = useAppDispatch()
  const { triggerImpact } = useHaptic()
  const {
    account: { activityChart, activityChartRange },
    activity: { filter },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state, selectorIsEqual)

  const { hntToDisplayVal } = useCurrency()
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const [up, setUp] = useState('')
  const [down, setDown] = useState('')

  useEffect(() => {
    const setValues = async () => {
      const u = await hntToDisplayVal(focusedData?.up || 0)
      const d = await hntToDisplayVal(focusedData?.down || 0)
      setUp(u)
      setDown(d)
    }
    setValues()
  }, [focusedData?.down, focusedData?.up, hntToDisplayVal])
  const [dataRange, setDataRange] = useState('')

  const data = useMemo(() => activityChart[activityChartRange].data, [
    activityChart,
    activityChartRange,
  ])

  useEffect(() => {
    dispatch(
      fetchActivityChart({ range: activityChartRange, filterType: filter }),
    )
  }, [dispatch, filter, activityChartRange, blockHeight])

  const headerHeight = 30
  const padding = 20
  const chartHeight = useMemo(() => height - headerHeight - padding, [height])
  const containerStyle = useMemo(
    () => ({
      paddingVertical: padding / 2,
    }),
    [],
  )

  const changeTimeframe = useCallback(
    (range: ChartRange) => () => {
      dispatch(accountSlice.actions.setActivityChartRange(range))
      triggerImpact()
    },
    [dispatch, triggerImpact],
  )

  const handleFocusData = useCallback(
    async (chartData: ChartData | null) => {
      setFocusedData(chartData)

      if (!chartData?.timestamp || activityChartRange !== 'monthly') return

      const startDate = new Date(chartData.timestamp)
      const endDate = add(startDate, { days: 29 })

      const start = await DateModule.formatDate(chartData.timestamp, 'MMM d')
      const end = await DateModule.formatDate(endDate.toISOString(), 'MMM d')
      setDataRange(`${start} - ${end}`)
    },
    [activityChartRange],
  )

  const showDataRange = useMemo(
    () => activityChartRange === 'monthly' && !!focusedData,
    [activityChartRange, focusedData],
  )

  const { greenBright, blueBright } = useColors()

  return (
    <Box justifyContent="space-around" style={containerStyle}>
      <Box
        flexDirection="row"
        height={headerHeight}
        paddingBottom="s"
        justifyContent="flex-end"
        alignItems="center"
      >
        {focusedData && (
          <>
            <CarotLeft
              width={12}
              height={12}
              stroke={greenBright}
              strokeWidth={2}
            />
            <Text
              variant="body2"
              fontSize={16}
              maxFontSizeMultiplier={1.1}
              marginLeft="xxs"
              marginRight="xs"
            >
              {up}
            </Text>

            <CarotRight color={blueBright} width={12} height={12} />
            <Text
              variant="body1"
              maxFontSizeMultiplier={1.1}
              fontSize={16}
              marginLeft="xs"
              flex={1}
            >
              {down}
            </Text>
          </>
        )}
        {!showDataRange && (
          <>
            <TouchableWithoutFeedback onPress={changeTimeframe('daily')}>
              <Text
                variant="body1"
                maxFontSizeMultiplier={1.1}
                paddingRight="m"
                fontSize={16}
                opacity={activityChartRange === 'daily' ? 1 : 0.3}
              >
                14D
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={changeTimeframe('weekly')}>
              <Text
                paddingRight="m"
                maxFontSizeMultiplier={1.1}
                variant="body1"
                fontSize={16}
                opacity={activityChartRange === 'weekly' ? 1 : 0.3}
              >
                12W
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={changeTimeframe('monthly')}>
              <Text
                maxFontSizeMultiplier={1.1}
                fontSize={16}
                variant="body1"
                opacity={activityChartRange === 'monthly' ? 1 : 0.3}
              >
                12M
              </Text>
            </TouchableWithoutFeedback>
          </>
        )}
        {showDataRange && (
          <Text
            maxWidth={150}
            variant="body2"
            adjustsFontSizeToFit
            numberOfLines={1}
            color="white"
            fontSize={16}
            maxFontSizeMultiplier={1}
          >
            {dataRange}
          </Text>
        )}
      </Box>
      {data.length === 0 && (
        <Box
          height={chartHeight}
          width="100%"
          justifyContent="center"
          position="absolute"
        >
          <ActivityIndicator color="gray" />
        </Box>
      )}
      <ChartContainer
        height={chartHeight}
        data={data}
        onFocus={handleFocusData}
        showXAxisLabel={activityChartRange !== 'monthly'}
      />
    </Box>
  )
}

const selectorIsEqual = (prev: RootState, next: RootState) => {
  const activityChartEqual = isEqual(
    prev.account.activityChart,
    next.account.activityChart,
  )
  const rangeEqual =
    prev.account.activityChartRange === next.account.activityChartRange
  const filterEqual = prev.activity.filter === next.activity.filter
  const heightEqual =
    prev.heliumData.blockHeight === next.heliumData.blockHeight

  return activityChartEqual && rangeEqual && filterEqual && heightEqual
}

export default memo(WalletChart)
