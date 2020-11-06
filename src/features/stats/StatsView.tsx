import { useTheme } from '@shopify/restyle'
import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import Box from '../../components/Box'
import Card from '../../components/Card'
import Text from '../../components/Text'
import { StatsState } from '../../store/stats/statsSlice'
import { Theme } from '../../theme/theme'
import { t } from '../../utils/translate'

type Props = { statsState: StatsState }

const StatsView = ({ statsState }: Props) => {
  const theme = useTheme<Theme>()

  if (statsState.loading !== 'succeeded') {
    return (
      <ActivityIndicator
        color={theme.colors.primaryMain}
        accessibilityLabel="Loading"
      />
    )
  }
  return (
    <Box backgroundColor="mainBackground">
      <Text variant="header">{t('stats.title')}</Text>
      <Card variant="elevated">
        <ScrollView>
          <Text variant="body" color="black">
            {JSON.stringify(statsState.data, null, 2)}
          </Text>
        </ScrollView>
      </Card>
    </Box>
  )
}

export default StatsView
