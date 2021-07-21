/* eslint-disable react/jsx-props-no-spreading */
import { Hotspot, Witness } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Close from '@assets/images/close.svg'
import { formatDistanceToNow } from 'date-fns'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import { Theme } from '../../../theme/theme'
import { useColors } from '../../../theme/themeHooks'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import animateTransition from '../../../utils/animateTransition'
import shortLocale from '../../../utils/formatDistance'
import usePrevious from '../../../utils/usePrevious'
import { HotspotSyncStatus } from '../../../utils/hotspotUtils'

type Props = BoxProps<Theme> & {
  hotspot: Hotspot | Witness
  visible: boolean
  onDismiss: () => void
  syncStatus: HotspotSyncStatus | null
}
const HotspotStatusBanner = ({
  hotspot,
  visible: propsVisible,
  onDismiss,
  syncStatus,
  ...boxProps
}: Props) => {
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const { t } = useTranslation()
  const { orangeExtraDark } = useColors()
  const [visible, setVisible] = useState(false)
  const prevHotspotAddress = usePrevious(hotspot.address)

  const syncStatusMessage = useMemo(() => {
    if (!blockHeight || !syncStatus || hotspot.status?.online !== 'online')
      return null

    const timeAgo = hotspot.status?.timestamp
      ? formatDistanceToNow(new Date(hotspot.status.timestamp), {
          locale: shortLocale,
          addSuffix: true,
        })
      : null

    if (syncStatus === 'full') {
      if (!timeAgo) {
        return t('checklist.blocks.full')
      }
      return t('checklist.blocks.full_with_date', {
        timeAgo,
      })
    }
    if (!timeAgo) {
      return t('checklist.blocks.partial')
    }
    return t('checklist.blocks.partial_with_date', { timeAgo })
  }, [blockHeight, hotspot.status, syncStatus, t])

  useEffect(() => {
    if (visible === propsVisible) return
    animateTransition('HotspotStatusBanner')
    setVisible(propsVisible)
  }, [propsVisible, visible])

  useEffect(() => {
    if (prevHotspotAddress === hotspot.address || !visible) return

    onDismiss()
  }, [hotspot.address, onDismiss, prevHotspotAddress, visible])

  const title = useMemo(() => {
    if (hotspot.status?.online === 'online') {
      return t('hotspot_details.status_prompt_online.title')
    }
    return t('hotspot_details.status_prompt_offline.title')
  }, [hotspot.status, t])

  const handleClose = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  if (!visible) return null

  return (
    <Box
      {...boxProps}
      paddingHorizontal="l"
      paddingVertical="ms"
      justifyContent="center"
    >
      <Box
        position="absolute"
        backgroundColor="orangeDark"
        opacity={0.17}
        top={0}
        left={0}
        right={0}
        bottom={0}
      />
      <Text
        variant="bold"
        fontSize={15}
        lineHeight={21}
        color="orangeExtraDark"
      >
        {title}
      </Text>
      {syncStatusMessage && (
        <Text
          variant="regular"
          fontSize={15}
          lineHeight={21}
          color="orangeExtraDark"
          marginRight="l"
        >
          {syncStatusMessage}
        </Text>
      )}
      <TouchableOpacityBox
        onPress={handleClose}
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        justifyContent="center"
        paddingHorizontal="l"
      >
        <Close color={orangeExtraDark} height={14} width={14} />
      </TouchableOpacityBox>
    </Box>
  )
}

export default memo(HotspotStatusBanner)
