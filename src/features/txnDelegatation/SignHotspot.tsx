import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import {
  AddGateway,
  WalletLink,
  Location,
  Transfer,
} from '@helium/react-native-sdk'
import animalHash from 'angry-purple-tiger'
import Box from '../../components/Box'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { getKeypair, verifyAppLinkAuthToken } from '../../utils/secureAccount'
import * as Logger from '../../utils/logger'

type Route = RouteProp<RootStackParamList, 'SignHotspot'>
const SignHotspot = () => {
  const {
    params: { token, addGatewayTxn, assertLocationTxn, transferHotspotTxn } = {
      token: '',
      addGatewayTxn: '',
      assertLocationTxn: '',
      transferHotspotTxn: '',
    },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const [validated, setValidated] = useState<boolean>()

  const parsedToken = useMemo(() => {
    if (!token) return
    return WalletLink.parseWalletLinkToken(token)
  }, [token])

  const callback = useCallback(
    async (responseParams: WalletLink.SignHotspotResponse) => {
      if (!parsedToken?.callbackUrl) return
      const url = WalletLink.createSignHotspotCallbackUrl(
        parsedToken.callbackUrl,
        responseParams,
      )
      Linking.openURL(url)

      navigation.navigate('MainTabs')
    },
    [navigation, parsedToken?.callbackUrl],
  )

  useEffect(() => {
    if (validated === false) {
      callback({ status: 'token_not_found' })
    }
  }, [callback, validated])

  const gatewayTxn = useMemo(() => {
    if (!addGatewayTxn) return
    return AddGateway.txnFromString(addGatewayTxn)
  }, [addGatewayTxn])

  const locationTxn = useMemo(() => {
    if (!assertLocationTxn) return
    return Location.txnFromString(assertLocationTxn)
  }, [assertLocationTxn])

  const transferTxn = useMemo(() => {
    if (!transferHotspotTxn) return
    return Transfer.txnFromString(transferHotspotTxn)
  }, [transferHotspotTxn])

  const linkInvalid = useMemo(() => {
    return !addGatewayTxn && !assertLocationTxn && !transferTxn
  }, [addGatewayTxn, assertLocationTxn, transferTxn])

  const gatewayAddress = useMemo(
    () =>
      gatewayTxn?.gateway?.b58 ||
      locationTxn?.gateway?.b58 ||
      transferTxn?.gateway?.b58,
    [
      gatewayTxn?.gateway?.b58,
      locationTxn?.gateway?.b58,
      transferTxn?.gateway?.b58,
    ],
  )

  const handleLink = useCallback(async () => {
    try {
      const ownerKeypair = await getKeypair()

      const responseParams = {
        status: 'success',
        gatewayAddress,
      } as WalletLink.SignHotspotResponse

      if (gatewayTxn) {
        const txnOwnerSigned = await gatewayTxn.sign({
          owner: ownerKeypair,
        })

        if (!txnOwnerSigned.gateway?.b58) {
          callback({ status: 'gateway_not_found' })
          throw new Error('Failed to sign gateway txn')
        }

        responseParams.gatewayTxn = txnOwnerSigned.toString()
      }

      if (locationTxn && locationTxn.gateway?.b58) {
        const ownerIsPayer = locationTxn.payer?.b58 === locationTxn.owner?.b58
        const txnOwnerSigned = await locationTxn.sign({
          owner: ownerKeypair,
          payer: ownerIsPayer ? ownerKeypair : undefined,
        })
        responseParams.assertTxn = txnOwnerSigned.toString()
      }

      if (transferTxn) {
        if (!ownerKeypair) {
          callback({ status: 'token_not_found' })
          throw new Error('Failed to sign transfer txn')
        }

        const txnTransferSigned = await transferTxn.sign({
          owner: ownerKeypair,
        })

        if (!txnTransferSigned.gateway?.b58) {
          callback({ status: 'gateway_not_found' })
          throw new Error('Failed to sign transfer txn')
        }

        responseParams.transferTxn = txnTransferSigned.toString()
      }

      callback(responseParams)
    } catch (e) {
      Logger.error(e)
    }
  }, [callback, gatewayAddress, gatewayTxn, locationTxn, transferTxn])

  const handleCancel = useCallback(async () => {
    callback({ status: 'user_cancelled' })
  }, [callback])

  const handleError = useCallback(async () => {
    callback({ status: 'invalid_link' })
  }, [callback])

  const name = useMemo(() => {
    if (!gatewayAddress) return
    return animalHash(gatewayAddress || '')
  }, [gatewayAddress])

  const location = useMemo(() => {
    return locationTxn?.location
  }, [locationTxn?.location])

  const title = useMemo(() => {
    if (gatewayTxn) {
      return t('signHotspot.title')
    }
    if (locationTxn) {
      return t('signHotspot.titleLocationOnly')
    }
    if (transferTxn) {
      return t('signHotspot.titleTransfer')
    }
  }, [gatewayTxn, locationTxn, t, transferTxn])

  useEffect(() => {
    if (!parsedToken) return
    verifyAppLinkAuthToken(parsedToken)
      .then((valid) => {
        setValidated(valid)
      })
      .catch(() => {
        setValidated(false)
      })
  }, [parsedToken, token])

  if (linkInvalid) {
    return (
      <SafeAreaBox backgroundColor="primaryBackground" flex={1} padding="xl">
        <Box justifyContent="center" flex={1}>
          <Text variant="bold" fontSize={36} marginBottom="m">
            {t('signHotspot.error.title')}
          </Text>
          <Text variant="body1">
            {t('signHotspot.error.subtitle', {
              maker: parsedToken?.appName || 'Maker',
            })}
          </Text>
        </Box>
        {parsedToken?.callbackUrl && (
          <Box justifyContent="flex-end" flex={1}>
            <TouchableOpacityBox
              minHeight={56}
              justifyContent="center"
              backgroundColor="greenBright"
              borderRadius="l"
              onPress={handleError}
            >
              <Text
                variant="medium"
                fontSize={16}
                color="primaryBackground"
                textAlign="center"
              >
                {t('signHotspot.error.takeMeBack', {
                  maker: parsedToken?.appName || 'Maker',
                })}
              </Text>
            </TouchableOpacityBox>
          </Box>
        )}
      </SafeAreaBox>
    )
  }

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      padding="xl"
      justifyContent="center"
    >
      <Text variant="bold" fontSize={34} adjustsFontSizeToFit>
        {title}
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
          {locationTxn?.gain !== undefined && (
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
          {locationTxn?.elevation !== undefined && (
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
        {transferTxn?.newOwner !== undefined && (
          <>
            <Text variant="regular" fontSize={16} color="purpleText">
              {t('signHotspot.newOwner')}
            </Text>
            <Text
              variant="bold"
              fontSize={16}
              color="primaryBackground"
              marginBottom="m"
            >
              {transferTxn.newOwner.b58}
            </Text>
          </>
        )}
        {!!parsedToken?.address && (
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
              {parsedToken.address}
            </Text>
          </>
        )}
        {!!parsedToken?.appName && (
          <>
            <Text variant="regular" fontSize={16} color="purpleText">
              {t('signHotspot.maker')}
            </Text>
            <Text variant="bold" fontSize={20} color="primaryBackground">
              {parsedToken.appName}
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
          disabled={!validated}
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
