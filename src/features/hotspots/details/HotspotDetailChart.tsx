import React, { useCallback, useMemo, useState, useEffect } from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { sumBy } from 'lodash'
import { useTranslation } from 'react-i18next'
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
  subtitle?: string
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
  subtitle,
  loading: propsLoading,
  timelineIndex,
  timelineValue,
  onTimelineChanged,
}: Props) => {
  const { black, grayLight, purpleMain, greenOnline } = useColors()
  const { l } = useBorderRadii()
  const [loading, setLoading] = useState(propsLoading)
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
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
      <>
        <Box flex={1}>
          <Box flexDirection="row" justifyContent="space-between">
            <Text
              color="grayLightText"
              fontSize={16}
              maxFontSizeMultiplier={1.2}
            >
              {title}
            </Text>
            <Text
              color="grayLightText"
              fontSize={16}
              maxFontSizeMultiplier={1.2}
            >
              {subtitle}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="flex-start">
            <Box>
              <Text
                variant="light"
                color="grayDarkText"
                fontSize={37}
                numberOfLines={1}
                adjustsFontSizeToFit
                maxFontSizeMultiplier={1}
              >
                {focusedData ? focusedData.up.toLocaleString(locale) : number}
              </Text>
              <Text
                variant="body3"
                color="grayLightText"
                numberOfLines={1}
                adjustsFontSizeToFit
                maxFontSizeMultiplier={1}
              >
                {t('hotspot_details.network_avg_rewards', {
                  amount: focusedNetworkData
                    ? currentFocusedNetworkAvg
                    : networkAvgTotal,
                })}
              </Text>
            </Box>

            <TimelinePicker
              flex={1}
              index={timelineIndex}
              onTimelineChanged={onTimelineChanged}
            />
          </Box>

          <Box flexDirection="row" flex={1} justifyContent="flex-end">
            {change !== undefined && !focusedData ? (
              <Text
                color={change < 0 ? 'purpleMain' : 'greenOnline'}
                variant="bold"
                fontSize={13}
                maxFontSizeMultiplier={1.1}
              >
                {`${change < 0 ? '' : '+'}${change.toLocaleString(locale, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}%`}
              </Text>
            ) : (
              <Text
                variant="body3"
                color="grayDarkText"
                fontSize={13}
                maxFontSizeMultiplier={1.1}
              >
                {focusedData ? focusedData.label : ''}
              </Text>
            )}
          </Box>
        </Box>
        <Box
          paddingTop="m"
          flexDirection="row"
          justifyContent={loading ? 'center' : 'space-between'}
          alignItems="center"
          marginBottom="xxs"
        >
          <Box width="100%" height={250}>
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
      </>
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
    subtitle,
    t,
    timelineIndex,
    title,
  ])

  return (
    <Box backgroundColor="grayBoxLight" paddingTop="xl" padding="l">
      {body}
    </Box>
  )
}

export default HotspotDetailChart
