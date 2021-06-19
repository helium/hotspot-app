import React from 'react'
import { GestureResponderEvent } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

type DebounceProps = {
  onPress?: (event: GestureResponderEvent) => void
  children?: React.ReactNode
  duration?: number
}

export default function WithDebounce<T>(Component: React.FC<T>) {
  return function WithDebounceComponent({
    onPress,
    duration,
    ...props
  }: T & DebounceProps) {
    const debouncedHandler = useDebouncedCallback(
      (event: GestureResponderEvent) => onPress?.(event),
      duration || 300,
      { leading: true, trailing: false },
    )

    // TODO: Someday when time is aplenty, fix the TS warning.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} onPress={debouncedHandler.callback} />
  }
}
