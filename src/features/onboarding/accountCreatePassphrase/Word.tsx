import upperFirst from 'lodash/upperFirst'
import React from 'react'
import { Animated } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = { word: string; position: number; opacity: Animated.Value }
const Word = ({ position, word, opacity }: Props) => {
  return (
    <Animated.View
      key={word}
      style={{
        opacity,
      }}
    >
      <Box flexDirection="row">
        <Text variant="bodyMono" color="midGray">
          {position}
        </Text>
        <Text variant="bodyMono" color="lightGray" marginLeft="s">
          {upperFirst(word)}
        </Text>
      </Box>
    </Animated.View>
  )
}

export default Word
