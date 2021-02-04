import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { ActivityIndicator } from 'react-native'
import { ChartData } from '../../../components/BarChart/types'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import ChartContainer from '../../../components/BarChart/ChartContainer'
import { useColors } from '../../../theme/themeHooks'
import animateTransition from '../../../utils/animateTransition'

type Props = {
  title: string
  number?: string
  change?: number
  percentage?: number
  data: ChartData[]
  color: string
  loading?: boolean
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
    <Text variant="light" fontSize={32} color="black" marginBottom="s">
      {`${focusedData ? focusedData.up : percentage}%`}
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
    <Text variant="light" fontSize={28} color="black" marginBottom="s">
      {focusedData ? focusedData.up : number}
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
        <Text color="white" variant="body2Bold">
          {`${change < 0 ? '' : '+'}${change.toFixed(2).toString()}%`}
        </Text>
      </Box>
    ) : null}
  </>
)

const HotspotDetailChart = ({
  title,
  number,
  change,
  percentage,
  data,
  color,
  loading,
}: Props) => {
  const { t } = useTranslation()
  const { redMedium, black, grayLight, grayMain } = useColors()
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const onFocus = (chartData: ChartData | null) => {
    animateTransition()
    setFocusedData(chartData)
  }
  return (
    <Box marginBottom="m">
      <Text variant="body1" color="black" marginVertical="s">
        {title}
      </Text>
      <Box
        backgroundColor="grayBox"
        padding="l"
        borderRadius="m"
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
                  negativeColor={redMedium}
                  positiveColor={color}
                  focusedData={focusedData}
                  number={number}
                  change={change}
                />
              )}
            </Box>
            <Box width="60%">
              <ChartContainer
                height={75}
                data={data}
                onFocus={onFocus}
                showXAxisLabel={false}
                upColor={color}
                downColor={grayLight}
                labelColor={black}
                hasDownBars={false}
              />
              <Text variant="body3" color="black" paddingTop="xs">
                {focusedData ? focusedData.day : ' '}
              </Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default HotspotDetailChart
