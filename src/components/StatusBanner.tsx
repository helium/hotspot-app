import React from 'react'
import FlashMessage, { hideMessage } from 'react-native-flash-message'
import { Linking } from 'react-native'
import TouchableOpacityBox from './TouchableOpacityBox'
import Close from '../assets/images/closeModal.svg'
import { HELIUM_STATUS_URL } from '../utils/StatusClient'

const onTapStatusBanner = async () => {
  await Linking.openURL(HELIUM_STATUS_URL)
}

const StatusBanner = () => (
  <FlashMessage
    position="top"
    autoHide={false}
    icon={{ icon: 'danger', position: 'right' }}
    onPress={onTapStatusBanner}
    renderFlashMessageIcon={() => (
      <TouchableOpacityBox onPress={hideMessage} padding="xs">
        <Close color="white" width={30} height={30} />
      </TouchableOpacityBox>
    )}
  />
)

export default StatusBanner
