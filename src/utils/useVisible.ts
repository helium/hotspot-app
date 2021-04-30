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
      return
    }

    if (appStateStatus === 'active' && prevAppState !== 'active') {
      handleVisibility(true)
    }
  }, [appStateStatus, handleVisibility, prevAppState])

  useEffect(() => {
    return navigation.addListener('blur', () => {
      handleVisibility(false)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVisibility])

  useEffect(() => {
    return navigation.addListener('focus', () => {
      handleVisibility(true)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVisibility])

  return visible
}

export default useVisible
