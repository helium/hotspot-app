import React, { memo, useCallback } from 'react'
import InfoCaution from '@assets/images/caution.svg'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { Linking } from 'react-native'
import Text from './Text'
import Box from './Box'
import { useGetSolanaStatusQuery } from '../store/solana/solanaStatusApi'
import Button from './Button'
import { RootState } from '../store/rootReducer'
import { RootNavigationProp } from '../navigation/main/tabTypes'
import CloseButton from './CloseButton'
import TextTransform from './TextTransform'
import Articles from '../constants/articles'
import TouchableOpacityBox from './TouchableOpacityBox'

const SentinelScreen = () => {
  const { t } = useTranslation()
  const { data: status } = useGetSolanaStatusQuery()
  const navigation = useNavigation<RootNavigationProp>()
  const { isPinRequired } = useSelector((state: RootState) => state.app)

  const handleClose = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleDownload = useCallback(() => {
    Linking.openURL(Articles.Wallet_Site)
  }, [])

  const handleMoreInfo = useCallback(() => {
    Linking.openURL(Articles.Docs_Root)
  }, [])

  const exportAccount = useCallback(() => {
    if (isPinRequired) {
      navigation.navigate('LockScreen', {
        requestType: 'revealPrivateKey',
      })
    } else {
      navigation.navigate('MainTabs', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        screen: 'More',
        params: {
          screen: 'RevealPrivateKeyScreen',
        },
      })
    }
  }, [isPinRequired, navigation])

  return (
    <Box backgroundColor="white" flex={1} padding="l">
      <CloseButton
        buttonColor="secondaryText"
        alignSelf="flex-end"
        onPress={handleClose}
      />
      <Box
        justifyContent="center"
        alignItems="center"
        marginBottom="xl"
        marginTop="xxl"
      >
        <InfoCaution color="#FFB156" />
      </Box>
      <Text
        variant="h1"
        textAlign="center"
        color="black"
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {t(`sentinel.${status?.migrationStatus}.title`)}
      </Text>
      <TextTransform
        variant="body1"
        color="black"
        textAlign="center"
        marginTop="m"
        i18nKey={`sentinel.${status?.migrationStatus}.body`}
      />
      <TouchableOpacityBox onPress={handleMoreInfo}>
        <Text
          variant="body2"
          color="blueBrightDarkened"
          textAlign="center"
          marginTop="l"
          textDecorationLine="underline"
        >
          {t('sentinel.infoAction')}
        </Text>
      </TouchableOpacityBox>

      <Box flex={1} />

      <Button
        mode="text"
        borderRadius="round"
        onPress={handleDownload}
        title={t('sentinel.action')}
        color="blueBrightDarkened"
        marginTop="xxl"
      />

      <Button
        borderRadius="round"
        onPress={exportAccount}
        backgroundColor="blueBrightDarkened"
        title={t('sentinel.mainAction')}
        color="white"
        marginVertical="m"
      />
    </Box>
  )
}

export default memo(SentinelScreen)
