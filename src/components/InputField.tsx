import React, { useRef } from 'react'
import { TextInput, TouchableWithoutFeedback } from 'react-native'
import Box from './Box'
import Text from './Text'
import InputLock from '../assets/images/input-lock.svg'

// TODO want to use this but need to forward refs
// import TextInput from '../../../components/TextInput'

type Props = {
  label: string
  placeholder?: string
  extra?: any
  footer?: any
  type?: 'default' | 'numeric'
  onChange: (text: string) => void
  locked?: boolean
  defaultValue?: string
  value?: string
  numberOfLines?: number
}

const InputField = ({
  label,
  placeholder,
  extra,
  footer,
  type = 'default',
  onChange,
  locked = false,
  defaultValue,
  value,
  numberOfLines,
}: Props) => {
  const inputRef = useRef<TextInput | null>(null)

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  return (
    <TouchableWithoutFeedback onPress={handleFocus}>
      <Box
        backgroundColor="offwhite"
        borderRadius="m"
        paddingHorizontal="m"
        paddingVertical="m"
        marginBottom="s"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text letterSpacing={0.92} fontSize={13}>
            {label.toUpperCase()}
            {locked && <InputLock style={{ marginLeft: 8 }} />}
          </Text>
          {extra !== undefined && extra}
        </Box>
        <Box paddingVertical="s">
          <TextInput
            placeholder={placeholder}
            ref={inputRef}
            onChangeText={onChange}
            defaultValue={defaultValue}
            editable={!locked}
            multiline
            blurOnSubmit
            autoCompleteType="off"
            textContentType="none"
            autoCapitalize="none"
            autoCorrect={false}
            dataDetectorTypes="none"
            keyboardAppearance="dark"
            keyboardType={type}
            value={value}
            numberOfLines={numberOfLines}
            style={{
              fontFamily: 'InputMono-Regular',
              fontSize: 15,
              lineHeight: 20,
              letterSpacing: 0.7,
            }}
            returnKeyType="done"
          />
        </Box>
        {footer !== undefined && footer}
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default InputField
