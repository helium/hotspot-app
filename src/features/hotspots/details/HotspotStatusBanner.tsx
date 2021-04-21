/* eslint-disable react/jsx-props-no-spreading */
import { Hotspot } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Close from '@assets/images/close.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import { Theme } from '../../../theme/theme'
import { useColors } from '../../../theme/themeHooks'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import animateTransition from '../../../utils/animateTransition'
import usePrevious from '../../../utils/usePrevious'

type Props = BoxProps<Theme> & {
  hotspot: Hotspot
  visible: boolean
  onDismiss: () => void
}
const HotspotStatusBanner = ({
  hotspot,
  visible: propsVisible,
  onDismiss,
  ...boxProps
}: Props) => {
  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )
  const { t } = useTranslation()
  const { orangeExtraDark } = useColors()
  const [visible, setVisible] = useState(false)
  const prevHotspotAddress = usePrevious(hotspot.address)

  useEffect(() => {
    animateTransition()
    setVisible(propsVisible)
  }, [propsVisible])

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

  const subtitle = useMemo(() => {
    if (hotspot.status?.online !== 'online') return

    return t('hotspot_details.status_prompt_online.subtitle', {
      hotspotBlock: hotspot.block,
      currentBlock: blockHeight,
    })
  }, [blockHeight, hotspot.block, hotspot.status, t])

  const handleClose = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  if (!visible) return null

  return (
    <Box
      height={68}
      {...boxProps}
      paddingHorizontal="l"
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
      {subtitle && (
        <Text
          variant="regular"
          fontSize={15}
          lineHeight={21}
          color="orangeExtraDark"
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
