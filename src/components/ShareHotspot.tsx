import React, { memo, useMemo } from 'react'
import { Hotspot } from '@helium/http'
import { useTranslation } from 'react-i18next'
import { startCase } from 'lodash'
import CopyIco from '@assets/images/copy.svg'
import ShareHotspotIco from '@assets/images/shareHotspot.svg'
import GlobeIco from '@assets/images/globe.svg'
import Clipboard from '@react-native-community/clipboard'
import { Linking, Share } from 'react-native'
import HeliumActionSheet from './HeliumActionSheet'
import { HeliumActionSheetItemType } from './HeliumActionSheetItem'
import { TouchableOpacityBoxProps } from './TouchableOpacityBox'
import useHaptic from '../utils/useHaptic'
import { EXPLORER_BASE_URL } from '../utils/config'

type Props = { hotspot: Hotspot }
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
        action: () => Share.share({ message: explorerUrl }),
      },
      {
        label: `${t('generic.copy')} ${t('generic.address')}`,
        value: 'copy',
        Icon: CopyIco,
        action: () => {
          Clipboard.setString(hotspot.address)
          triggerNotification('success')
        },
      },
    ] as HeliumActionSheetItemType[]
  }, [explorerUrl, hotspot.address, t, triggerNotification])

  return (
    <HeliumActionSheet
      buttonProps={buttonProps}
      iconVariant="kabob"
      iconColor="grayMain"
      title={startCase(hotspot.name)}
      data={actionSheetData}
    />
  )
}

export default memo(ShareHotspot)
