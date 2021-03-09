import React, { useCallback } from 'react'
import { Linking, Share } from 'react-native'
import { Hotspot } from '@helium/http'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useTranslation } from 'react-i18next'
import MoreMenu from '@assets/images/moreMenu.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { EXPLORER_BASE_URL } from '../../../utils/config'

const HotspotMoreMenuButton = ({ hotspot }: { hotspot: Hotspot }) => {
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()

  type SettingsOption = { label: string; action?: () => void }

  const onMoreSelected = useCallback(() => {
    if (!hotspot) return

    const explorerUrl = `${EXPLORER_BASE_URL}/hotspots/${hotspot.address}`
    const opts: SettingsOption[] = [
      {
        label: t('hotspot_details.options.viewExplorer'),
        action: () => Linking.openURL(explorerUrl),
      },
      {
        label: t('hotspot_details.options.share'),
        action: () => Share.share({ message: explorerUrl }),
      },
      {
        label: t('generic.cancel'),
      },
    ]

    showActionSheetWithOptions(
      {
        options: opts.map(({ label }) => label),
        cancelButtonIndex: opts.length - 1,
      },
      (buttonIndex) => {
        opts[buttonIndex].action?.()
      },
    )
  }, [hotspot, showActionSheetWithOptions, t])

  return (
    <TouchableOpacityBox
      onPress={onMoreSelected}
      paddingVertical="s"
      marginTop="xxs"
      marginRight="n_l"
      paddingHorizontal="l"
    >
      <MoreMenu />
    </TouchableOpacityBox>
  )
}

export default HotspotMoreMenuButton
