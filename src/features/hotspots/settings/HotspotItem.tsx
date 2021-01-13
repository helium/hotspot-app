import React, { useEffect, useState } from 'react'
import { Device } from 'react-native-ble-plx'
import { ActivityIndicator, LayoutAnimation } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import HotspotIco from '../../../assets/images/hotspotIco.svg'
import HotspotNotSelected from '../../../assets/images/hotspotNotSelected.svg'
import HotspotConnected from '../../../assets/images/hotspotConnected.svg'
import { useColors } from '../../../theme/themeHooks'

type Props = {
  hotspot: Device
  connecting?: boolean
  connected?: boolean
  selected?: boolean
  onPress: () => void
}
type State = 'init' | 'connecting' | 'connected' | 'fail'
const HotspotItem = ({
  hotspot,
  connecting,
  connected,
  selected,
  onPress,
}: Props) => {
  const [state, setState] = useState<State>('init')
  const { whitePurple, white, purpleMain } = useColors()

  useEffect(() => {
    let nextState: State = 'init'
    if (connected) nextState = 'connected'
    else if (connecting) nextState = 'connecting'

    if (nextState !== state) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setState(nextState)
    }
  }, [connected, connecting, selected, state])

  return (
    <TouchableOpacityBox
      flexDirection="row"
      borderRadius="m"
      alignItems="center"
      backgroundColor={!selected ? 'whitePurple' : 'purpleMain'}
      marginTop="m"
      height={56}
      onPress={onPress}
      paddingHorizontal="m"
      disabled={connected || connecting}
    >
      <HotspotIco color={selected ? white : purpleMain} />
      <Text
        variant="body1"
        color={selected ? 'white' : 'black'}
        marginLeft="ms"
        flex={1}
      >
        {hotspot.localName || hotspot.name}
      </Text>
      {state === 'init' && <HotspotNotSelected />}
      {state === 'connected' && <HotspotConnected />}
      {state === 'connecting' && <ActivityIndicator color={whitePurple} />}
    </TouchableOpacityBox>
  )
}

export default HotspotItem
