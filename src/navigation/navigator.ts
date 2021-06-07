import React from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { LockScreenRequestType } from './main/tabTypes'
import { AppLink, AppLinkPayment } from '../providers/appLinkTypes'

export const navigationRef = React.createRef<NavigationContainerRef>()

const lock = (params: {
  requestType: LockScreenRequestType
  scanResult: AppLink | AppLinkPayment
}) => {
  navigationRef.current?.navigate('LockScreen', params)
}

const send = (params: { scanResult: AppLink | AppLinkPayment }) => {
  navigationRef.current?.navigate('Send', params)
}

const viewHotspot = (address: string) => {
  navigationRef.current?.navigate('HotspotsScreen', { address })
}

const confirmAddGateway = (addGatewayTxn: string) => {
  const params = {
    addGatewayTxn,
  }

  navigationRef.current?.navigate('HotspotSetup', {
    screen: 'HotspotSetupQrConfirmScreen',
    params,
  })
}

export default { lock, send, viewHotspot, confirmAddGateway }
