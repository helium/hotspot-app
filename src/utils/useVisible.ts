import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'
import usePrevious from './usePrevious'

type Props = { onAppear?: () => void; onDisappear?: () => void }
const useVisible = ({ onAppear, onDisappear }: Props) => {
  const {
    app: { appStateStatus },
  } = useSelector((state: RootState) => state)
  const navigation = useNavigation()
  const prevAppState = usePrevious(appStateStatus)

  useEffect(() => {
    if (appStateStatus === 'background' && prevAppState !== 'background') {
      onDisappear?.()
    }

    if (appStateStatus === 'active' && prevAppState === 'background') {
      onAppear?.()
    }
  }, [appStateStatus, prevAppState, onAppear, onDisappear])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      onDisappear?.()
    })

    return unsubscribe
  }, [navigation, onDisappear])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onAppear?.()
    })

    return unsubscribe
  }, [navigation, onAppear])
}

export default useVisible
