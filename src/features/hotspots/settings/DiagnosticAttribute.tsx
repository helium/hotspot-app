import React from 'react'
import Paired from '../../../assets/images/paired.svg'
import NoLuck from '../../../assets/images/noLuck.svg'
import PartialSuccess from '../../../assets/images/partialSuccess.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { useColors } from '../../../theme/themeHooks'

type Props = {
  success: boolean | 'partial'
  text: string
  fontWeight?: 'medium' | 'regular'
}
const size = 16
const DiagnosticAttribute = ({
  success,
  text,
  fontWeight = 'medium',
}: Props) => {
  const { greenMain } = useColors()

  return (
    <Box flexDirection="row" alignItems="center">
      {success && success === true && (
        <Paired height={size} width={size} color={greenMain} />
      )}
      {success && success === 'partial' && (
        <PartialSuccess height={size} width={size} color={greenMain} />
      )}
      {!success && <NoLuck height={size} width={size} />}
      <Text
        variant={fontWeight === 'medium' ? 'body2Medium' : 'body2'}
        color="black"
        marginLeft="s"
      >
        {text}
      </Text>
    </Box>
  )
}

export default DiagnosticAttribute
