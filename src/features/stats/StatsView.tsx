import { useTheme } from '@shopify/restyle'
import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Card from '../../components/Card'
import Text from '../../components/Text'
import { StatsState } from '../../store/stats/statsSlice'
import { Theme } from '../../theme/theme'

type Props = { statsState: StatsState }

const StatsView = ({ statsState }: Props) => {
  const theme = useTheme<Theme>()
  const { t } = useTranslation()

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
      <Card backgroundColor="white" variant="elevated">
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
