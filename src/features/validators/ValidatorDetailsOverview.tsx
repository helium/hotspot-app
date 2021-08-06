import { Validator } from '@helium/http'
import React, { useState, memo, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { ScrollView } from 'react-native-gesture-handler'
import ChartContainer from '../../components/BarChart/ChartContainer'
import { ChartData } from '../../components/BarChart/types'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { fetchChartData } from '../../store/rewards/rewardsSlice'
import { RootState } from '../../store/rootReducer'
import { useAppDispatch } from '../../store/store'
import { useBorderRadii, useColors } from '../../theme/themeHooks'
import animateTransition from '../../utils/animateTransition'
import DateModule from '../../utils/DateModule'
import { getRewardChartData } from '../hotspots/details/RewardsHelper'
import ValidatorCooldown from './ValidatorCooldown'
import ValidatorTimeRange from './ValidatorTimeRange'
import { locale } from '../../utils/i18n'

type Props = { validator?: Validator }
const ValidatorDetailsOverview = ({ validator }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [timelineValue, setTimelineValue] = useState(14)
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const [dateLabel, setDateLabel] = useState('')
  const chartData = useSelector((state: RootState) => state.rewards.chartData)
  const { black, grayLight, purpleBright, grayPurpleLight } = useColors()
  const { l, lm } = useBorderRadii()
  const address = useMemo(() => {
    if (!validator?.address) return ''
    return validator.address
  }, [validator])

  const { rewards, rewardSum, rewardsChange, loading = true } =
    chartData[address]?.[timelineValue] || {}

  const rewardChartData = useMemo(() => {
    const data = getRewardChartData(rewards, timelineValue)
    return data || []
  }, [rewards, timelineValue])

  useEffect(() => {
    if (!address) return

    dispatch(
      fetchChartData({
        address,
        numDays: timelineValue,
        resource: 'validators',
      }),
    )
  }, [address, dispatch, timelineValue])

  useEffect(() => {
    const updateDateLabel = async () => {
      let label = ''

      if (focusedData) {
        label = await DateModule.formatDate(
          focusedData.label,
          focusedData.showTime ? 'MMM d h:mma' : 'EEE MMM d',
        )
      }
      setDateLabel(label)
    }
    updateDateLabel()
  }, [focusedData])

  const onFocus = useCallback(async (nextFocusedData: ChartData | null) => {
    animateTransition('HotspotDetailChart.OnFocus', {
      enabledOnAndroid: false,
    })

    setFocusedData(nextFocusedData)
  }, [])

  const change = useMemo(() => rewardsChange || 0, [rewardsChange])
  const contentContainerStyle = useMemo(() => ({ paddingBottom: 32 }), [])
  const style = useMemo(() => ({ borderRadius: lm }), [lm])

  return (
    <Box flex={1} marginTop="m">
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        style={style}
        showsVerticalScrollIndicator={false}
      >
        <ValidatorCooldown validator={validator} />
        <Box
          backgroundColor="grayPurpleLight"
          borderRadius="lm"
          marginBottom="m"
          flexDirection="row"
          alignItems="center"
          paddingVertical="s"
          paddingHorizontal="m"
        >
          <Text variant="medium" fontSize={15} color="purpleMediumText">
            {t('validator_details.time_range')}
          </Text>
          <ValidatorTimeRange
            setTimeRange={setTimelineValue}
            timeRange={timelineValue}
          />
        </Box>
        {loading ? (
          <SkeletonPlaceholder backgroundColor={grayPurpleLight}>
            <SkeletonPlaceholder.Item
              height={217}
              width="100%"
              borderRadius={l}
            />
          </SkeletonPlaceholder>
        ) : (
          <Box
            width="100%"
            minHeight={217}
            backgroundColor="grayPurpleLight"
            borderRadius="lm"
            padding="m"
          >
            <Box flexDirection="row" marginBottom="m" alignItems="flex-end">
              <Text
                color="purpleBright"
                variant="bold"
                fontSize={13}
                maxFontSizeMultiplier={1.1}
                marginRight="s"
              >
                {focusedData
                  ? `${
                      focusedData.up < 0 ? '' : '+'
                    }${focusedData.up.toLocaleString(locale)}`
                  : `${change < 0 ? '' : '+'}${change.toLocaleString(locale, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}%`}
              </Text>

              {!!dateLabel && (
                <Text
                  variant="body3"
                  color="grayDarkText"
                  fontSize={13}
                  maxFontSizeMultiplier={1.1}
                >
                  {dateLabel}
                </Text>
              )}
            </Box>
            <ChartContainer
              height={100}
              data={rewardChartData}
              onFocus={onFocus}
              showXAxisLabel={false}
              upColor={purpleBright}
              downColor={grayLight}
              labelColor={black}
            />
            <Box marginTop="m">
              <Text
                color="purpleMediumText"
                variant="medium"
                fontSize={15}
                maxFontSizeMultiplier={1.2}
              >
                {t('hotspot_details.reward_title')}
              </Text>
              <Text
                variant="light"
                color="grayDarkText"
                fontSize={37}
                numberOfLines={1}
                adjustsFontSizeToFit
                maxFontSizeMultiplier={1}
              >
                {rewardSum?.floatBalance.toFixed(2)}
              </Text>
            </Box>
          </Box>
        )}
        <Box marginTop="m" flexDirection="row">
          <Box
            flex={1}
            backgroundColor="grayPurpleLight"
            borderRadius="lm"
            padding="m"
            marginRight="s"
          >
            <Text
              color="purpleMediumText"
              variant="medium"
              fontSize={15}
              maxFontSizeMultiplier={1.2}
            >
              {t('validator_details.lifetime_consensus')}
            </Text>
            <Text
              variant="light"
              color="grayDarkText"
              fontSize={37}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1}
            >
              {/* TODO: add this var to helium-js and wallet api {validator.consensusGroups} */}
              ToDo
            </Text>
          </Box>
          <Box
            flex={1}
            backgroundColor="grayPurpleLight"
            borderRadius="lm"
            padding="m"
            marginLeft="s"
          />
        </Box>
      </ScrollView>
    </Box>
  )
}

export default memo(ValidatorDetailsOverview)
