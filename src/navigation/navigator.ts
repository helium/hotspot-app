import React from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { LockScreenRequestType } from './main/tabTypes'
import {
  AppLink,
  AppLinkPayment,
  LinkWalletRequest,
  SignHotspotRequest,
} from '../providers/appLinkTypes'

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
  navigationRef.current?.navigate('HotspotsScreen', {
    address,
    resource: 'hotspot',
  })
}

const viewValidator = (address: string) => {
  navigationRef.current?.navigate('HotspotsScreen', {
    address,
    resource: 'validator',
  })
}

const updateHotspotLocation = (params: {
  hotspotAddress: string
  location: { longitude: number; latitude: number }
}) => {
  navigationRef.current?.navigate('HotspotLocationUpdateScreen', params)
}

const confirmAddGateway = (addGatewayTxn: string) => {
  const params = {
    addGatewayTxn,
  }

  navigationRef.current?.navigate('HotspotSetup', {
    screen: 'HotspotSetupExternalConfirmScreen',
    params,
  })
}

const linkWallet = (request: LinkWalletRequest) => {
  navigationRef.current?.navigate('LinkWallet', request)
}

const signHotspot = (request: SignHotspotRequest) => {
  navigationRef.current?.navigate('SignHotspot', request)
}

export default {
  lock,
  send,
  viewHotspot,
  viewValidator,
  confirmAddGateway,
  updateHotspotLocation,
  linkWallet,
  signHotspot,
}
