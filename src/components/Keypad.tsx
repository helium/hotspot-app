import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import haptic from '../utils/haptic'
import Box from './Box'
import Text from './Text'
import TouchableCircle from './TouchableCircle'
import Backspace from '../assets/images/backspace.svg'
import { useColors } from '../theme/themeHooks'

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
  const colors = useColors()

  const renderDynamicButton = useMemo(() => {
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
  }, [onCancel, t])

  const onPressIn = useCallback(
    (value: number) => () => {
      haptic()
      onNumberPress(value)
    },
    [onNumberPress],
  )
  const handleBackspace = useCallback(() => {
    haptic()
    onBackspacePress()
  }, [onBackspacePress])

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
