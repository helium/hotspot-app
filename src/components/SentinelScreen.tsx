import React, { memo, useCallback } from 'react'
import InfoError from '@assets/images/infoError.svg'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Text from './Text'
import Box from './Box'
import { useGetSolanaStatusQuery } from '../store/solana/solanaStatusApi'
import Button from './Button'
import { RootState } from '../store/rootReducer'
import { RootNavigationProp } from '../navigation/main/tabTypes'

const SentinelScreen = () => {
  const { t } = useTranslation()
  const { data: status } = useGetSolanaStatusQuery()
  const navigation = useNavigation<RootNavigationProp>()
  const { isPinRequired } = useSelector((state: RootState) => state.app)

  const handleClose = useCallback(() => {
    navigation.goBack()
  }, [navigation])

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
    <Box
      backgroundColor="primaryBackground"
      flex={1}
      justifyContent="center"
      paddingHorizontal="l"
    >
      <Box justifyContent="center" alignItems="center" marginBottom="xl">
        <InfoError />
      </Box>
      <Text variant="h1" textAlign="center" fontSize={40} lineHeight={42}>
        {t(`sentinel.${status?.migrationStatus}.title`)}
      </Text>
      <Text
        variant="subtitle"
        color="secondaryText"
        textAlign="center"
        marginTop="m"
      >
        {t(`sentinel.${status?.migrationStatus}.body`)}
      </Text>

      <Button
        borderRadius="round"
        onPress={exportAccount}
        backgroundColor="primaryText"
        title={t('more.sections.security.revealPrivateKey')}
        color="black"
        marginTop="xxl"
      />

      <Button
        mode="text"
        borderRadius="round"
        onPress={handleClose}
        title={t('sentinel.action')}
        color="secondaryText"
        marginTop="m"
      />
    </Box>
  )
}

export default memo(SentinelScreen)
