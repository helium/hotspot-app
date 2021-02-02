import { useCallback, useState } from 'react'

const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, setState] = useState(initialState)
  const toggle = useCallback(() => setState((curState) => !curState), [])

  return [state, toggle]
}

export default useToggle
