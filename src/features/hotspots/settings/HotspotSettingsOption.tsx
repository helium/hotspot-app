import React from 'react'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Text from '../../../components/Text'

type Props = {
  title: string
  subtitle: string
  buttonLabel: string
  onPress: () => void
  variant: 'primary' | 'secondary'
  buttonDisabled?: boolean
}
const HotspotSettingsOption = ({
  title,
  subtitle,
  buttonLabel,
  onPress,
  variant,
  buttonDisabled = false,
}: Props) => {
  return (
    <Box padding="l">
      <Text variant="h4" color="black" marginBottom="ms">
        {title}
      </Text>
      <Text variant="body2" color="grayText">
        {subtitle}
      </Text>
      <Button
        marginTop="l"
        onPress={onPress}
        width="100%"
        variant={variant}
        mode="contained"
        title={buttonLabel}
        disabled={buttonDisabled}
      />
    </Box>
  )
}
export default HotspotSettingsOption
