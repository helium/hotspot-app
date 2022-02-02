import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { Platform, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { BarCodeScanner } from 'expo-barcode-scanner'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BarCodeScanningResult, Camera } from 'expo-camera'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Crosshair from './Crosshair'
import { wp, ww } from '../../../utils/layout'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import useAlert from '../../../utils/useAlert'
import useHaptic from '../../../utils/useHaptic'
import BSHandle from '../../../components/BSHandle'
import { useSpacing } from '../../../theme/themeHooks'
import {
  AddressType,
  InvalidAddressError,
  MismatchedAddressError,
  useAppLinkContext,
} from '../../../providers/AppLinkProvider'
import {
  AppLinkCategoryType,
  AppLinkLocation,
} from '../../../providers/appLinkTypes'
import { RootState } from '../../../store/rootReducer'

type Props = {
  scanType?: AppLinkCategoryType
  showBottomSheet?: boolean
}
const ScanView = ({ scanType = 'payment', showBottomSheet = true }: Props) => {
  const { t } = useTranslation()
  const { triggerNavHaptic, triggerNotification } = useHaptic()
  const { showOKAlert } = useAlert()
  const [scanned, setScanned] = useState(false)
  const navigation = useNavigation()
  const spacing = useSpacing()
  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots.data,
  )

  const { handleBarCode } = useAppLinkContext()

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setScanned(false)
    })
  }, [navigation])

  const { result: permissions } = useAsync(
    BarCodeScanner.requestPermissionsAsync,
    [],
  )

  const navBack = () => {
    navigation.goBack()
    triggerNavHaptic()
  }

  const handleBarCodeScanned = async (result: BarCodeScanningResult) => {
    if (scanned) return

    try {
      await handleBarCode(result, scanType, undefined, (scanResult) => {
        if (scanResult.type === 'hotspot_location') {
          const { hotspotAddress } = scanResult as AppLinkLocation
          const hotspot = hotspots.find((h) => h.address === hotspotAddress)
          if (!hotspot) throw new InvalidAddressError()
        }
      })

      setScanned(true)
      triggerNotification('success')
    } catch (error) {
      handleFailedScan(error)
    }
  }

  const handleFailedScan = async (error: Error) => {
    setScanned(true)
    setTimeout(() => setScanned(false), 2000)
    const isInvalidHotspotAddress =
      error instanceof InvalidAddressError &&
      error.addressType === AddressType.HotspotAddress
    const isInvalidSender =
      error instanceof InvalidAddressError &&
      error.addressType === AddressType.SenderAddress
    const isMismatchedSender =
      error instanceof MismatchedAddressError &&
      error.addressType === AddressType.SenderAddress
    if (isInvalidSender) {
      await showOKAlert({
        titleKey: 'send.scan.parse_code_error',
        messageKey: 'send.scan.invalid_sender_address',
      })
    } else if (isMismatchedSender) {
      await showOKAlert({
        titleKey: 'send.scan.parse_code_error',
        messageKey: 'send.scan.mismatched_sender_address',
      })
    } else if (isInvalidHotspotAddress) {
      await showOKAlert({
        titleKey: 'send.scan.parse_code_error',
        messageKey: 'send.scan.invalid_hotspot_address',
      })
    } else {
      // Default to haptic error notification
      triggerNotification('error')
    }
  }

  const CameraPreview = () => {
    if (Platform.OS === 'android') {
      return (
        <Box
          height={ww * (4 / 3)}
          width={ww}
          position="absolute"
          top={30}
          bottom={0}
          left={0}
          right={0}
        >
          <Camera
            onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
            barCodeScannerSettings={
              !scanned
                ? {
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                  }
                : undefined
            }
            style={StyleSheet.absoluteFillObject}
            ratio="4:3"
          />
        </Box>
      )
    }
    return (
      <Camera
        onBarCodeScanned={handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        style={StyleSheet.absoluteFillObject}
      />
    )
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
    <Box flex={1} backgroundColor="black">
      <CameraPreview />
      <CloseButton onPress={navBack} />
      <Box flex={0.7} justifyContent="center" alignItems="center">
        <Crosshair width={wp(65)} height={wp(65)} color="white" />
      </Box>
      {showBottomSheet && (
        <BottomSheet snapPoints={[260, 400]} handleComponent={BSHandle}>
          <BottomSheetScrollView style={{ padding: spacing.m }}>
            <Box>
              <Text
                variant="subtitleBold"
                color="black"
                fontSize={18}
                marginBottom="s"
              >
                {t('send.scan.title')}
              </Text>
              <Box marginBottom="s">
                <Text
                  variant="subtitleBold"
                  color="black"
                  fontSize={16}
                  marginBottom="xxs"
                >
                  {t('send.scan.send')}
                </Text>
                <Text marginBottom="xs">{t('send.scan.send_description')}</Text>
              </Box>
              <Box marginBottom="s">
                <Text
                  variant="subtitleBold"
                  color="black"
                  fontSize={16}
                  marginBottom="xxs"
                >
                  {t('send.scan.burn')}
                </Text>
                <Text marginBottom="xs">{t('send.scan.burn_description')}</Text>
              </Box>
              <Box marginBottom="s">
                <Text
                  variant="subtitleBold"
                  color="black"
                  fontSize={16}
                  marginBottom="xxs"
                >
                  {t('send.scan.view')}
                </Text>
                <Text marginBottom="xs">{t('send.scan.view_description')}</Text>
              </Box>
            </Box>
          </BottomSheetScrollView>
        </BottomSheet>
      )}
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
