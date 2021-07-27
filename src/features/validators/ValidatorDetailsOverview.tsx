import React, { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Text from '../../components/Text'
import ValidatorTimeRange from './ValidatorTimeRange'

const ValidatorDetailsOverview = () => {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState<string | number>(1)

  return (
    <Box
      backgroundColor="grayPurpleLight"
      marginVertical="m"
      borderRadius="lm"
      flexDirection="row"
      alignItems="center"
      paddingVertical="s"
      paddingHorizontal="m"
    >
      <Text variant="medium" fontSize={15} color="purpleMediumText">
        {t('validator_details.time_range')}
      </Text>
      <ValidatorTimeRange setTimeRange={setTimeRange} timeRange={timeRange} />
    </Box>
  )
}

export default memo(ValidatorDetailsOverview)
