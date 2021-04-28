import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'
import animateTransition from './animateTransition'

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  function onKeyboardDidShow(e: KeyboardEvent): void {
    animateTransition('useKeyboard.OnKeyboardDidShow')
    setKeyboardHeight(e.endCoordinates.height)
  }

  function onKeyboardDidHide(): void {
    animateTransition('useKeyboard.OnKeyboardDidHide')
    setKeyboardHeight(0)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide)
    return (): void => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide)
    }
  }, [])

  return keyboardHeight
}

export default useKeyboard
