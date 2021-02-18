import React from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../../../components/Text'

const ActivityCardLoading = ({
  hasNoResults = false,
}: {
  hasNoResults?: boolean
}) => {
  const { t } = useTranslation()

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
