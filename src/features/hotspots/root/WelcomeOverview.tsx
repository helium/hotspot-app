import { isEqual } from 'lodash'
import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { Sum } from '@helium/http'
import Balance, { CurrencyType } from '@helium/currency'
import Box from '../../../components/Box'
import EmojiBlip from '../../../components/EmojiBlip'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import useCurrency from '../../../utils/useCurrency'
import HotspotsTicker from './HotspotsTicker'
import animateTransition from '../../../utils/animateTransition'
import { CacheRecord } from '../../../utils/cacheUtils'

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

type Props = { accountRewards: CacheRecord<Sum> }
const WelcomeOverview = ({ accountRewards }: Props) => {
  const { t } = useTranslation()
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()
  const [bodyText, setBodyText] = useState('')

  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots,
    isEqual,
  )

  const loading = useMemo(() => accountRewards.loading, [
    accountRewards.loading,
  ])

  useEffect(() => {
    if (!loading)
      animateTransition('WelcomeOverview.LoadingChange', {
        enabledOnAndroid: false,
      })
  }, [loading])

  const updateBodyText = useCallback(async () => {
    if (loading) return

    const hntAmount = await hntBalanceToDisplayVal(
      Balance.fromFloat(accountRewards.total, CurrencyType.networkToken),
    )
    const nextBodyText = t('hotspots.owned.reward_summary', {
      count: hotspots.length,
      hntAmount,
    })
    setBodyText(nextBodyText)
  }, [
    accountRewards.total,
    hntBalanceToDisplayVal,
    hotspots.length,
    loading,
    t,
  ])

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
