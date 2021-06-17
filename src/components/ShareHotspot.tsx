import React, { memo, useMemo } from 'react'
import { Hotspot, Witness } from '@helium/http'
import { useTranslation } from 'react-i18next'
import { startCase } from 'lodash'
import CopyIco from '@assets/images/copy.svg'
import ShareHotspotIco from '@assets/images/shareHotspot.svg'
import GlobeIco from '@assets/images/globe.svg'
import Clipboard from '@react-native-community/clipboard'
import { Linking, Share } from 'react-native'
import Toast from 'react-native-simple-toast'
import HeliumActionSheet from './HeliumActionSheet'
import { HeliumActionSheetItemType } from './HeliumActionSheetItem'
import { TouchableOpacityBoxProps } from './TouchableOpacityBox'
import useHaptic from '../utils/useHaptic'
import { EXPLORER_BASE_URL } from '../utils/config'
import { createAppLink } from '../providers/AppLinkProvider'

type Props = { hotspot: Hotspot | Witness }
const ShareHotspot = ({ hotspot }: Props) => {
  const { t } = useTranslation()
  const { triggerNotification } = useHaptic()
  const explorerUrl = `${EXPLORER_BASE_URL}/hotspots/${hotspot.address}`

  const buttonProps = useMemo(
    () =>
      ({
        width: 40,
        height: 31,
        alignItems: 'center',
        justifyContent: 'center',
      } as TouchableOpacityBoxProps),
    [],
  )
  const actionSheetData = useMemo(() => {
    return [
      {
        label: t('hotspot_details.options.viewExplorer'),
        value: 'viewExplorer',
        Icon: GlobeIco,
        action: () => Linking.openURL(explorerUrl),
      },
      {
        label: t('hotspot_details.options.share'),
        value: 'share',
        Icon: ShareHotspotIco,
        action: () =>
          Share.share({ message: createAppLink('hotspot', hotspot.address) }),
      },
      {
        label: `${t('generic.copy')} ${t('generic.address')}`,
        value: 'copy',
        Icon: CopyIco,
        action: () => {
          Clipboard.setString(hotspot.address)
          triggerNotification('success')
          const { address } = hotspot
          const truncatedAddress = [
            address.slice(0, 8),
            address.slice(-8),
          ].join('...')
          Toast.show(
            t('wallet.copiedToClipboard', { address: truncatedAddress }),
          )
        },
      },
    ] as HeliumActionSheetItemType[]
  }, [explorerUrl, hotspot, t, triggerNotification])

  return (
    <HeliumActionSheet
      buttonProps={buttonProps}
      iconVariant="kabob"
      iconColor="grayMain"
      title={startCase(hotspot.name)}
      data={actionSheetData}
      closeOnSelect={false}
    />
  )
}

export default memo(ShareHotspot)
