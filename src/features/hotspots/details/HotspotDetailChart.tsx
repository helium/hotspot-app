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
    animateTransition(false)

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
      <>
        <Box
          height="100%"
          flex={3}
          paddingRight="s"
          justifyContent="space-between"
        >
          <Text
            variant="light"
            color="grayDarkText"
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
          {change !== undefined && !focusedData ? (
            <Box
              paddingHorizontal="xs"
              height={24}
              backgroundColor={change < 0 ? 'purpleMain' : 'greenOnline'}
              justifyContent="center"
              alignItems="center"
              borderRadius="s"
              alignSelf="baseline"
            >
              <Text
                color="white"
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
            >
              {focusedData ? focusedData.label : ''}
            </Text>
          )}
        </Box>

        <Box flex={5} alignSelf="flex-end">
          <ChartContainer
            height={68}
            data={data}
            onFocus={onFocus}
            showXAxisLabel={false}
            upColor={change >= 0 ? greenOnline : purpleMain}
            downColor={grayLight}
            labelColor={black}
          />
        </Box>
      </>
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
      backgroundColor="grayBox"
      paddingHorizontal="lx"
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
