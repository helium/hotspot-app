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
    const keyboardDidShowEmitter = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardDidHide,
    )
    return (): void => {
      keyboardDidShowEmitter.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return keyboardHeight
}

export default useKeyboard
