import { useCallback } from 'react'
import { Linking, Platform } from 'react-native'
import qs from 'qs'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  DiscoveryRequest,
  DiscoveryResponse,
} from '../../../../store/discovery/discoveryTypes'

export async function sendEmail(to: string, subject: string, body: string) {
  let url = `mailto:${to}`

  const query = qs.stringify({
    subject,
    body,
  })

  if (query.length) {
    url += `?${query}`
  }

  const canOpen = await Linking.canOpenURL(url)

  if (!canOpen) return

  Linking.openURL(url)
}

const useShareDiscovery = (request?: DiscoveryRequest | null) => {
  const { t } = useTranslation()

  const createAndroidEmail = useCallback(
    (grouped: Record<string, DiscoveryResponse[]>) =>
      Object.keys(grouped)
        .map((key) => {
          const group = grouped[key]
          const response = group[0]
          return `
          ${response.name}
          ${t('discovery.share.packets_heard')}: ${group.length}
          RSSI: ${response.rssi}
          SNR: ${response.snr}
          `
        })
        .join('\n'),
    [t],
  )

  const createIOSEmail = useCallback(
    (grouped: Record<string, DiscoveryResponse[]>) => {
      const tableRows = Object.keys(grouped)
        .map((key) => {
          const group = grouped[key]
          const response = group[0]
          return `
        <tr>
          <td align="center">${response.name}</td>
          <td align="center">${group.length}</td>
          <td align="center">${response.rssi}</td>
          <td align="center">${response.snr}</td>
        </tr>
      `
        })
        .join('\n')
      return `
    <html>
      <table border=1>
        <tr>
          <th align="center">${t('discovery.share.hotspot_name')}</th>
          <th align="center">${t('discovery.share.packets_heard')}</th>
          <th align="center">RSSI</th>
          <th align="center">SNR</th>
        </tr>
      ${tableRows}
      </table>
    </html>`
    },
    [t],
  )

  const shareResults = useCallback(() => {
    const grouped = groupBy(
      request?.responses,
      (response) => response.hotspotAddress,
    )
    const body =
      Platform.OS === 'ios'
        ? createIOSEmail(grouped)
        : createAndroidEmail(grouped)
    sendEmail('', t('discovery.share.subject'), body)
  }, [createAndroidEmail, createIOSEmail, request?.responses, t])
  return { shareResults }
}

export default useShareDiscovery
