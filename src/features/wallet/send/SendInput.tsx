import React, { useRef } from 'react'
import { TouchableWithoutFeedback, TextInput } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
// import TextInput from '../../../components/TextInput'

type Props = {
  label: string
  placeholder?: string
  extra?: any
}

const SendInput = ({ label, placeholder, extra }: Props) => {
  const inputRef = useRef<TextInput | null>(null)

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  return (
    <TouchableWithoutFeedback onPress={handleFocus}>
      <Box
        backgroundColor="offwhite"
        borderRadius="m"
        padding="m"
        marginBottom="s"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="s"
        >
          <Text letterSpacing={0.92} fontSize={13}>
            {label.toUpperCase()}
          </Text>
          {extra !== undefined && extra}
        </Box>
        <Box paddingVertical="s">
          <TextInput placeholder={placeholder} ref={inputRef} multiline />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default SendInput
