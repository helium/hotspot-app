import React from 'react'
import Text from '../../../components/Text'
import MiniIcon from '../../../assets/images/mini-icon.svg'
import Box from '../../../components/Box'

const AppInfoItem = ({ version }: { version: string }) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      height={48}
      paddingHorizontal="ms"
      marginTop="l"
    >
      <MiniIcon />
      <Box marginLeft="ms">
        <Text variant="body2" color="primaryText">
          {`v${version}`}
        </Text>
        <Text variant="body2" color="secondaryText">
          Helium Systems, Inc.
        </Text>
      </Box>
    </Box>
  )
}

export default AppInfoItem
