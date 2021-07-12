import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { ChartData } from '../../../components/BarChart/types'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ChartContainer from '../../../components/BarChart/ChartContainer'
import { useColors } from '../../../theme/themeHooks'
import animateTransition from '../../../utils/animateTransition'
import { locale } from '../../../utils/i18n'
import DateModule from '../../../utils/DateModule'

type Props = {
  title: string
  number?: string
  change?: number
  data: ChartData[]
  loading?: boolean
}

const HotspotDetailChart = ({
  title,
  number,
  change = 0,
  data,
  loading,
}: Props) => {
  const { black, grayLight, grayMain, purpleMain, greenOnline } = useColors()
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)

  const onFocus = useCallback(async (chartData: ChartData | null) => {
    animateTransition('HotspotDetailChart.OnFocus', { enabledOnAndroid: false })

    if (!chartData) {
      setFocusedData(null)
      return
    }

    const label = await DateModule.formatDate(
      chartData.label,
      chartData.showTime ? 'MMM d h:mma' : 'EEE MMM d',
    )
    setFocusedData({ ...chartData, label })
  }, [])

  const body = useMemo(() => {
    if (loading) return <ActivityIndicator size="small" color={grayMain} />

    return (
      <Box width="100%" height={250}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom="l"
        >
          <Box>
            <Text
              color="grayLightText"
              fontSize={16}
              maxFontSizeMultiplier={1.2}
            >
              {title}
            </Text>
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
          </Box>
          <Box
            height={26}
            flex={1}
            flexDirection="row"
            justifyContent="flex-end"
          >
            {change !== undefined && !focusedData ? (
              <Box
                paddingHorizontal="xs"
                height={24}
                justifyContent="center"
                alignItems="center"
                borderRadius="s"
                alignSelf="baseline"
                paddingTop="s"
              >
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
              </Box>
            ) : (
              <Text
                variant="body3"
                color="grayDarkText"
                padding="xs"
                adjustsFontSizeToFit
                maxFontSizeMultiplier={1.1}
                paddingTop="s"
              >
                {focusedData ? focusedData.label : ''}
              </Text>
            )}
          </Box>
        </Box>
        <ChartContainer
          height={100}
          data={data}
          onFocus={onFocus}
          showXAxisLabel={false}
          upColor={change >= 0 ? greenOnline : purpleMain}
          downColor={grayLight}
          labelColor={black}
        />
      </Box>
    )
  }, [
    black,
    change,
    data,
    focusedData,
    grayLight,
    grayMain,
    greenOnline,
    loading,
    number,
    onFocus,
    purpleMain,
    title,
  ])

  return (
    <Box
      backgroundColor="grayBoxLight"
      paddingHorizontal="l"
      paddingVertical="m"
      flexDirection="row"
      justifyContent={loading ? 'center' : 'space-between'}
      alignItems="center"
      height={154}
      marginBottom="xxs"
    >
      {body}
    </Box>
  )
}

export default HotspotDetailChart
