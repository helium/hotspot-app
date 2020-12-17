import React, { ReactNode } from 'react'
import Box from './Box'
import Text from './Text'

type Props = { children?: ReactNode; color?: string }
const Bullet = ({ children, color = 'black' }: Props) => (
  <Box flexDirection="row" alignItems="flex-start" marginBottom="s">
    <Text style={{ color }} fontSize={24} lineHeight={22} marginRight="s">
      &bull;
    </Text>
    <Text variant="body1Light" color="gray" width="90%">
      {children}
    </Text>
  </Box>
)

export default Bullet
