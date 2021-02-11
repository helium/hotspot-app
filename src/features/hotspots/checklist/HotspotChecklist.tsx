import React, { useEffect } from 'react'
import { Hotspot } from '@helium/http'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { fetchChecklistActivity } from '../../../store/hotspotDetails/hotspotChecklistSlice'
import HotspotChecklistItem from './HotspotChecklistItem'

type Props = {
  hotspot: Hotspot
  witnesses?: Hotspot[]
}

const HotspotChecklist = ({ hotspot, witnesses }: Props) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const {
    heliumData: { blockHeight },
    hotspotChecklist: {
      challengerTxn,
      challengeeTxn,
      witnessTxn,
      dataTransferTxn,
      loadingActivity,
    },
  } = useSelector((state: RootState) => state)

  useEffect(() => {
    dispatch(fetchChecklistActivity(hotspot.address))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const syncStatus = () => {
    if (!hotspot?.status?.height || !blockHeight) {
      return t('checklist.blocks.not')
    }
    if (blockHeight - hotspot.status.height < 500) {
      return t('checklist.blocks.full')
    }
    return t('checklist.blocks.partial', {
      count: blockHeight - hotspot.status.height,
      percent: ((hotspot.status.height / blockHeight) * 100).toFixed(2),
    })
  }

  const hotspotStatus = () =>
    hotspot?.status?.online === 'online'
      ? t('checklist.status.online')
      : t('checklist.status.offline')

  const challengerStatus = () =>
    challengerTxn && blockHeight
      ? t('checklist.challenger.success', {
          count: blockHeight - challengerTxn.height,
        })
      : t('checklist.challenger.fail')

  const challengeWitnessStatus = () =>
    witnessTxn
      ? t('checklist.challenge_witness.success')
      : t('checklist.challenge_witness.fail')

  const witnessStatus = () =>
    witnesses && witnesses.length > 0
      ? t('checklist.witness.success', { count: witnesses?.length })
      : t('checklist.witness.fail')

  const challengeeStatus = () =>
    challengeeTxn && blockHeight
      ? t('checklist.challengee.success', {
          count: blockHeight - challengeeTxn.height,
        })
      : t('checklist.challengee.fail')

  const dataTransferStatus = () =>
    dataTransferTxn
      ? t('checklist.data_transfer.success')
      : t('checklist.data_transfer.fail')

  if (loadingActivity) {
    return null
  }

  return (
    <Box>
      <HotspotChecklistItem
        title={t('checklist.blocks.title')}
        description={syncStatus()}
        complete={
          (blockHeight &&
            hotspot?.status?.height &&
            blockHeight - hotspot.status.height < 500) ||
          false
        }
        showAuto
      />
      <HotspotChecklistItem
        title={t('checklist.status.title')}
        description={hotspotStatus()}
        complete={hotspot?.status?.online === 'online'}
        completeText={t('checklist.online')}
      />
      <HotspotChecklistItem
        title={t('checklist.challenger.title')}
        description={challengerStatus()}
        complete={challengerTxn !== undefined}
        showAuto
      />
      <HotspotChecklistItem
        title={t('checklist.challenge_witness.title')}
        description={challengeWitnessStatus()}
        complete={witnessTxn !== undefined}
        showAuto
      />
      <HotspotChecklistItem
        title={t('checklist.witness.title')}
        description={witnessStatus()}
        complete={witnesses && witnesses.length > 0}
        showAuto
        autoText={t('checklist.auto_days')}
      />
      <HotspotChecklistItem
        title={t('checklist.challengee.title')}
        description={challengeeStatus()}
        complete={challengeeTxn !== undefined}
        showAuto
        autoText={t('checklist.auto_hours')}
      />
      <HotspotChecklistItem
        title={t('checklist.data_transfer.title')}
        description={dataTransferStatus()}
        complete={dataTransferTxn !== undefined}
        showAuto
      />
    </Box>
  )
}

export default HotspotChecklist
