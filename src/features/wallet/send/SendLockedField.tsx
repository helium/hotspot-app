import React from 'react'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import InputLock from '../../../assets/images/input-lock.svg'

type Props = {
  label: string
  value: string
  bottom?: boolean
}

const SendLockedField = ({ label, value, bottom = false }: Props) => {
  return (
    <Box
      backgroundColor="offwhite"
      // flexDirection="row"
      // justifyContent="space-between"
      // alignItems="center"
      padding="m"
      marginBottom="xs"
      borderBottomLeftRadius={bottom ? 'm' : 'none'}
      borderBottomRightRadius={bottom ? 'm' : 'none'}
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
    </Box>
  )
}

export default SendLockedField
