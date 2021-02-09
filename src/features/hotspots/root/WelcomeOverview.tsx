import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import EmojiBlip from '../../../components/EmojiBlip'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'

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
    <Text variant="h1" color="purpleMain">
      {t('time.day_header', { timeOfDay })}
    </Text>
  )
}

const WelcomeOverview = () => {
  const { t } = useTranslation()

  const {
    hotspots: { hotspots, totalRewards },
  } = useSelector((state: RootState) => state)

  const [date, setDate] = useState(new Date())
  useEffect(() => {
    const dateTimer = setInterval(() => setDate(new Date()), 300000) // update every 5 min
    return () => clearInterval(dateTimer)
  })

  return (
    <Box padding="l" paddingTop="m">
      <EmojiBlip date={date} />
      <TimeOfDayTitle date={date} />
      <Text variant="body1Light" paddingTop="m" paddingRight="xl" color="black">
        {t('hotspots.owned.reward_summary', {
          count: (hotspots || []).length,
          hntAmount: totalRewards.toString(2),
        })}
      </Text>
    </Box>
  )
}

export default WelcomeOverview
