import React from 'react'
import Paired from '../../../assets/images/paired.svg'
import Fail from '../../../assets/images/fail.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { useColors } from '../../../theme/themeHooks'

type Props = { success: boolean; text: string }
const DiagnosticAttribute = ({ success, text }: Props) => {
  const { greenMain } = useColors()

  return (
    <Box flexDirection="row" alignItems="center" marginBottom="s">
      {success && <Paired height={32} width={32} color={greenMain} />}
      {!success && <Fail height={32} width={32} />}
      <Text variant="subtitle" color="black" marginLeft="ms">
        {text}
      </Text>
    </Box>
  )
}

export default DiagnosticAttribute
