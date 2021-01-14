import React from 'react'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = {
  online?: string
}
const StatusBadge = ({ online = 'offline' }: Props) => (
  <Box
    backgroundColor={online === 'online' ? 'greenOnline' : 'yellow'}
    padding="s"
    borderRadius="s"
    alignSelf="baseline"
  >
    <Text color="white">
      {online === 'online' ? 'Online' : 'Needs Attention'}
    </Text>
  </Box>
)

export default StatusBadge
