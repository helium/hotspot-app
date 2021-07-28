import { Validator } from '@helium/http'
import React, { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../components/Box'
import Text from '../../components/Text'
import ValidatorCooldown from './ValidatorCooldown'
import ValidatorTimeRange from './ValidatorTimeRange'

type Props = { validator?: Validator }
const ValidatorDetailsOverview = ({ validator }: Props) => {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState<string | number>(1)

  return (
    <>
      <ValidatorCooldown validator={validator} />
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
    </>
  )
}

export default memo(ValidatorDetailsOverview)
