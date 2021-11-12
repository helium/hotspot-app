import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { AddGateway, WalletLink, Location } from '@helium/react-native-sdk'
import animalHash from 'angry-purple-tiger'
import Box from '../../components/Box'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { getKeypair, hasAppLinkAuthToken } from '../../utils/secureAccount'
import { getStakingSignedTransaction } from '../../utils/stakingClient'

type Route = RouteProp<RootStackParamList, 'SignHotspot'>
const SignHotspot = () => {
  const {
    params: { requestAppId, token, addGatewayTxn, assertLocationTxn },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const [hasStoredToken, setHasStoredToken] = useState<boolean>()

  const makerApp = useMemo(() => WalletLink.getMakerApp(requestAppId), [
    requestAppId,
  ])

  const callback = useCallback(
    async (responseParams: WalletLink.SignHotspotResponse) => {
      if (!makerApp?.universalLink) return
      const url = WalletLink.createSignHotspotCallbackUrl(
        makerApp.universalLink,
        responseParams,
      )
      Linking.openURL(url)

      navigation.navigate('MainTabs')
    },
    [makerApp?.universalLink, navigation],
  )

  useEffect(() => {
    if (hasStoredToken === false) {
      callback({ status: 'token_not_found' })
    }
  }, [callback, hasStoredToken])

  const gatewayTxn = useMemo(() => {
    if (!addGatewayTxn) return
    return AddGateway.txnFromString(addGatewayTxn)
  }, [addGatewayTxn])

  const locationTxn = useMemo(() => {
    if (!assertLocationTxn) return
    return Location.txnFromString(assertLocationTxn)
  }, [assertLocationTxn])

  const handleLink = useCallback(async () => {
    try {
      const ownerKeypair = await getKeypair()

      const responseParams = {
        status: 'success',
      } as WalletLink.SignHotspotResponse

      if (gatewayTxn) {
        const txnOwnerSigned = await gatewayTxn.sign({
          owner: ownerKeypair,
        })

        if (!txnOwnerSigned.gateway?.b58) {
          callback({ status: 'gateway_not_found' })
          throw new Error('Failed to sign gateway txn')
        }

        const signedGatewayTxn = await getStakingSignedTransaction(
          txnOwnerSigned.gateway.b58,
          txnOwnerSigned.toString(),
        )
        responseParams.gatewayTxn = signedGatewayTxn
      }

      if (locationTxn && locationTxn.gateway?.b58) {
        const ownerIsPayer = locationTxn.payer?.b58 === locationTxn.owner?.b58
        const txnOwnerSigned = await locationTxn.sign({
          owner: ownerKeypair,
          payer: ownerIsPayer ? ownerKeypair : undefined,
        })
        let finalTxn = txnOwnerSigned.toString()
        if (!ownerIsPayer) {
          const stakingServerSignedTxn = await getStakingSignedTransaction(
            locationTxn.gateway.b58,
            finalTxn,
          )
          finalTxn = stakingServerSignedTxn
        }

        responseParams.assertTxn = finalTxn
      }

      callback(responseParams)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }, [callback, gatewayTxn, locationTxn])

  const handleCancel = useCallback(async () => {
    callback({ status: 'user_cancelled' })
  }, [callback])

  const name = useMemo(() => {
    if (!gatewayTxn?.gateway?.b58 && !locationTxn?.gateway?.b58) return
    return animalHash(
      gatewayTxn?.gateway?.b58 || locationTxn?.gateway?.b58 || '',
    )
  }, [gatewayTxn?.gateway?.b58, locationTxn?.gateway?.b58])

  const location = useMemo(() => {
    return locationTxn?.location
  }, [locationTxn?.location])

  useEffect(() => {
    hasAppLinkAuthToken(token).then(setHasStoredToken)
  }, [token])

  const owner = useMemo(() => {
    if (!token || !hasStoredToken) return
    const parsedToken = WalletLink.parseWalletLinkToken(token)
    if (!parsedToken) return
    return parsedToken.address
  }, [hasStoredToken, token])

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      padding="xl"
      justifyContent="center"
    >
      <Text variant="bold" fontSize={36}>
        {t(gatewayTxn ? 'signHotspot.title' : 'signHotspot.titleLocationOnly')}
      </Text>

      <Box backgroundColor="white" borderRadius="l" padding="l" marginTop="l">
        <Text variant="regular" fontSize={16} color="purpleText">
          {t('signHotspot.name')}
        </Text>
        <Text
          variant="bold"
          fontSize={20}
          color="primaryBackground"
          marginBottom="m"
        >
          {name}
        </Text>
        {location && (
          <>
            <Text variant="regular" fontSize={16} color="purpleText">
              {t('signHotspot.location')}
            </Text>
            <Text
              variant="bold"
              fontSize={20}
              color="primaryBackground"
              marginBottom="m"
            >
              {location}
            </Text>
          </>
        )}
        <Box flexDirection="row">
          {locationTxn?.gain && (
            <Box marginEnd="xxl">
              <Text variant="regular" fontSize={16} color="purpleText">
                {t('signHotspot.gain')}
              </Text>
              <Text
                variant="bold"
                fontSize={20}
                color="primaryBackground"
                marginBottom="m"
              >
                {locationTxn.gain}
              </Text>
            </Box>
          )}
          {locationTxn?.elevation && (
            <Box>
              <Text variant="regular" fontSize={16} color="purpleText">
                {t('signHotspot.elevation')}
              </Text>
              <Text
                variant="bold"
                fontSize={20}
                color="primaryBackground"
                marginBottom="m"
              >
                {locationTxn.elevation}
              </Text>
            </Box>
          )}
        </Box>
        {owner && (
          <>
            <Text variant="regular" fontSize={16} color="purpleText">
              {t('signHotspot.owner')}
            </Text>
            <Text
              variant="bold"
              fontSize={16}
              color="primaryBackground"
              marginBottom="m"
            >
              {owner}
            </Text>
          </>
        )}
        {makerApp?.name && (
          <>
            <Text variant="regular" fontSize={16} color="purpleText">
              {t('signHotspot.maker')}
            </Text>
            <Text variant="bold" fontSize={20} color="primaryBackground">
              {makerApp.name}
            </Text>
          </>
        )}
      </Box>
      <Box flexDirection="row" marginTop="l">
        <TouchableOpacityBox
          flex={1}
          minHeight={56}
          justifyContent="center"
          backgroundColor="purpleDull"
          marginEnd="m"
          borderRadius="l"
          onPress={handleCancel}
        >
          <Text variant="medium" fontSize={16} color="white" textAlign="center">
            {t('generic.cancel')}
          </Text>
        </TouchableOpacityBox>
        <TouchableOpacityBox
          flex={1}
          minHeight={56}
          justifyContent="center"
          backgroundColor="greenBright"
          borderRadius="l"
          onPress={handleLink}
        >
          <Text
            variant="medium"
            fontSize={16}
            color="primaryBackground"
            textAlign="center"
          >
            {t('hotspot_settings.reassert.confirm')}
          </Text>
        </TouchableOpacityBox>
      </Box>
    </SafeAreaBox>
  )
}

export default memo(SignHotspot)
