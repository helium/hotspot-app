import React from 'react'
import Box from '../../../components/Box'
import Bars from '../../../assets/images/bars.svg'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CarotDown from '../../../assets/images/carot-down.svg'

const TimelinePicker = () => (
  <Box flexDirection="row" alignItems="center" marginVertical="m">
    <Bars />
    <Text color="grayDark" fontSize={20} variant="bold" paddingStart="s">
      Past
    </Text>
    <TouchableOpacityBox flexDirection="row" marginHorizontal="xs">
      <Text color="purpleMain" fontSize={20} variant="bold">
        14 Days
      </Text>
      <Box padding="xs" paddingTop="ms">
        <CarotDown />
      </Box>
    </TouchableOpacityBox>
  </Box>
)

export default TimelinePicker
