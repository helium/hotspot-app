import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Address } from '@helium/crypto-react-native'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Crosshair from './Crosshair'
import { wp } from '../../../utils/layout'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import useHaptic from '../../../utils/useHaptic'
import { QrScanResult, ScanType } from './scanTypes'
import BSHandle from '../../../components/BSHandle'
import { useSpacing } from '../../../theme/themeHooks'
import { RootState } from '../../../store/rootReducer'

type Props = {
  scanType?: ScanType
  showBottomSheet?: boolean
}
const ScanView = ({ scanType = 'payment', showBottomSheet = true }: Props) => {
  const { t } = useTranslation()
  const { triggerNavHaptic, triggerNotification } = useHaptic()
  const [scanned, setScanned] = useState(false)
  const navigation = useNavigation()
  const spacing = useSpacing()
  const {
    app: { isPinRequiredForPayment },
  } = useSelector((state: RootState) => state)

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

      if (isPinRequiredForPayment) {
        navigation.navigate('LockScreen', {
          requestType: 'send',
          scanResult,
        })
      } else {
        navigation.navigate('Send', { scanResult })
      }
    } catch (error) {
      handleFailedScan()
    }
  }

  const parseBarCodeData = (data: string): QrScanResult => {
    // The data scanned from the QR code is expected to be one of these possibilities:
    // (1) address string
    // (2) stringified JSON object { type, address, amount?, memo? }
    // (3) stringified JSON object { type, payees: [{ address, amount?, memo? }] }

    // Case (1) address string
    if (Address.isValid(data)) {
      return {
        type: scanType,
        payees: [{ address: data }],
      }
    }

    try {
      let scanResult: QrScanResult
      const rawScanResult = JSON.parse(data)

      if (rawScanResult.address) {
        // Case (2) stringified JSON { type, address, amount?, memo? }
        scanResult = {
          type: rawScanResult.type || scanType,
          payees: [
            {
              address: rawScanResult.address,
              amount: rawScanResult.amount,
              memo: rawScanResult.memo,
            },
          ],
        }
      } else if (rawScanResult.payees) {
        // Case (3) stringified JSON { type, payees: [{ address, amount?, memo? }] }
        scanResult = {
          type: rawScanResult.type || scanType,
          payees: rawScanResult.payees,
        }
      } else {
        // Unknown encoding
        throw new Error('Invalid transaction encoding')
      }

      // Validate attributes before returning
      if (!['payment', 'dc_burn'].includes(scanResult.type)) {
        throw new Error('Invalid transaction encoding')
      }
      scanResult.payees.forEach(({ address }) => {
        if (!address || !Address.isValid(address)) {
          throw new Error('Invalid transaction encoding')
        }
      })

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
                <Text variant="body2Bold" color="blueMain">
                  {t('send.scan.learn_more')}
                </Text>
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
                <Text variant="body2Bold" color="blueMain">
                  {t('send.scan.learn_more')}
                </Text>
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
                <Text variant="body2Bold" color="blueMain">
                  {t('send.scan.learn_more')}
                </Text>
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
