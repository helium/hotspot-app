import { RouteProp, useRoute } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { getUnixTime } from 'date-fns'
import Box from '../../components/Box'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import { RootStackParamList } from '../../navigation/main/tabTypes'
import { getSecureItem } from '../../utils/secureAccount'

type Route = RouteProp<RootStackParamList, 'LinkWallet'>
const LinkWallet = () => {
  const {
    params: { callbackUrl, requestAppId, requestAppName },
  } = useRoute<Route>()
  const { t } = useTranslation()
  const { result: address } = useAsync(getSecureItem, ['address'])

  const handleLink = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(callbackUrl)
      if (!canOpen) return

      const timestamp = getUnixTime(new Date())
      const token = `${address},${timestamp},${requestAppId}`
      const buff = Buffer.from(token, 'utf8')
      const tokenStr = buff.toString('base64')
      const url = `${callbackUrl}link_wallet&token=${tokenStr}`
      Linking.openURL(url)
    } catch (e) {
      console.error(e)
    }
  }, [address, callbackUrl, requestAppId])

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      padding="xl"
      justifyContent="space-around"
    >
      <Text variant="h2" textAlign="center">
        {t('linkWallet.title', { appName: requestAppName })}
      </Text>
      <Text variant="body1" textAlign="center">
        {t('linkWallet.body', { appName: requestAppName })}
      </Text>
      <Box>
        <TouchableOpacityBox padding="l" onPress={handleLink}>
          <Text variant="subtitle" textAlign="center" color="white">
            {t('generic.yes')}
          </Text>
        </TouchableOpacityBox>
        <TouchableOpacityBox padding="l">
          <Text variant="subtitle" textAlign="center">
            {t('generic.cancel')}
          </Text>
        </TouchableOpacityBox>
      </Box>
    </SafeAreaBox>
  )
}

export default memo(LinkWallet)
