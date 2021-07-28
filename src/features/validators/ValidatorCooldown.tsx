import { Validator } from '@helium/http'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Cooldown from '@assets/images/cooldown.svg'
import Box from '../../components/Box'
import Text from '../../components/Text'

type Props = { validator?: Validator }
const ValidatorCooldown = ({ validator }: Props) => {
  const { t } = useTranslation()

  const isUnstaked = useMemo(() => {
    if (!validator) return false
    return validator.stakeStatus === 'unstaked'
  }, [validator])

  if (!isUnstaked) return null

  return (
    <Box
      backgroundColor="whitePurple"
      marginTop="m"
      borderRadius="lm"
      flexDirection="row"
      alignItems="center"
      padding="m"
    >
      <Cooldown />
      <Text variant="medium" paddingLeft="s" fontSize={15} color="purpleBright">
        {t('validator_details.in_cooldown_mode')}
      </Text>
      <Text
        variant="light"
        fontSize={15}
        color="purpleBright"
        flex={1}
        textAlign="right"
      >
        {t('validator_details.cooldown_blocks_left', { blocks: 'xx,xxx' })}
      </Text>
    </Box>
  )
}

export default memo(ValidatorCooldown)
