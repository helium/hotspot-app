import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { StyleSheet } from 'react-native'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Address } from '@helium/crypto-react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Crosshair from './Crosshair'
import { wp } from '../../../utils/layout'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { triggerNavHaptic, triggerNotification } from '../../../utils/haptic'
import { QrScanResult } from './scanTypes'
import BSHandle from '../../../components/BSHandle'
import { useSpacing } from '../../../theme/themeHooks'

const ScanView = () => {
  const [scanned, setScanned] = useState(false)
  const navigation = useNavigation()
  const spacing = useSpacing()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false)
    })

    return unsubscribe
  }, [navigation])

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

    try {
      const scanResult = parseBarCodeData(data)

      setScanned(true)
      triggerNotification('success')

      navigation.navigate('Send', { scanResult })
    } catch (error) {
      handleFailedScan()
    }
  }

  const parseBarCodeData = (data: string): QrScanResult => {
    if (Address.isValid(data)) {
      return {
        type: 'payment',
        address: data,
      }
    }

    try {
      const scanResult: QrScanResult = JSON.parse(data)

      if (
        !['payment', 'dc_burn'].includes(scanResult.type) ||
        !scanResult.address ||
        !Address.isValid(scanResult.address)
      ) {
        throw new Error('Invalid transaction encoding')
      }

      return scanResult
    } catch (error) {
      throw new Error('Invalid transaction encoding')
    }
  }

  const handleFailedScan = () => {
    setScanned(true)
    setTimeout(() => setScanned(false), 1000)
    triggerNotification('error')
  }

  if (!permissions) {
    return <Box flex={1} backgroundColor="black" />
  }

  if (!permissions.granted) {
    return (
      <Box flex={1} backgroundColor="black">
        <CloseButton onPress={navBack} />
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
      <CloseButton onPress={navBack} />
      <Box flex={0.7} justifyContent="center" alignItems="center">
        <Crosshair width={wp(65)} height={wp(65)} color="white" />
      </Box>
      <BottomSheet snapPoints={[260, 400]} handleComponent={BSHandle}>
        <BottomSheetScrollView style={{ padding: spacing.m }}>
          <Box>
            <Text
              variant="subtitleBold"
              color="black"
              fontSize={18}
              marginBottom="s"
            >
              Find a QR Code to scan
            </Text>
            <Box marginBottom="s">
              <Text
                variant="subtitleBold"
                color="black"
                fontSize={16}
                marginBottom="xxs"
              >
                Send HNT
              </Text>
              <Text marginBottom="xs">
                HNT can be burned into Data Credits to pay for device network
                connectivity
              </Text>
              <Text variant="body2Bold" color="blueMain">
                Learn More
              </Text>
            </Box>
            <Box marginBottom="s">
              <Text
                variant="subtitleBold"
                color="black"
                fontSize={16}
                marginBottom="xxs"
              >
                Burn HNT to DC
              </Text>
              <Text marginBottom="xs">
                HNT can be burned into Data Credits to pay for device network
                connectivity
              </Text>
              <Text variant="body2Bold" color="blueMain">
                Learn More
              </Text>
            </Box>
            <Box marginBottom="s">
              <Text
                variant="subtitleBold"
                color="black"
                fontSize={16}
                marginBottom="xxs"
              >
                View my QR code
              </Text>
              <Text marginBottom="xs">
                HNT can be burned into Data Credits to pay for device network
                connectivity
              </Text>
              <Text variant="body2Bold" color="blueMain">
                Learn More
              </Text>
            </Box>
          </Box>
        </BottomSheetScrollView>
      </BottomSheet>
    </Box>
  )
}

const CloseButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacityBox
      onPress={onPress}
      width={50}
      height={50}
      position="absolute"
      right={30}
      top={30}
      justifyContent="center"
      alignItems="center"
      zIndex={1}
    >
      <Close color="white" width={24} height={24} />
    </TouchableOpacityBox>
  )
}

export default ScanView
