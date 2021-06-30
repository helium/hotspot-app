import { isEqual } from 'lodash'
import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Box from '../../../components/Box'
import EmojiBlip from '../../../components/EmojiBlip'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import useCurrency from '../../../utils/useCurrency'
import HotspotsTicker from './HotspotsTicker'
import animateTransition from '../../../utils/animateTransition'

const TimeOfDayTitle = ({ date }: { date: Date }) => {
  const { t } = useTranslation()
  const hours = date.getHours()
  let timeOfDay = t('time.afternoon')
  if (hours >= 4 && hours < 12) {
    timeOfDay = t('time.morning')
  }
  if (hours >= 17 || hours < 4) {
    timeOfDay = t('time.evening')
  }
  return (
    <Text
      variant="h1"
      color="purpleMain"
      maxFontSizeMultiplier={1}
      marginTop="s"
    >
      {timeOfDay}
    </Text>
  )
}

const WelcomeOverview = () => {
  const { t } = useTranslation()
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()
  const [bodyText, setBodyText] = useState('')

  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots,
    isEqual,
  )

  const totalRewards = useSelector(
    (state: RootState) => state.hotspots.totalRewards,
    isEqual,
  )
  const rewards = useSelector(
    (state: RootState) => state.hotspots.rewards,
    isEqual,
  )
  const loadingRewards = useSelector(
    (state: RootState) => state.hotspots.loadingRewards,
  )

  const loading = useMemo(() => {
    if (hotspots.length > 0 && rewards && Object.keys(rewards).length === 0)
      // has hotspots but rewards haven't been loaded yet
      return loadingRewards

    return false
  }, [hotspots.length, loadingRewards, rewards])

  useEffect(() => {
    if (!loading)
      animateTransition('WelcomeOverview.LoadingChange', {
        enabledOnAndroid: false,
      })
  }, [loading])

  const updateBodyText = useCallback(async () => {
    if (loading || !totalRewards) return

    const hntAmount = await hntBalanceToDisplayVal(totalRewards)
    const nextBodyText = t('hotspots.owned.reward_summary', {
      count: hotspots.length,
      hntAmount,
    })
    setBodyText(nextBodyText)
  }, [hntBalanceToDisplayVal, hotspots?.length, loading, t, totalRewards])

  useEffect(() => {
    updateBodyText()
  }, [updateBodyText])

  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const dateTimer = setInterval(() => setDate(new Date()), 300000) // update every 5 min
    return () => clearInterval(dateTimer)
  })

  return (
    <Box alignItems="center">
      <HotspotsTicker marginBottom="xxl" />
      <EmojiBlip date={date} />
      <TimeOfDayTitle date={date} />
      <Box marginTop="m" marginBottom="xxl">
        {!loading ? (
          <Text
            variant="light"
            fontSize={20}
            lineHeight={24}
            textAlign="center"
            color="black"
            onPress={toggleConvertHntToCurrency}
          >
            {bodyText}
          </Text>
        ) : (
          <SkeletonPlaceholder speed={3000}>
            <SkeletonPlaceholder.Item
              height={20}
              width={320}
              marginBottom={4}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              alignSelf="center"
              height={20}
              marginBottom={4}
              width={280}
              borderRadius={4}
            />
          </SkeletonPlaceholder>
        )}
      </Box>
    </Box>
  )
}

export default memo(WelcomeOverview)
