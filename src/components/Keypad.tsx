import React from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/Ionicons'
import haptic from '../utils/haptic'
import Box from './Box'
import Text from './Text'
import TouchableCircle from './TouchableCircle'

type Props = {
  onNumberPress: (value: number) => void
  onBackspacePress: () => void
  onCancel?: () => void
}
const Key = ({
  children,
  onPressIn,
}: {
  children: React.ReactNode
  onPressIn: () => void
}) => {
  return (
    <TouchableCircle
      alignItems="center"
      marginBottom="xs"
      flexBasis="33%"
      onPressIn={() => {
        haptic()
        onPressIn()
      }}
    >
      {children}
    </TouchableCircle>
  )
}

const Keypad = ({ onNumberPress, onCancel, onBackspacePress }: Props) => {
  const { t } = useTranslation()

  const renderDynamicButton = () => {
    if (onCancel) {
      return (
        <Key onPressIn={onCancel}>
          <Text
            variant="keypad"
            numberOfLines={1}
            adjustsFontSizeToFit
            padding="s"
          >
            {t('generic.cancel')}
          </Text>
        </Key>
      )
    }
    return <Box flexBasis="33%" />
  }

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

      {renderDynamicButton()}

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
