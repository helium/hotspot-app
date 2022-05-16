import { kebabCase } from 'lodash'
import animalHash from 'angry-purple-tiger'
import { getDeviceId } from 'react-native-device-info'
import { Platform } from 'react-native'
import sendMail from '../../../utils/sendMail'

export default ({
  eth,
  wifi,
  fw,
  connected,
  dialable,
  ip,
  disk,
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
  ip: string
  disk: string
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
    `IP Address: ${ip}`,
    `Disk status: ${disk}`,
    `Report Generated: ${reportGenerated}`,
    `Device Info: ${deviceNameAndOS()}`,
  ].join('\n')

  sendMail({
    subject: 'Diagnostic Report',
    body,
    isHTML: false,
    recipients: [supportEmail],
  })
}
