import React from 'react'
// import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Search from '../../../assets/images/search.svg'
import Add from '../../../assets/images/add.svg'

const HotspotsList = () => {
  // const { t } = useTranslation()

  return (
    <Box flex={1} flexDirection="column" justifyContent="space-between">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="primaryBackground"
        paddingHorizontal="m"
      >
        <Text variant="header" fontSize={22}>
          My Hotspots
        </Text>

        <Box flexDirection="row" justifyContent="space-between">
          <TouchableOpacityBox onPress={() => {}} padding="s">
            <Search width={22} height={22} />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={() => {}} padding="s">
            <Add width={22} height={22} />
          </TouchableOpacityBox>
        </Box>
      </Box>

      <Box
        flexDirection="column"
        backgroundColor="white"
        height="40%"
        borderTopLeftRadius="l"
        borderTopRightRadius="l"
        padding="m"
      >
        <Text>TEST</Text>
      </Box>
    </Box>
  )
}

export default HotspotsList
