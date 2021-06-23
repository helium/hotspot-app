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

export async function sendEmail(
  subject: string,
  body: string,
  isHTML: boolean,
) {
  Mailer.mail(
    {
      subject,
      body,
      isHTML,
    },
    error,
  )
}

const useShareDiscovery = (request?: DiscoveryRequest | null) => {
  const { t } = useTranslation()

  const createAndroidEmail = useCallback(
    (grouped: Record<string, DiscoveryResponse[]>) => {
      const body = Object.keys(grouped)
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
        .join('\n')

      sendEmail(t('discovery.share.subject'), body, false)
    },
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
      const body = `
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

      sendEmail(t('discovery.share.subject'), body, true)
    },
    [t],
  )

  const shareResults = useCallback(() => {
    const grouped = groupBy(
      request?.responses,
      (response) => response.hotspotAddress,
    )
    if (Platform.OS === 'ios') {
      createIOSEmail(grouped)
    } else {
      createAndroidEmail(grouped)
    }
  }, [createAndroidEmail, createIOSEmail, request?.responses])
  return { shareResults }
}

export default useShareDiscovery
