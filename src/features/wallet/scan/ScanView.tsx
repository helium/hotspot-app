import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { StyleSheet } from 'react-native'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import BottomSheet from 'react-native-holy-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Crosshair from './Crosshair'
import { wp } from '../../../utils/layout'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { triggerNavHaptic, triggerNotification } from '../../../utils/haptic'
import sleep from '../../../utils/sleep'

type Props = {
  fromSend: boolean
}

const ScanView = ({ fromSend = false }: Props) => {
  const [scanned, setScanned] = useState<boolean>(false)
  const navigation = useNavigation()

  const { result: permissions } = useAsync(
    BarCodeScanner.requestPermissionsAsync,
    [],
  )

  const navBack = () => {
    navigation.goBack()
    triggerNavHaptic()
  }

  const handleBarCodeScanned = async ({ data }: BarCodeScannerResult) => {
    if (scanned) return

    setScanned(true)
    triggerNotification('success')

    // TODO validate qr code contents and pass to send screen as props
    const address = data

    if (fromSend) {
      navigation.navigate('Send', { address })
    } else {
      navigation.navigate('Wallet')
      await sleep(200)
      navigation.navigate('Send', { address })
    }
  }

  if (!permissions) {
    return <Box flex={1} backgroundColor="black" />
  }

  if (!permissions.granted) {
    return (
      <Box flex={1} backgroundColor="black">
        <CloseButton safeOffset={!fromSend} onPress={navBack} />
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="white" textAlign="center">
            No access to camera
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box flex={1}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
      />
      <CloseButton safeOffset={!fromSend} onPress={navBack} />
      <Box flex={0.7} justifyContent="center" alignItems="center">
        <Crosshair width={wp(65)} height={wp(65)} color="white" />
      </Box>
      <BottomSheet snapPoints={[300]} initialSnapIndex={0}>
        <Box>
          <Text>Find a code to scan</Text>
          <Text>Put some more instructions here</Text>
        </Box>
      </BottomSheet>
    </Box>
  )
}

const CloseButton = ({
  safeOffset = false,
  onPress,
}: {
  safeOffset: boolean
  onPress?: () => void
}) => {
  const insets = useSafeAreaInsets()

  return (
    <TouchableOpacityBox
      onPress={onPress}
      width={50}
      height={50}
      position="absolute"
      right={30}
      top={safeOffset ? insets.top + 30 : 30}
      justifyContent="center"
      alignItems="center"
      zIndex={1}
    >
      <Close color="white" width={24} height={24} />
    </TouchableOpacityBox>
  )
}

export default ScanView
