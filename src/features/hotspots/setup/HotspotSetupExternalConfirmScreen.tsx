import React, { useCallback, useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Fingerprint from '@assets/images/fingerprint.svg'
import { AddGatewayV1 } from '@helium/transactions'
import { ActivityIndicator } from 'react-native'
import { useAsync } from 'react-async-hook'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import { useBreakpoints, useColors } from '../../../theme/themeHooks'
import {
  getOnboardingRecord,
  OnboardingRecord,
} from '../../../utils/stakingClient'
import animateTransition from '../../../utils/animateTransition'
import { DebouncedButton } from '../../../components/Button'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { getSecureItem } from '../../../utils/secureAccount'

type Route = RouteProp<
  HotspotSetupStackParamList,
  'HotspotSetupExternalConfirmScreen'
>

const HotspotSetupExternalConfirmScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const colors = useColors()
  const breakpoints = useBreakpoints()
  const { result: address } = useAsync(getSecureItem, ['address'])
  const [publicKey, setPublicKey] = useState('')
  const [macAddress, setMacAddress] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  const [onboardingRecord, setOnboardingRecord] = useState<OnboardingRecord>()
  const rootNav = useNavigation<RootNavigationProp>()

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  useEffect(() => {
    if (!publicKey) return

    const getRecord = async () => {
      const record = await getOnboardingRecord(publicKey)
      animateTransition('HotspotSetupExternalConfirmScreen.GetMac')
      setMacAddress(record.macEth0 || t('generic.unknown'))
      setOnboardingRecord(record)
    }
    getRecord()
  }, [publicKey, t])

  useEffect(() => {
    if (!params.addGatewayTxn) return

    const addGatewayTxn = AddGatewayV1.fromString(params.addGatewayTxn)

    setPublicKey(addGatewayTxn.gateway?.b58 || '')
    setOwnerAddress(addGatewayTxn.owner?.b58 || '')
  }, [params])

  const navNext = useCallback(() => {
    if (!onboardingRecord) return
    navigation.push('HotspotSetupLocationInfoScreen', {
      addGatewayTxn: params.addGatewayTxn,
      hotspotAddress: publicKey,
      onboardingRecord,
    })
  }, [navigation, onboardingRecord, params.addGatewayTxn, publicKey])

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      paddingTop={{ smallPhone: 's', phone: 'lx' }}
      onClose={handleClose}
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
          ? t('hotspot_setup.confirm.title_one_line')
          : t('hotspot_setup.confirm.title')}
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
          {t('hotspot_setup.confirm.public_key')}
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
          {t('hotspot_setup.confirm.mac_address')}
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
          {t('hotspot_setup.confirm.owner_address')}
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
      <DebouncedButton
        title={t('generic.next')}
        mode="contained"
        variant="primary"
        onPress={navNext}
        disabled={ownerAddress !== address}
      />
    </BackScreen>
  )
}

export default HotspotSetupExternalConfirmScreen
