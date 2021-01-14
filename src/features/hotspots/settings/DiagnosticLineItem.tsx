import React from 'react'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = { attribute: string; value?: string }
const DiagnosticLineItem = ({ attribute, value }: Props) => {
  return (
    <Box flexDirection="row" alignItems="center" marginBottom="s">
      <Text variant="body2Medium" color="black" flex={1}>
        {attribute}
      </Text>
      <Text variant="body2Medium" color="black" marginLeft="ms">
        {value}
      </Text>
    </Box>
  )
}

export default DiagnosticLineItem
