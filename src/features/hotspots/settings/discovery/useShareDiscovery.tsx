import { useCallback } from 'react'
import { Platform } from 'react-native'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import Mailer from 'react-native-mail'
import {
  DiscoveryRequest,
  DiscoveryResponse,
} from '../../../../store/discovery/discoveryTypes'
import { error } from '../../../../utils/logger'

export async function sendEmail(subject: string, body: string) {
  Mailer.mail(
    {
      subject,
      body,
      isHTML: true,
    },
    error,
  )
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
    sendEmail(t('discovery.share.subject'), body)
  }, [createAndroidEmail, createIOSEmail, request?.responses, t])
  return { shareResults }
}

export default useShareDiscovery
