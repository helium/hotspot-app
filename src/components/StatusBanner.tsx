import React, { memo, useEffect, useCallback, useMemo } from 'react'
import FlashMessage, {
  hideMessage,
  Icon,
  showMessage,
} from 'react-native-flash-message'
import { Linking } from 'react-native'
import useAppState from 'react-native-appstate-hook'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'react-i18next'
import TouchableOpacityBox from './TouchableOpacityBox'
import Close from '../assets/images/closeModal.svg'
import { HELIUM_STATUS_URL } from '../utils/StatusClient'
import { useAppDispatch } from '../store/store'
import { fetchIncidents } from '../store/helium/heliumStatusSlice'
import { RootState } from '../store/rootReducer'
import shortLocale from '../utils/formatDistance'

const onTapStatusBanner = async () => {
  await Linking.openURL(HELIUM_STATUS_URL)
}

const StatusBanner = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const incidents = useSelector((state: RootState) => state.status.incidents)
  const isBackedUp = useSelector((state: RootState) => state.app.isBackedUp)

  useAppState({
    onForeground: () => {
      if (isBackedUp) {
        dispatch(fetchIncidents())
      }
    },
  })

  const getAlertDescription = useCallback(
    (timestamp: string) => {
      return t('statusBanner.description', {
        date: formatDistanceToNow(new Date(timestamp), {
          locale: shortLocale,
          addSuffix: true,
        }),
      })
    },
    [t],
  )

  useEffect(() => {
    if (!incidents.length) return

    const [lastIncident] = incidents

    showMessage({
      type: lastIncident.impact === 'critical' ? 'danger' : 'warning',
      message: lastIncident.name,
      description: getAlertDescription(lastIncident.updated_at),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidents])

  const icon = useCallback(() => {
    return (
      <TouchableOpacityBox
        onPress={hideMessage}
        padding="xs"
        hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
      >
        <Close color="white" width={30} height={30} />
      </TouchableOpacityBox>
    )
  }, [])

  const iconStyle = useMemo(
    () => ({ icon: 'danger', position: 'right' } as Icon),
    [],
  )

  return (
    <FlashMessage
      position="top"
      autoHide={false}
      icon={iconStyle}
      onPress={onTapStatusBanner}
      renderFlashMessageIcon={icon}
    />
  )
}

export default memo(StatusBanner)
