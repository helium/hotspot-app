import React from 'react'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import upperFirst from '../../../utils/upperFirst'

type Props = { word: string; position: number }
const Word = ({ position, word }: Props) => {
  return (
    <Box flexDirection="row">
      <Text variant="bodyMono" color="midGray">
        {position}
      </Text>
      <Text variant="bodyMono" color="lightGray" marginLeft="s">
        {upperFirst(word)}
      </Text>
    </Box>
  )
}

export default Word
