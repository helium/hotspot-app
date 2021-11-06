import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Edge } from 'react-native-safe-area-context'
import Box from '../../components/Box'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'

const edges = ['top'] as Edge[]
type Props = { visible: boolean }
export const CONSENSUS_BANNER_HEIGHT = 32
const ConsensusBanner = ({ visible }: Props) => {
  const { t } = useTranslation()
  if (!visible) return null
  return (
    <SafeAreaBox
      edges={edges}
      alignContent="center"
      justifyContent="center"
      alignItems="center"
      backgroundColor="purpleBright"
    >
      <Box minHeight={CONSENSUS_BANNER_HEIGHT} justifyContent="center">
        <Text variant="regular" fontSize={13}>
          {t('validator_details.in_consensus')}
        </Text>
      </Box>
    </SafeAreaBox>
  )
}

export default memo(ConsensusBanner)
