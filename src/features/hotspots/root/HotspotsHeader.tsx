import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
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
  return <Text variant="h1">{t('time.day_header', { timeOfDay })}</Text>
}

const HotspotsHeader = ({
  style,
  marginBottom,
}: {
  style: Animated.AnimatedStyleProp<ViewStyle>[]
  marginBottom: number
}) => {
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
    <Animated.View style={style}>
      <Box padding="l" style={{ marginBottom }}>
        <TimeOfDayTitle date={date} />
        <Text variant="body1" paddingTop="m">
          {t('hotspots.owned.reward_summary', {
            count: (hotspots || []).length,
            hntAmount: totalRewards.toString(2),
          })}
        </Text>
      </Box>
    </Animated.View>
  )
}

export default HotspotsHeader
