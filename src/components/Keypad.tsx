import React from 'react'
import Box from './Box'
import Text from './Text'
import TouchableCircle from './TouchableCircle'

type Props = { onNumberPress: (value: number) => void }
const Keypad = ({ onNumberPress }: Props) => {
  return (
    <Box
      flex={1}
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-around"
    >
      {[...Array(9).keys()].map((idx) => (
        <TouchableCircle
          alignItems="center"
          marginBottom="xs"
          flexBasis="33%"
          onPressIn={() => onNumberPress(idx + 1)}
          key={idx}
        >
          <Text variant="keypad">{idx + 1}</Text>
        </TouchableCircle>
      ))}
      <Box flexBasis="33%" />
      <TouchableCircle alignItems="center" marginBottom="xs" flexBasis="33%">
        <Text variant="keypad">{0}</Text>
      </TouchableCircle>
      <TouchableCircle alignItems="center" marginBottom="xs" flexBasis="33%">
        {/* TODO: Bring in react native icons and use the backspace icon */}
        <Text variant="keypad">{'<'}</Text>
      </TouchableCircle>
    </Box>
  )
}

export default Keypad
