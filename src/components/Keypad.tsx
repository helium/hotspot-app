import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import haptic from '../utils/haptic'
import Box from './Box'
import Text from './Text'
import TouchableCircle from './TouchableCircle'

type Props = {
  onNumberPress: (value: number) => void
  onBackspacePress: () => void
}
const Keypad = ({ onNumberPress, onBackspacePress }: Props) => {
  return (
    <Box
      flex={1}
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-around"
      alignContent="center"
    >
      {[...Array(9).keys()].map((idx) => (
        <TouchableCircle
          alignItems="center"
          marginBottom="xs"
          flexBasis="33%"
          onPressIn={() => {
            haptic()
            onNumberPress(idx + 1)
          }}
          key={idx}
        >
          <Text variant="keypad">{idx + 1}</Text>
        </TouchableCircle>
      ))}
      <Box flexBasis="33%" />
      <TouchableCircle
        alignItems="center"
        marginBottom="xs"
        flexBasis="33%"
        onPressIn={() => {
          haptic()
          onNumberPress(0)
        }}
      >
        <Text variant="keypad">{0}</Text>
      </TouchableCircle>
      <TouchableCircle
        alignItems="center"
        marginBottom="xs"
        flexBasis="33%"
        onPressIn={() => {
          haptic()
          onBackspacePress()
        }}
      >
        <Text variant="keypad">
          <Icon name="ios-backspace-outline" size={34} />
        </Text>
      </TouchableCircle>
    </Box>
  )
}

export default Keypad
