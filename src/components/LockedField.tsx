import React, { ReactElement } from 'react'
import Box from './Box'
import Text from './Text'
import InputLock from '../assets/images/input-lock.svg'

type Props = {
  label: string
  value: string
  footer?: ReactElement
  isLast?: boolean
  isFirst?: boolean
}

const LockedField = ({
  label,
  value,
  footer,
  isLast = false,
  isFirst = false,
}: Props) => {
  return (
    <Box
      backgroundColor="offwhite"
      padding="m"
      marginBottom="xs"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
    >
      <Box flexDirection="row" marginBottom="s">
        <Text letterSpacing={0.92} fontSize={13}>
          {label.toUpperCase()}
        </Text>
        <InputLock style={{ marginLeft: 8 }} />
      </Box>
      <Text color="blueMain" variant="subtitleMono" fontSize={15}>
        {value}
      </Text>
      {footer !== undefined && footer}
    </Box>
  )
}

export default LockedField
