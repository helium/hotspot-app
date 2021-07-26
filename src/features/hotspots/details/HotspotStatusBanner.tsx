/* eslint-disable react/jsx-props-no-spreading */
import { Hotspot, Witness } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Close from '@assets/images/close.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { Theme } from '../../../theme/theme'
import { useColors } from '../../../theme/themeHooks'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import animateTransition from '../../../utils/animateTransition'
import usePrevious from '../../../utils/usePrevious'
import useHotspotSync from '../useHotspotSync'

type Props = BoxProps<Theme> & {
  hotspot: Hotspot | Witness
  visible: boolean
  onDismiss: () => void
}
const HotspotStatusBanner = ({
  hotspot,
  visible: propsVisible,
  onDismiss,
  ...boxProps
}: Props) => {
  const { t } = useTranslation()
  const { orangeExtraDark } = useColors()
  const [visible, setVisible] = useState(false)
  const prevHotspotAddress = usePrevious(hotspot.address)

  const { getStatusMessage } = useHotspotSync(hotspot)

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

  const subtitle = useMemo(() => {
    if (hotspot.status?.online !== 'online') return null

    return getStatusMessage()
  }, [getStatusMessage, hotspot.status?.online])

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
      {!!subtitle && (
        <Text
          variant="regular"
          fontSize={15}
          lineHeight={21}
          color="orangeExtraDark"
          marginRight="l"
        >
          {subtitle}
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
