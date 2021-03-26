import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { ActivityIndicator, Platform } from 'react-native'
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
  percentage?: number
  data: ChartData[]
  loading?: boolean
  subTitle?: string
}

const PercentageBox = ({
  t,
  focusedData,
  percentage,
}: {
  t: TFunction
  focusedData: ChartData | null
  percentage: number
}) => (
  <>
    <Text variant="body3" color="grayLightText" marginBottom="s">
      {t('hotspot_details.pass_rate')}
    </Text>
    <Text
      variant="light"
      fontSize={32}
      color="black"
      marginBottom="s"
      maxFontSizeMultiplier={1}
    >
      {`${focusedData ? focusedData.up.toLocaleString(locale) : percentage}%`}
    </Text>
  </>
)

const NumberBox = ({
  negativeColor,
  positiveColor,
  number,
  focusedData,
  change,
}: {
  negativeColor: string
  positiveColor: string
  number?: string
  focusedData: ChartData | null
  change?: number
}) => (
  <>
    <Text
      variant="light"
      fontSize={32}
      maxFontSizeMultiplier={1}
      color="grayDarkText"
      marginBottom="s"
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {focusedData
        ? focusedData.up.toLocaleString(locale)
        : parseFloat(number || '0').toLocaleString(locale)}
    </Text>
    {change !== undefined && !focusedData ? (
      <Box
        style={{
          backgroundColor: change < 0 ? negativeColor : positiveColor,
        }}
        padding="xs"
        borderRadius="s"
        alignSelf="baseline"
      >
        <Text color="white" variant="body2Bold" maxFontSizeMultiplier={1.1}>
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
  </>
)

const HotspotDetailChart = ({
  title,
  number,
  change = 0,
  percentage,
  data,
  loading,
  subTitle,
}: Props) => {
  const { t } = useTranslation()
  const { black, grayLight, grayMain, purpleMain, greenOnline } = useColors()
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)

  const onFocus = useCallback(async (chartData: ChartData | null) => {
    if (Platform.OS === 'ios') {
      // this animation causes layout issues on Android
      animateTransition()
    }

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

  return (
    <Box marginBottom="m" paddingHorizontal="l">
      <Box
        flexDirection="row"
        alignItems="center"
        marginVertical="s"
        width="100%"
        marginEnd="s"
      >
        <Text variant="body1" color="black" maxFontSizeMultiplier={1.2}>
          {title}
        </Text>
        {subTitle && (
          <Text
            variant="body3"
            color="grayText"
            paddingLeft="xs"
            maxFontSizeMultiplier={1.2}
          >
            {subTitle}
          </Text>
        )}
      </Box>
      <Box
        backgroundColor="grayBox"
        padding="l"
        borderRadius="l"
        flexDirection="row"
        justifyContent={loading ? 'center' : 'space-between'}
        alignItems="center"
        height={136}
      >
        {loading ? (
          <ActivityIndicator size="small" color={grayMain} />
        ) : (
          <>
            <Box width="35%">
              {percentage ? (
                <PercentageBox
                  t={t}
                  percentage={percentage}
                  focusedData={focusedData}
                />
              ) : (
                <NumberBox
                  negativeColor={purpleMain}
                  positiveColor={greenOnline}
                  focusedData={focusedData}
                  number={number}
                  change={change}
                />
              )}
            </Box>
            <Box width="60%">
              <ChartContainer
                height={90}
                data={data}
                onFocus={onFocus}
                showXAxisLabel={false}
                upColor={change >= 0 ? greenOnline : purpleMain}
                downColor={grayLight}
                labelColor={black}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default HotspotDetailChart
