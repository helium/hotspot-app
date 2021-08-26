import React from 'react'
import Close from '@assets/images/closeModal.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = {
  attribute: string
  value?: string
  showFailure?: boolean
  description?: string
}
const DiagnosticLineItem = ({
  attribute,
  value,
  showFailure,
  description,
}: Props) => {
  return (
    <Box marginBottom="s">
      <Box flexDirection="row" alignItems="center">
        <Text variant="body2Medium" color="black" flex={1}>
          {attribute}
        </Text>
        {showFailure && <Close height={16} width={16} color="red" />}
        <Text variant="body2" color="black" marginLeft="xxs">
          {value}
        </Text>
      </Box>
      {description && (
        <Text
          variant="body2"
          fontSize={12}
          color="grayText"
          marginLeft="ms"
          marginTop="xxs"
        >
          {description}
        </Text>
      )}
    </Box>
  )
}

export default DiagnosticLineItem
