import React from 'react'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CloseModal from '../../../assets/images/closeModal.svg'
import Box from '../../../components/Box'

type Props = { onClose: () => void }
const HotspotDiagnostics = ({ onClose }: Props) => {
  return (
    <>
      <Box
        backgroundColor="primaryMain"
        borderTopRightRadius="l"
        borderTopLeftRadius="l"
        padding="l"
        minHeight={194}
      >
        <Box flexDirection="row" justifyContent="flex-end">
          <TouchableOpacityBox onPress={onClose}>
            <CloseModal color="gray" />
          </TouchableOpacityBox>
        </Box>
      </Box>
      <Box padding="l" minHeight={340}>
        <Text variant="h4" color="black" marginBottom="ms">
          Scanning will happen here
        </Text>
      </Box>
    </>
  )
}

export default HotspotDiagnostics
