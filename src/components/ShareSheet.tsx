import React, { memo, useMemo } from 'react'
import { Hotspot, Validator, Witness } from '@helium/http'
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
import { isValidator } from '../utils/validatorUtils'

type Props = { item?: Hotspot | Witness | Validator }
const ShareSheet = ({ item }: Props) => {
  const { t } = useTranslation()
  const { triggerNotification } = useHaptic()
  const explorerUrl = useMemo(() => {
    if (!item) return ''
    const target = isValidator(item) ? 'validators' : 'hotspots'
    return `${EXPLORER_BASE_URL}/${target}/${item.address}`
  }, [item])

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
        action: () => {
          if (!item?.address) return

          Share.share({
            message: isValidator(item)
              ? explorerUrl
              : createAppLink('hotspot', item.address),
          })
          // TODO: Implement validator deep link
          // Share.share({
          //   message: createAppLink(
          //     isValidator(item) ? 'validator' : 'hotspot',
          //     item.address,
          //   ),
          // })
        },
      },
      {
        label: `${t('generic.copy')} ${
          isValidator(item) ? t('generic.validator') : t('generic.hotspot')
        } ${t('generic.address')}`,
        value: 'copy_hotspot',
        Icon: CopyIco,
        action: () => {
          if (!item?.address) return

          Clipboard.setString(item.address)
          triggerNotification('success')
          const { address } = item
          const truncatedAddress = [
            address.slice(0, 8),
            address.slice(-8),
          ].join('...')
          Toast.show(
            t('wallet.copiedToClipboard', { address: truncatedAddress }),
          )
        },
      },
      {
        label: `${t('generic.copy')} ${t('generic.owner')} ${t(
          'generic.address',
        )}`,
        value: 'copy_owner',
        Icon: CopyIco,
        action: () => {
          if (!item?.owner) return

          Clipboard.setString(item.owner)
          triggerNotification('success')
          const { owner } = item
          const truncatedAddress = [owner.slice(0, 8), owner.slice(-8)].join(
            '...',
          )
          Toast.show(
            t('wallet.copiedToClipboard', { address: truncatedAddress }),
          )
        },
      },
    ] as HeliumActionSheetItemType[]
  }, [explorerUrl, item, t, triggerNotification])

  return (
    <HeliumActionSheet
      buttonProps={buttonProps}
      iconVariant="kabob"
      iconColor="grayPurple"
      title={startCase(item?.name)}
      data={actionSheetData}
      closeOnSelect={false}
    />
  )
}

export default memo(ShareSheet)
