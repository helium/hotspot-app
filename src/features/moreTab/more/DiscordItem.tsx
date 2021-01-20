import React from 'react'
import { Linking } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Discord from '../../../assets/images/discord.svg'
import LinkImg from '../../../assets/images/link.svg'
import Box from '../../../components/Box'

const DiscordItem = () => {
  const onPress = () => Linking.openURL('https://discord.gg/helium')

  return (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="purpleBrightMuted"
      alignItems="center"
      height={48}
      paddingHorizontal="ms"
      marginTop="s"
      marginBottom="xxxs"
      onPress={onPress}
      borderTopLeftRadius="m"
      borderTopRightRadius="m"
      borderBottomLeftRadius="m"
      borderBottomRightRadius="m"
    >
      <Box flexDirection="row" alignItems="center">
        <Discord />
        <Text variant="body2" color="primaryText" marginLeft="ms">
          Join Helium Discord
        </Text>
      </Box>
      <LinkImg />
    </TouchableOpacityBox>
  )
}

export default DiscordItem
