import { EffectCallback, useEffect } from 'react'

// eslint-disable-next-line react-hooks/exhaustive-deps
export default (effect: EffectCallback) => useEffect(effect, [])
