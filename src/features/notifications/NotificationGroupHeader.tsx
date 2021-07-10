import React, { memo } from 'react'
import Box from '../../components/Box'
import Text from '../../components/Text'
import ImageBox from '../../components/ImageBox'

type Props = {
  title: string
  icon: string
  time: string
}
const NotificationGroupHeader = ({ icon, title, time }: Props) => (
  <Box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    paddingBottom="xs"
    paddingTop="xs"
    backgroundColor="white"
  >
    <Box flexDirection="row" alignItems="center">
      <ImageBox
        borderRadius="round"
        source={{
          uri: icon,
          method: 'GET',
        }}
        resizeMode="contain"
        width={26}
        height={26}
        marginRight="s"
      />
      <Text variant="h5" color="grayBlack">
        {title}
      </Text>
    </Box>
    <Text variant="body3" fontSize={12} color="grayExtraLight">
      {time}
    </Text>
  </Box>
)

export default memo(NotificationGroupHeader)
