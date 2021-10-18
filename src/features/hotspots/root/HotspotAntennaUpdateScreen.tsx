import React from 'react'
import { KeyboardAvoidingView, Modal, Platform } from 'react-native'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import BlurBox from '../../../components/BlurBox'
import Box from '../../../components/Box'
import Card from '../../../components/Card'
import SafeAreaBox from '../../../components/SafeAreaBox'

import { HotspotStackParamList } from './hotspotTypes'
import { RootState } from '../../../store/rootReducer'
import UpdateHotspotConfig from '../settings/updateHotspot/UpdateHotspotConfig'

type Route = RouteProp<HotspotStackParamList, 'HotspotAntennaUpdateScreen'>

type Props = {
  route: Route
}

/**
 * HotspotAntennaUpdateScreen allows users to update the antenna of one of their hotspots within
 * a single view. It simply renders the "UpdateHotspotConfig" component in "antenna" state with
 * prefilled values for gain and elevation (as provided in the route parameters).
 */
function HotspotAntennaUpdateScreen({ route }: Props) {
  const { hotspotAddress, gain, elevation } = route.params
  const hotspots = useSelector((state: RootState) => state.hotspots.hotspots)
  const hotspot = hotspots.find((h) => h.address === hotspotAddress)

  const navigation = useNavigation()
  const onClose = () => navigation.goBack()

  return (
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible
      animationType="fade"
      statusBarTranslucent
    >
      <BlurBox
        top={0}
        left={0}
        bottom={0}
        right={0}
        blurAmount={70}
        blurType="dark"
        position="absolute"
      />
      <SafeAreaBox flex={1} flexDirection="column" marginBottom="m">
        <Box
          marginTop="none"
          marginBottom="ms"
          justifyContent="flex-end"
          flex={1}
          marginHorizontal="none"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Card variant="modal" backgroundColor="white" overflow="hidden">
              {!!hotspot && (
                <UpdateHotspotConfig
                  antennaElevation={elevation}
                  antennaGain={gain}
                  hotspot={hotspot}
                  initState="confirm"
                  onClose={onClose}
                  onCloseSettings={onClose}
                />
              )}
            </Card>
          </KeyboardAvoidingView>
        </Box>
      </SafeAreaBox>
    </Modal>
  )
}

export default HotspotAntennaUpdateScreen
