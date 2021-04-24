import React, { useCallback, useMemo } from 'react'
import useHaptic from '../utils/useHaptic'
import Box from './Box'
import Text from './Text'
import TouchableCircle from './TouchableCircle'
import Backspace from '../assets/images/backspace.svg'
import { useColors } from '../theme/themeHooks'

type Props = {
  onNumberPress: (value: number) => void
  onBackspacePress: () => void
  onCustomButtonPress?: () => void
  customButtonTitle?: string
}
const Key = ({
  children,
  onPressIn,
}: {
  children: React.ReactNode
  onPressIn: () => void
}) => {
  const { triggerImpact } = useHaptic()

  const handlePressIn = useCallback(() => {
    triggerImpact()
    onPressIn()
  }, [onPressIn, triggerImpact])

  return (
    <TouchableCircle
      alignItems="center"
      marginBottom="xs"
      flexBasis="33%"
      onPressIn={handlePressIn}
    >
      {children}
    </TouchableCircle>
  )
}

const Keypad = ({
  onNumberPress,
  onCustomButtonPress,
  onBackspacePress,
  customButtonTitle,
}: Props) => {
  const { triggerImpact } = useHaptic()
  const colors = useColors()

  const renderDynamicButton = useMemo(() => {
    if (onCustomButtonPress && customButtonTitle) {
      return (
        <Key onPressIn={onCustomButtonPress}>
          <Text
            variant="keypad"
            fontSize={20}
            numberOfLines={1}
            adjustsFontSizeToFit
            padding="s"
          >
            {customButtonTitle}
          </Text>
        </Key>
      )
    }
    return <Box flexBasis="33%" />
  }, [customButtonTitle, onCustomButtonPress])

  const onPressIn = useCallback(
    (value: number) => () => {
      triggerImpact()
      onNumberPress(value)
    },
    [onNumberPress, triggerImpact],
  )
  const handleBackspace = useCallback(() => {
    triggerImpact()
    onBackspacePress()
  }, [onBackspacePress, triggerImpact])

  return (
    <Box
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
          onPressIn={onPressIn(idx + 1)}
          key={idx}
        >
          <Text variant="keypad">{idx + 1}</Text>
        </TouchableCircle>
      ))}

      {renderDynamicButton}

      <TouchableCircle
        alignItems="center"
        marginBottom="xs"
        flexBasis="33%"
        onPressIn={onPressIn(0)}
      >
        <Text variant="keypad">{0}</Text>
      </TouchableCircle>
      <TouchableCircle
        alignItems="center"
        marginBottom="xs"
        flexBasis="33%"
        onPressIn={handleBackspace}
      >
        <Backspace color={colors.white} height={24} width={24} />
      </TouchableCircle>
    </Box>
  )
}

export default Keypad
