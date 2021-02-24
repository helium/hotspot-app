import React, { ReactNode, useState } from 'react'
import upperCase from 'lodash/upperCase'
import Text from './Text'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'
import ImageBox from './ImageBox'
import { useSpacing } from '../theme/themeHooks'

type Props = { children?: ReactNode; title?: string }
const Dropdown = ({ children, title }: Props) => {
  const [open, setOpen] = useState(false)
  const spacing = useSpacing()

  return (
    <Box>
      <TouchableOpacityBox flexDirection="row" onPress={() => setOpen(!open)}>
        <Text variant="body1" color="grayBlack" marginRight="s">
          {upperCase(title)}
        </Text>
        <Box height={12} marginTop="xxs" justifyContent="center">
          <ImageBox
            style={
              !open && {
                marginTop: spacing.xs,
                transform: [{ rotate: '180deg' }],
              }
            }
            source={require('../assets/images/dropdown-arrow.png')}
          />
        </Box>
      </TouchableOpacityBox>
      <Box paddingTop="s" style={!open && { display: 'none' }}>
        {children}
      </Box>
    </Box>
  )
}

export default Dropdown
