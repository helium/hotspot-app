import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'
import usePrevious from './usePrevious'

type Props = { onAppear?: () => void; onDisappear?: () => void }
const useVisible = (props?: Props) => {
  const { onAppear, onDisappear } = props || {}
  const {
    app: { appStateStatus },
  } = useSelector((state: RootState) => state)
  const navigation = useNavigation()
  const prevAppState = usePrevious(appStateStatus)
  const [visible, setVisible] = useState(false)

  const handleVisibility = useCallback(
    (isVisible: boolean) => {
      setVisible(isVisible)
      if (isVisible) {
        onAppear?.()
      } else {
        onDisappear?.()
      }
    },
    [onDisappear, onAppear],
  )

  useEffect(() => {
    if (appStateStatus === 'background' && prevAppState !== 'background') {
      handleVisibility(false)
    }

    if (appStateStatus === 'active' && prevAppState === 'background') {
      handleVisibility(true)
    }
  }, [appStateStatus, handleVisibility, prevAppState])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      handleVisibility(false)
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVisibility])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleVisibility(true)
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVisibility])

  return visible
}

export default useVisible
