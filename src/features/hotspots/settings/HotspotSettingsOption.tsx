import React, { memo } from 'react'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CarotRight from '../../../assets/images/carot-right.svg'
import { useColors } from '../../../theme/themeHooks'

type Props = {
  title: string
  subtitle: string
  buttonLabel?: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  buttonDisabled?: boolean
  buttonIcon?: Element
  compact?: boolean
}
const HotspotSettingsOption = ({
  title,
  subtitle,
  buttonLabel,
  onPress,
  variant,
  buttonDisabled = false,
  buttonIcon,
  compact,
}: Props) => {
  const colors = useColors()
  return (
    <TouchableOpacityBox
      padding="lm"
      disabled={!compact}
      onPress={compact ? onPress : undefined}
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Box flexDirection="row" alignItems="center" marginBottom="s">
            {compact && <Box marginEnd="s">{buttonIcon}</Box>}
            <Text
              variant="medium"
              fontSize={17}
              color="black"
              maxFontSizeMultiplier={1.2}
            >
              {title}
            </Text>
          </Box>
          <Text variant="body2" color="grayText" maxFontSizeMultiplier={1.2}>
            {subtitle}
          </Text>
          {!compact && (
            <Box flexWrap="wrap">
              <Button
                marginTop="l"
                onPress={onPress}
                height={48}
                variant={variant}
                mode="contained"
                title={buttonLabel}
                disabled={buttonDisabled}
                icon={buttonIcon}
              />
            </Box>
          )}
        </Box>
        {compact && <CarotRight color={colors.grayLight} />}
      </Box>
    </TouchableOpacityBox>
  )
}
export default memo(HotspotSettingsOption)
