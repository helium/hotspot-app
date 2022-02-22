import { isEqual } from 'lodash'
import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Balance, { CurrencyType } from '@helium/currency'
import { addMinutes, startOfYesterday } from 'date-fns'
import Box from '../../../components/Box'
import EmojiBlip from '../../../components/EmojiBlip'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import useCurrency from '../../../utils/useCurrency'
import HotspotsTicker from './HotspotsTicker'
import animateTransition from '../../../utils/animateTransition'
import { CacheRecord } from '../../../utils/cacheUtils'
import { AccountReward } from '../../../store/account/accountSlice'
import DateModule from '../../../utils/DateModule'

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

type Props = { accountRewards: CacheRecord<AccountReward> }
const WelcomeOverview = ({ accountRewards }: Props) => {
  const { t } = useTranslation()
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()
  const [bodyText, setBodyText] = useState('')
  const [{ hotspotsLoaded, validatorsLoaded }, setHasLoadedWelcome] = useState({
    hotspotsLoaded: false,
    validatorsLoaded: false,
  })
  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots.data,
    isEqual,
  )

  const hiddenAddresses = useSelector(
    (state: RootState) => state.account.settings.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.account.settings.showHiddenHotspots,
  )

  const visibleHotspots = useMemo(() => {
    if (showHiddenHotspots) {
      return hotspots
    }
    return hotspots.filter((h) => !hiddenAddresses?.includes(h.address)) || []
  }, [hiddenAddresses, hotspots, showHiddenHotspots])

  const hotspotsLoading = useSelector(
    (state: RootState) => !state.hotspots.hotspotsLoaded,
  )

  const validators = useSelector(
    (state: RootState) => state.validators.validators.data,
    isEqual,
  )
  const validatorsLoading = useSelector(
    (state: RootState) => state.validators.validators.loading,
  )

  useEffect(() => {
    if (hotspotsLoaded && validatorsLoaded) return

    const nextLoaded = {
      hotspotsLoaded: hotspotsLoaded || !hotspotsLoading,
      validatorsLoaded: validatorsLoaded || !validatorsLoading,
    }

    if (nextLoaded.hotspotsLoaded && nextLoaded.validatorsLoaded) {
      animateTransition('WelcomeOverview.LoadingChange', {
        enabledOnAndroid: false,
      })
    }

    setHasLoadedWelcome(nextLoaded)
  }, [hotspotsLoaded, hotspotsLoading, validatorsLoaded, validatorsLoading])

  const updateBodyText = useCallback(async () => {
    if (
      !hotspotsLoaded ||
      !validatorsLoaded ||
      accountRewards.loading ||
      accountRewards.total === undefined
    )
      return

    const hntAmount = await hntBalanceToDisplayVal(
      Balance.fromFloat(accountRewards.total, CurrencyType.networkToken),
    )
    const validatorCount = validators.length
    const hotspotCount = visibleHotspots.length
    let nextBodyText = ''
    const yesterday = startOfYesterday()
    const utcOffset = yesterday.getTimezoneOffset()
    const offsetDate = addMinutes(yesterday, utcOffset)
    const date = await DateModule.formatDate(offsetDate.toISOString(), 'MMM d')
    if (validatorCount === 0) {
      nextBodyText = t('hotspots.owned.reward_hotspot_summary', {
        count: hotspotCount,
        hntAmount,
        date,
      })
    } else if (hotspotCount === 0 && validatorCount > 0) {
      nextBodyText = t('hotspots.owned.reward_validator_summary', {
        count: validatorCount,
        hntAmount,
        date,
      })
    } else {
      const validator = t('hotspots.owned.validator', {
        count: validatorCount,
        date,
      })
      const hotspot = t('hotspots.owned.hotspot', {
        count: hotspotCount,
        date,
      })

      nextBodyText = t('hotspots.owned.reward_hotspot_and_validator_summary', {
        hotspot,
        validator,
        hntAmount,
        date,
      })
    }
    setBodyText(nextBodyText)
  }, [
    hotspotsLoaded,
    validatorsLoaded,
    accountRewards.loading,
    accountRewards.total,
    hntBalanceToDisplayVal,
    validators.length,
    visibleHotspots.length,
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
        {hotspotsLoaded && validatorsLoaded ? (
          <Text
            variant="light"
            fontSize={20}
            lineHeight={24}
            textAlign="center"
            color="black"
            maxFontSizeMultiplier={1.2}
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
