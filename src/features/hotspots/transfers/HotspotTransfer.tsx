import React, { useCallback, useEffect, useState } from 'react'
import { Hotspot, Witness } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CloseModal from '../../../assets/images/closeModal.svg'
import TransferHotspotIcon from '../../../assets/images/transferHotspotIcon.svg'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import { useHotspotSettingsContext } from '../settings/HotspotSettingsProvider'
import { useColors } from '../../../theme/themeHooks'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { hp } from '../../../utils/layout'
import {
  fetchTxnsHead,
  HttpTransaction,
} from '../../../store/activity/activitySlice'
import { isPendingTransaction } from '../../wallet/root/useActivityItem'
import { useAppDispatch } from '../../../store/store'

type Props = {
  onCloseTransfer: () => void
  onCloseSettings: () => void
  hotspot: Hotspot | Witness
}

const HotspotTransfer = ({
  onCloseTransfer,
  onCloseSettings,
  hotspot,
}: Props) => {
  const hotspotName = animalName(hotspot.address)
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const [typedName, setTypedName] = useState('')
  const { enableBack } = useHotspotSettingsContext()
  const colors = useColors()
  const dispatch = useAppDispatch()

  useEffect(() => {
    enableBack(onCloseTransfer)
  }, [enableBack, onCloseTransfer])

  const handleTypeName = (text: string) => {
    setTypedName(text)
  }

  const typedHotspotName = () => {
    return typedName.trim().toLowerCase() === hotspotName.trim().toLowerCase()
  }

  const hasPendingTransaction = useCallback(async () => {
    try {
      const pending = (await dispatch(
        fetchTxnsHead({ filter: 'pending' }),
      )) as {
        payload?: HttpTransaction[]
      }
      const txns = pending.payload
      return txns?.find((pendingTxn) => {
        if (!isPendingTransaction(pendingTxn)) return

        return (
          pendingTxn.txn.type === 'transfer_hotspot_v2' &&
          pendingTxn.status === 'pending' &&
          pendingTxn.txn.gateway === hotspot?.address
        )
      })
    } catch (e) {}
    return false
  }, [dispatch, hotspot?.address])

  const navigateToTransfer = useCallback(async () => {
    const hasExistingPendingTxn = await hasPendingTransaction()
    if (hasExistingPendingTxn) {
      Toast.show(t('hotspot_settings.reassert.already_pending'), Toast.LONG)
      return
    }
    onCloseSettings()
    navigation.navigate('SendStack', {
      hotspotAddress: hotspot.address,
      isSeller: true,
      type: 'transfer',
    })
  }, [hasPendingTransaction, hotspot.address, navigation, onCloseSettings, t])

  return (
    <Box minHeight={hp(75)}>
      <Box
        backgroundColor="greenMain"
        borderTopRightRadius="l"
        borderTopLeftRadius="l"
        padding="l"
        minHeight={194}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TransferHotspotIcon />
          <TouchableOpacityBox onPress={onCloseTransfer}>
            <CloseModal color={colors.blackTransparent} />
          </TouchableOpacityBox>
        </Box>
        <Text variant="h2" paddingTop="m" maxFontSizeMultiplier={1}>
          {t('transfer.title')}
        </Text>
        <Text variant="body1" paddingTop="m" maxFontSizeMultiplier={1}>
          {t('transfer.heading')}
        </Text>
      </Box>
      <Box padding="l" minHeight={340}>
        <Text
          variant="body2"
          color="black"
          marginBottom="l"
          maxFontSizeMultiplier={1.2}
        >
          {t('transfer.body')}
        </Text>
        <Text
          variant="h5"
          color="black"
          paddingBottom="l"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {hotspotName.toUpperCase()}
        </Text>
        <TextInput
          variant="medium"
          placeholder={t('transfer.input_placeholder')}
          onChangeText={handleTypeName}
          value={typedName}
          returnKeyType="done"
        />
        <Button
          title={t('transfer.button_title')}
          mode="contained"
          variant="secondary"
          paddingTop="m"
          onPress={navigateToTransfer}
          disabled={!typedHotspotName()}
        />
      </Box>
    </Box>
  )
}

export default HotspotTransfer
