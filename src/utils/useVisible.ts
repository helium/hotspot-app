import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import useAppState from 'react-native-appstate-hook'
import useMount from './useMount'

type Props = { onAppear?: () => void; onDisappear?: () => void }
const useVisible = (props?: Props) => {
  const { onAppear, onDisappear } = props || {}

  const { appState } = useAppState({
    onChange: (newAppState) => handleVisibility(newAppState === 'active'),
  })
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)

  const handleVisibility = useCallback(
    (isVisible: boolean) => {
      if (isVisible === visible) return

      setVisible(isVisible)
      if (isVisible) {
        onAppear?.()
      } else {
        onDisappear?.()
      }
    },
    [visible, onAppear, onDisappear],
  )

  useMount(() => {
    handleVisibility(appState === 'active')
  })

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
