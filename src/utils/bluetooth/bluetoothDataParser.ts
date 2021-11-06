import { decode } from 'base-64'
import {
  wifi_services_v1 as WifiServicesV1,
  wifi_remove_v1 as WifiRemoveV1,
  wifi_connect_v1 as WifiConnectV1,
  add_gateway_v1 as AddGatewayV1,
  diagnostics_v1 as DiagnosticsV1,
} from '@helium/proto-ble'
import { util } from 'protobufjs'
import { HotspotCharacteristic, FirmwareCharacteristic } from './bluetoothTypes'

export type DiagnosticInfo = {
  connected: string
  dialable: string
  eth: string
  fw: string
  height: string
  ip: string
  nat_type: string
  wifi: string
  disk: string
}

const parseWifi = (value: string): string[] => {
  const buffer = util.newBuffer(util.base64.length(value))
  util.base64.decode(value, buffer, 0)
  return WifiServicesV1.decode(buffer).services
}

const parseDiagnostics = (value: string) => {
  const buffer = util.newBuffer(util.base64.length(value))
  util.base64.decode(value, buffer, 0)
  return DiagnosticsV1.decode(buffer).diagnostics
}

export function parseChar(
  characteristicValue: string,
  uuid:
    | typeof HotspotCharacteristic.WIFI_CONFIGURED_SERVICES
    | typeof HotspotCharacteristic.AVAILABLE_SSIDS_UUID,
): string[]
export function parseChar(
  characteristicValue: string,
  uuid: typeof HotspotCharacteristic.ETHERNET_ONLINE_UUID,
): boolean
export function parseChar(
  characteristicValue: string,
  uuid:
    | typeof HotspotCharacteristic.WIFI_SSID_UUID
    | typeof HotspotCharacteristic.PUBKEY_UUID
    | typeof HotspotCharacteristic.ONBOARDING_KEY_UUID
    | typeof HotspotCharacteristic.WIFI_REMOVE
    | typeof HotspotCharacteristic.WIFI_CONNECT_UUID
    | typeof HotspotCharacteristic.ADD_GATEWAY_UUID
    | typeof FirmwareCharacteristic.FIRMWAREVERSION_UUID,
): string
export function parseChar(
  characteristicValue: string,
  uuid: typeof HotspotCharacteristic.DIAGNOSTIC_UUID,
): DiagnosticInfo
export function parseChar(characteristicValue: string, uuid: string) {
  switch (uuid) {
    case HotspotCharacteristic.DIAGNOSTIC_UUID:
      return parseDiagnostics(characteristicValue) as DiagnosticInfo
    case HotspotCharacteristic.WIFI_CONFIGURED_SERVICES:
    case HotspotCharacteristic.AVAILABLE_SSIDS_UUID:
      return parseWifi(characteristicValue)
    case HotspotCharacteristic.ETHERNET_ONLINE_UUID: {
      const decodedValue = decode(characteristicValue)
      return decodedValue === 'true'
    }
  }

  return decode(characteristicValue)
}

const encodedToString = (encoded: Uint8Array) =>
  Buffer.from(encoded).toString('base64')

export const encodeWifiRemove = (wifiSSID: string) => {
  const wifiRemove = WifiRemoveV1.create({
    service: wifiSSID,
  })

  const encoded = WifiRemoveV1.encode(wifiRemove).finish()
  return encodedToString(encoded)
}

export const encodeWifiConnect = (wifiSSID: string, password: string) => {
  const wifiConnect = WifiConnectV1.create({
    service: wifiSSID,
    password,
  })

  const encoded = WifiConnectV1.encode(wifiConnect).finish()
  return encodedToString(encoded)
}

export const encodeAddGateway = (
  owner: string,
  amount: number,
  fee: number,
  payer: string,
) => {
  const addGateway = AddGatewayV1.create({ owner, amount, fee, payer })
  const encoded = AddGatewayV1.encode(addGateway).finish()
  return encodedToString(encoded)
}
