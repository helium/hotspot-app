import React from 'react'
import { Linking, Share } from 'react-native'
import { useSelector } from 'react-redux'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import CardHandle from '../../../components/CardHandle'
// import Heart from '../../../assets/images/heart.svg'
import MoreMenu from '../../../assets/images/moreMenu.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useAppDispatch } from '../../../store/store'
import hotspotDetailsSlice from '../../../store/hotspotDetails/hotspotDetailsSlice'
import { RootState } from '../../../store/rootReducer'
import { EXPLORER_BASE_URL } from '../../../utils/config'

const HotspotDetailCardHeader = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { showActionSheetWithOptions } = useActionSheet()

  const {
    hotspotDetails: { hotspot },
  } = useSelector((state: RootState) => state)

  type SettingsOption = { label: string; action?: () => void }
  const onMoreSelected = () => {
    if (!hotspot) return

    const explorerUrl = `${EXPLORER_BASE_URL}/hotspots/${hotspot.address}`
    const opts: SettingsOption[] = [
      {
        label: t('hotspot_details.options.settings'),
        action: () =>
          dispatch(hotspotDetailsSlice.actions.toggleShowSettings()),
      },
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
        destructiveButtonIndex: opts.length - 1,
      },
      (buttonIndex) => {
        opts[buttonIndex].action?.()
      },
    )
  }

  return (
    <Box flexDirection="row" justifyContent="space-between" paddingTop="m">
      {/* <TouchableOpacityBox paddingVertical="s" paddingHorizontal="l">
        <Heart />
      </TouchableOpacityBox> */}
      <Box width={66} />
      <CardHandle />
      <TouchableOpacityBox
        onPress={onMoreSelected}
        paddingVertical="s"
        paddingHorizontal="l"
      >
        <MoreMenu />
      </TouchableOpacityBox>
    </Box>
  )
}

export default HotspotDetailCardHeader
