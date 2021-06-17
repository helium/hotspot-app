import React, { useEffect, useState } from 'react'
import { Hotspot, Witness } from '@helium/http'
import animalName from 'angry-purple-tiger'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
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

  useEffect(() => {
    enableBack(onCloseTransfer)
  }, [enableBack, onCloseTransfer])

  const handleTypeName = (text: string) => {
    setTypedName(text)
  }

  const typedHotspotName = () => {
    return typedName.trim().toLowerCase() === hotspotName.trim().toLowerCase()
  }

  const navigateToTransfer = () => {
    onCloseSettings()
    navigation.navigate('SendStack', {
      hotspotAddress: hotspot.address,
      isSeller: true,
      type: 'transfer',
    })
  }

  return (
    <>
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
    </>
  )
}

export default HotspotTransfer
