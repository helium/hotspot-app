import React, { useCallback, useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Fingerprint from '@assets/images/fingerprint.svg'
import { AddGatewayV1 } from '@helium/transactions'
import { ActivityIndicator } from 'react-native'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import { useBreakpoints, useColors } from '../../../theme/themeHooks'
import { getOnboardingRecord } from '../../../utils/stakingClient'
import animateTransition from '../../../utils/animateTransition'
import Button from '../../../components/Button'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupQrConfirmScreen'
>

const HotspotSetupQrConfirmScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const colors = useColors()
  const breakpoints = useBreakpoints()
  const [publicKey, setPublicKey] = useState('')
  const [macAddress, setMacAddress] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')

  useEffect(() => {
    if (!publicKey) return

    const getMac = async () => {
      const record = await getOnboardingRecord(publicKey)
      animateTransition('HotspotSetupQrConfirmScreen.GetMac')
      setMacAddress(record.macEth0)
    }
    getMac()
  }, [publicKey])

  useEffect(() => {
    if (!params.addGatewayTxn) return

    const addGatewayTxn = AddGatewayV1.fromString(params.addGatewayTxn)

    setPublicKey(addGatewayTxn.gateway?.b58 || '')
    setOwnerAddress(addGatewayTxn.owner?.b58 || '')
  }, [params])

  const navNext = useCallback(
    () =>
      navigation.push('HotspotSetupLocationInfoScreen', {
        addGatewayTxn: params.addGatewayTxn,
        hotspotAddress: publicKey,
      }),
    [navigation, params.addGatewayTxn, publicKey],
  )

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      paddingTop={{ smallPhone: 's', phone: 'lx' }}
    >
      <Box
        height={52}
        width={52}
        backgroundColor="purple500"
        borderRadius="m"
        alignItems="center"
        justifyContent="center"
      >
        <Fingerprint color={colors.purpleMain} width={26} height={26} />
      </Box>
      <Text
        variant="h1"
        fontSize={breakpoints.smallPhone ? 28 : 40}
        numberOfLines={breakpoints.smallPhone ? 1 : 2}
        adjustsFontSizeToFit
        marginTop="l"
      >
        {breakpoints.smallPhone
          ? t('hotspot_setup.qrConfirm.title_one_line')
          : t('hotspot_setup.qrConfirm.title')}
      </Text>
      <Box
        padding="l"
        backgroundColor="offblack"
        borderTopLeftRadius="s"
        borderTopRightRadius="s"
        marginTop={{ smallPhone: 'm', phone: 'xl' }}
        justifyContent="center"
      >
        <Text
          variant="medium"
          color="purpleLight"
          fontSize={16}
          maxFontSizeMultiplier={1}
        >
          {t('hotspot_setup.qrConfirm.public_key')}
        </Text>
        <Text
          variant="light"
          fontSize={18}
          marginTop="xs"
          maxFontSizeMultiplier={1}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {publicKey}
        </Text>
      </Box>
      <Box
        padding="l"
        backgroundColor="offblack"
        marginTop="xs"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Text
          variant="medium"
          color="purpleLight"
          fontSize={16}
          maxFontSizeMultiplier={1}
        >
          {t('hotspot_setup.qrConfirm.mac_address')}
        </Text>
        {macAddress ? (
          <Text
            variant="light"
            marginTop="xs"
            fontSize={18}
            maxFontSizeMultiplier={1}
          >
            {macAddress}
          </Text>
        ) : (
          <Box marginTop="s">
            <ActivityIndicator color="white" />
          </Box>
        )}
      </Box>
      <Box
        marginTop="xs"
        backgroundColor="offblack"
        borderBottomLeftRadius="s"
        borderBottomRightRadius="s"
        padding="l"
        justifyContent="center"
      >
        <Text
          variant="medium"
          color="purpleLight"
          fontSize={16}
          maxFontSizeMultiplier={1}
        >
          {t('hotspot_setup.qrConfirm.owner_address')}
        </Text>
        <Text
          variant="light"
          fontSize={18}
          maxFontSizeMultiplier={1}
          marginTop="xs"
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {ownerAddress}
        </Text>
      </Box>
      <Box flex={1} />
      <Button
        title={t('generic.next')}
        mode="contained"
        variant="primary"
        onPress={navNext}
      />
    </BackScreen>
  )
}

export default HotspotSetupQrConfirmScreen
