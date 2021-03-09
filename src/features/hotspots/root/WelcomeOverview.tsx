import { isEqual } from 'lodash'
import React, { useEffect, useState, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import EmojiBlip from '../../../components/EmojiBlip'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import useCurrency from '../../../utils/useCurrency'

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
    <Text variant="h1" color="purpleMain" maxFontSizeMultiplier={1}>
      {t('time.day_header', { timeOfDay })}
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

  const updateBodyText = useCallback(async () => {
    const hntAmount = await hntBalanceToDisplayVal(totalRewards)
    const nextBodyText = t('hotspots.owned.reward_summary', {
      count: hotspots?.length || 0,
      hntAmount,
    })
    setBodyText(nextBodyText)
  }, [hntBalanceToDisplayVal, hotspots?.length, t, totalRewards])

  useEffect(() => {
    updateBodyText()
  }, [updateBodyText])

  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const dateTimer = setInterval(() => setDate(new Date()), 300000) // update every 5 min
    return () => clearInterval(dateTimer)
  })

  return (
    <Box paddingHorizontal="l">
      <EmojiBlip date={date} />
      <TimeOfDayTitle date={date} />
      <Text
        variant="body1Light"
        paddingTop="m"
        paddingRight="xl"
        color="black"
        onPress={toggleConvertHntToCurrency}
      >
        {bodyText}
      </Text>
    </Box>
  )
}

export default memo(WelcomeOverview)
