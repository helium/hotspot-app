import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import Box from '../../components/Box'
import Card from '../../components/Card'
import Text from '../../components/Text'
import { StatsState } from '../../store/stats/statsSlice'
import { t } from '../../utils/translate'

type Props = { statsState: StatsState }

const StatsView = ({ statsState }: Props) => {
  if (statsState.loading !== 'succeeded') {
    return <ActivityIndicator />
  }
  return (
    <Box backgroundColor="mainBackground">
      <Text variant="header">{t('stats.title')}</Text>
      <Card variant="elevated">
        <ScrollView>
          <Text variant="body" style={{ color: 'black' }}>
            {JSON.stringify(statsState.data, null, 2)}
          </Text>
        </ScrollView>
      </Card>
    </Box>
  )
}

export default StatsView
