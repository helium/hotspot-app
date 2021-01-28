import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react'

const initialState = {
  showBack: false,
  enableBack: () => {},
  disableBack: () => {},
  goBack: () => {},
}

const useHotspotSettings = () => {
  const [showBack, setShowBack] = useState(false)
  const backHandler = useRef<() => void | undefined>()

  const enableBack = (handler: () => void) => {
    setShowBack(true)
    backHandler.current = handler
  }

  const disableBack = () => {
    setShowBack(false)
  }

  const goBack = () => {
    backHandler?.current?.()
  }

  return { showBack, enableBack, disableBack, goBack }
}

const HotspotSettingsContext = createContext<
  ReturnType<typeof useHotspotSettings>
>(initialState)
const { Provider } = HotspotSettingsContext

const HotspotSettingsProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useHotspotSettings()}>{children}</Provider>
}

export const useHotspotSettingsContext = () =>
  useContext(HotspotSettingsContext)

export default HotspotSettingsProvider
