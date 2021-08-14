import { kebabCase } from 'lodash'
import animalHash from 'angry-purple-tiger'
import { getDeviceId } from 'react-native-device-info'
import { Linking, Platform } from 'react-native'
import qs from 'qs'

export default async ({
  eth,
  wifi,
  fw,
  connected,
  dialable,
  natType,
  ip,
  height,
  lastChallengeDate,
  reportGenerated,
  gateway,
  hotspotMaker,
  appVersion,
  supportEmail,
  descriptionInfo,
}: {
  eth: string
  wifi: string
  fw: string
  connected: string
  dialable: string
  natType: string
  ip: string
  height: string
  lastChallengeDate: string
  reportGenerated: string
  gateway: string
  hotspotMaker: string
  appVersion: string
  supportEmail: string
  descriptionInfo: string
}) => {
  const deviceNameAndOS = () => {
    const deviceName = getDeviceId()
    const osVersion = Platform.Version
    const osName = Platform.OS
    return `${deviceName} | ${osName} ${osVersion}`
  }

  let url = `mailto:${supportEmail}`

  const body = [
    `**${descriptionInfo}**\n\n`,
    `Hotspot: ${kebabCase(animalHash(gateway))}`,
    `Hotspot Maker: ${hotspotMaker}`,
    `Address: ${gateway}`,
    `Connected to Blockchain: ${connected}`,
    `Dialable: ${dialable}`,
    `Height: ${height}`,
    `Last Challenge: ${lastChallengeDate}`,
    `Firmware: ${fw}`,
    `App Version: ${appVersion}`,
    `Wi-Fi MAC: ${wifi}`,
    `Eth MAC: ${eth}`,
    `NAT Type: ${natType}`,
    `IP Address: ${ip}`,
    `Report Generated: ${reportGenerated}`,
    `Device Info: ${deviceNameAndOS()}`,
  ].join('\n')

  const query = qs.stringify({
    subject: 'Diagnostic Report',
    body,
  })

  if (query.length) {
    url += `?${query}`
  }

  const canOpen = await Linking.canOpenURL(url)

  if (canOpen) {
    Linking.openURL(url)
  }
}
