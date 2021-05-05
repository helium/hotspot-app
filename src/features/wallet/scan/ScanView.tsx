import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Crosshair from './Crosshair'
import { wp } from '../../../utils/layout'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import useHaptic from '../../../utils/useHaptic'
import BSHandle from '../../../components/BSHandle'
import { useSpacing } from '../../../theme/themeHooks'
import { useAppLinkContext } from '../../../providers/AppLinkProvider'
import { AppLinkCategoryType } from '../../../providers/appLinkTypes'

type Props = {
  scanType?: AppLinkCategoryType
  showBottomSheet?: boolean
}
const ScanView = ({ scanType = 'payment', showBottomSheet = true }: Props) => {
  const { t } = useTranslation()
  const { triggerNavHaptic, triggerNotification } = useHaptic()
  const [scanned, setScanned] = useState(false)
  const navigation = useNavigation()
  const spacing = useSpacing()

  const { handleBarCode } = useAppLinkContext()

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

  const handleBarCodeScanned = async (result: BarCodeScannerResult) => {
    if (scanned) return

    try {
      await handleBarCode(result, scanType)

      setScanned(true)
      triggerNotification('success')
    } catch (error) {
      handleFailedScan()
    }
  }

  const handleFailedScan = () => {
    setScanned(true)
    setTimeout(() => setScanned(false), 2000)
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
