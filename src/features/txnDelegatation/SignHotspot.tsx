import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { AddGateway, WalletLink, Location } from '@helium/react-native-sdk'
import animalHash from 'angry-purple-tiger'
import qs from 'qs'
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
    params: {
      callbackUrl,
      requestAppName,
      token,
      addGatewayTxn,
      assertLocationTxn,
      makerName,
    },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const [hasStoredToken, setHasStoredToken] = useState<boolean>()

  const callback = useCallback(
    async (responseParams: WalletLink.SignHotspotResponse) => {
      try {
        const url = `${callbackUrl}sign_hotspot?${qs.stringify(responseParams)}`
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
          Linking.openURL(url)
        }
      } catch (e) {
        console.error(e)
      }

      navigation.goBack()
    },
    [callbackUrl, navigation],
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
      console.error(e)
    }
    navigation.goBack()
  }, [callback, gatewayTxn, locationTxn, navigation])

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
      justifyContent="space-around"
    >
      <Text variant="h2" textAlign="center">
        {t('signHotspot.title', { appName: requestAppName })}
      </Text>

      <Box>
        <Text variant="body2" textAlign="center" marginBottom="m">
          {t('signHotspot.name', { name })}
        </Text>
        {location && (
          <Text variant="body2" textAlign="center" marginBottom="m">
            {t('signHotspot.location', { location })}
          </Text>
        )}
        {owner && (
          <Text variant="body2" textAlign="center" marginBottom="m">
            {t('signHotspot.owner', { owner })}
          </Text>
        )}
        {makerName && (
          <Text variant="body2" textAlign="center" marginBottom="m">
            {t('signHotspot.maker', { maker: makerName })}
          </Text>
        )}
      </Box>
      <Box>
        <TouchableOpacityBox
          padding="l"
          paddingHorizontal="xxl"
          onPress={handleLink}
        >
          <Text variant="subtitle" textAlign="center" color="white">
            {t('generic.yes')}
          </Text>
        </TouchableOpacityBox>
        <TouchableOpacityBox
          padding="l"
          paddingHorizontal="xxl"
          onPress={handleCancel}
        >
          <Text variant="subtitle" textAlign="center">
            {t('generic.cancel')}
          </Text>
        </TouchableOpacityBox>
      </Box>
    </SafeAreaBox>
  )
}

export default memo(SignHotspot)
