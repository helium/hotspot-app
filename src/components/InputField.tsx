import React, { ReactElement, useRef } from 'react'
import { TextInput, TouchableWithoutFeedback } from 'react-native'
import Box from './Box'
import Text from './Text'
import InputLock from '../assets/images/input-lock.svg'

// TODO want to use this but need to forward refs
// import TextInput from '../../../components/TextInput'

type Props = {
  label: string
  placeholder?: string
  extra?: ReactElement
  footer?: ReactElement
  type?: 'default' | 'numeric'
  onChange: (text: string) => void
  locked?: boolean
  defaultValue?: string
  value?: string
  numberOfLines?: number
  isLast?: boolean
  isFirst?: boolean
  testID?: string
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
  isLast = false,
  isFirst = false,
  testID,
}: Props) => {
  const inputRef = useRef<TextInput | null>(null)

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  return (
    <TouchableWithoutFeedback onPress={handleFocus}>
      <Box
        backgroundColor="offwhite"
        borderTopLeftRadius={isFirst ? 'm' : 'none'}
        borderTopRightRadius={isFirst ? 'm' : 'none'}
        borderBottomLeftRadius={isLast ? 'm' : 'none'}
        borderBottomRightRadius={isLast ? 'm' : 'none'}
        paddingHorizontal="m"
        paddingVertical="m"
        marginBottom="xs"
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
            testID={testID}
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
