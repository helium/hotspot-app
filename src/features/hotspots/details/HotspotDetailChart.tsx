import React, { useCallback, useMemo, useState, useEffect } from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { sumBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-async-hook'
import { addMinutes, startOfYesterday, subDays } from 'date-fns'
import { ChartData } from '../../../components/BarChart/types'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ChartContainer from '../../../components/BarChart/ChartContainer'
import { useBorderRadii, useColors } from '../../../theme/themeHooks'
import animateTransition from '../../../utils/animateTransition'
import { locale } from '../../../utils/i18n'
import DateModule from '../../../utils/DateModule'
import TimelinePicker from './TimelinePicker'
import { NetworkHotspotEarnings } from '../../../store/rewards/rewardsSlice'

type Props = {
  title: string
  number?: string
  change?: number
  data: ChartData[]
  networkHotspotEarnings: NetworkHotspotEarnings[]
  loading?: boolean
  timelineIndex: number
  timelineValue: number
  onTimelineChanged: (value: number, index: number) => void
}

const HotspotDetailChart = ({
  title,
  number,
  change = 0,
  data,
  networkHotspotEarnings,
  loading: propsLoading,
  timelineIndex,
  timelineValue,
  onTimelineChanged,
}: Props) => {
  const { black, grayLight, purpleMain, greenOnline } = useColors()
  const { l } = useBorderRadii()
  const [loading, setLoading] = useState(propsLoading)
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const [timeRange, setTimeRange] = useState('')
  const [
    focusedNetworkData,
    setFocusedNetworkData,
  ] = useState<ChartData | null>(null)
  const { t } = useTranslation()

  const findNetworkEarningForData = useCallback(
    (d: ChartData) => {
      const date = d.label?.split('T')[0] // yyyy-mm-dd format
      const hotspotEarnings = networkHotspotEarnings.find(
        (e) => e.date === date,
      )
      return parseFloat(hotspotEarnings?.avg_rewards?.toFixed(2) || '0')
    },
    [networkHotspotEarnings],
  )

  const networkData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        up: findNetworkEarningForData(d),
      })),
    [data, findNetworkEarningForData],
  )

  useAsync(async () => {
    const yesterday = startOfYesterday()
    const utcOffset = yesterday.getTimezoneOffset()
    const end = addMinutes(yesterday, utcOffset)
    const endStr = await DateModule.formatDate(end.toISOString(), 'MMM d')
    const start = subDays(end, timelineValue - 1)
    const startStr = await DateModule.formatDate(start.toISOString(), 'MMM d')
    const rangeStr = `${startStr} - ${endStr}`
    setTimeRange(rangeStr)
  }, [timelineValue])

  const networkAvgTotal = useMemo(() => {
    if (timelineValue > networkHotspotEarnings.length) {
      return t('generic.not_available')
    }
    const totalAvg = sumBy(
      networkData.slice(0, timelineValue),
      (d) => d.up || 0,
    )?.toFixed(2)
    return totalAvg || t('generic.not_available')
  }, [networkData, networkHotspotEarnings.length, t, timelineValue])

  useEffect(() => {
    if (propsLoading === loading) return

    animateTransition('HotspotDetailChart.LoadingChange', {
      enabledOnAndroid: false,
    })

    setLoading(propsLoading)
  }, [loading, propsLoading])

  const onFocus = useCallback(
    async (chartData: ChartData | null, stackedChartData: ChartData | null) => {
      animateTransition('HotspotDetailChart.OnFocus', {
        enabledOnAndroid: false,
      })

      if (!chartData) {
        setFocusedData(null)
        setFocusedNetworkData(null)
        return
      }

      const label = await DateModule.formatDate(
        chartData.label,
        chartData.showTime ? 'MMM d h:mma' : 'EEE MMM d',
      )
      setFocusedData({ ...chartData, label })
      if (stackedChartData) {
        setFocusedNetworkData({ ...stackedChartData, label })
      }
    },
    [],
  )

  const currentFocusedNetworkAvg = useMemo(() => {
    if (focusedNetworkData && focusedNetworkData.up !== 0) {
      return focusedNetworkData.up.toLocaleString(locale)
    }
    return t('generic.not_available')
  }, [focusedNetworkData, t])

  const body = useMemo(() => {
    if (loading)
      return (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            height={400}
            width="100%"
            borderRadius={l}
          />
        </SkeletonPlaceholder>
      )

    return (
      <Box>
        <Box
          paddingVertical="s"
          backgroundColor={focusedData ? 'grayBoxDark' : undefined}
          paddingHorizontal="l"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text
              color="purpleMediumText"
              variant="medium"
              fontSize={15}
              maxFontSizeMultiplier={1.2}
            >
              {title}
            </Text>
            <Text
              variant="body3"
              color="purpleMediumText"
              fontSize={13}
              maxFontSizeMultiplier={1.1}
            >
              {focusedData ? focusedData.label : timeRange}
            </Text>
          </Box>
          <Box>
            <Text
              color="purpleMediumText"
              variant="regular"
              fontSize={13}
              lineHeight={15}
              maxFontSizeMultiplier={1.2}
            >
              {t('hotspot_details.your_earnings')}
            </Text>
            <Box flexDirection="row" alignItems="center">
              <Box
                height={9}
                width={9}
                backgroundColor={change >= 0 ? 'greenOnline' : 'purpleMain'}
                borderRadius="round"
                marginRight="xs"
              />
              <Text
                variant="medium"
                color="purpleMediumText"
                fontSize={13}
                maxFontSizeMultiplier={1.1}
              >
                {focusedData ? focusedData.up.toLocaleString(locale) : number}
              </Text>
            </Box>
          </Box>
          <Box>
            <Text
              color="purpleMediumText"
              variant="regular"
              fontSize={13}
              lineHeight={15}
              maxFontSizeMultiplier={1.2}
            >
              {t('hotspot_details.network_avg')}
            </Text>
            <Box flexDirection="row" alignItems="center">
              <Box
                height={9}
                width={9}
                backgroundColor="grayLight"
                borderRadius="round"
                marginRight="xs"
              />
              <Text
                variant="medium"
                color="purpleMediumText"
                fontSize={13}
                maxFontSizeMultiplier={1.1}
              >
                {focusedNetworkData
                  ? currentFocusedNetworkAvg
                  : networkAvgTotal}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box
          paddingHorizontal="l"
          paddingVertical="m"
          flexDirection="row"
          justifyContent={loading ? 'center' : 'space-between'}
          alignItems="center"
        >
          <Box width="100%">
            <ChartContainer
              height={100}
              data={data}
              stackedData={networkData}
              onFocus={onFocus}
              showXAxisLabel={false}
              upColor={change >= 0 ? greenOnline : purpleMain}
              downColor={grayLight}
              labelColor={black}
            />
          </Box>
        </Box>

        <Box flexDirection="row" paddingHorizontal="l" alignItems="center">
          {change !== undefined && !focusedData && (
            <Text
              color={change < 0 ? 'purpleMain' : 'greenOnline'}
              variant="regular"
              fontSize={13}
              maxFontSizeMultiplier={1.1}
            >
              {`${change < 0 ? '' : '+'}${change.toLocaleString(locale, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}%`}
            </Text>
          )}
          <TimelinePicker
            index={timelineIndex}
            onTimelineChanged={onTimelineChanged}
          />
        </Box>
      </Box>
    )
  }, [
    black,
    change,
    currentFocusedNetworkAvg,
    data,
    focusedData,
    focusedNetworkData,
    grayLight,
    greenOnline,
    l,
    loading,
    networkAvgTotal,
    networkData,
    number,
    onFocus,
    onTimelineChanged,
    purpleMain,
    t,
    timeRange,
    timelineIndex,
    title,
  ])

  return (
    <Box backgroundColor="grayBoxLight" paddingTop="xl" paddingBottom="l">
      {body}
    </Box>
  )
}

export default HotspotDetailChart
