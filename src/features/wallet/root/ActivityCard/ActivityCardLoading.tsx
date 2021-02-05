import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import Text from '../../../../components/Text'

const ActivityCardLoading = ({
  isLoading = false,
  hasNoResults = false,
}: {
  isLoading?: boolean
  hasNoResults?: boolean
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <ActivityIndicator color="gray" />
  }

  if (hasNoResults) {
    return (
      <Text
        padding="l"
        variant="body1"
        color="black"
        width="100%"
        textAlign="center"
      >
        {t('transactions.no_results')}
      </Text>
    )
  }

  return null
}

export default ActivityCardLoading
