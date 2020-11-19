import upperFirst from 'lodash/upperFirst'
import React from 'react'
import { Animated } from 'react-native'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'

type Props = {
  word: string
  position: number
  opacity?: Animated.Value
  onPress?: () => void
}
const Word = ({
  position,
  word,
  opacity = new Animated.Value(1),
  onPress,
}: Props) => {
  return (
    <Animated.View
      key={word}
      style={{
        opacity,
      }}
    >
      <TouchableOpacityBox
        flexDirection="row"
        disabled={!onPress}
        onPress={onPress}
      >
        <Text variant="bodyMono" color="midGray">
          {position}
        </Text>

        <Text variant="bodyMono" color="lightGray" marginLeft="s">
          {upperFirst(word)}
        </Text>
      </TouchableOpacityBox>
    </Animated.View>
  )
}

export default Word
