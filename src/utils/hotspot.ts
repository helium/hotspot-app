import validator from 'validator'

export type HotspotType = 'Helium' | 'RAK'
export type HotspotName = 'RAK Hotspot Miner' | 'Helium Hotspot'

// helium hotspot uses b58 onboarding address and RAK is uuid v4
export const getHotspotType = (onboardingAddress: string): HotspotType =>
  validator.isUUID(addUuidDashes(onboardingAddress)) ? 'RAK' : 'Helium'

const addUuidDashes = (s = '') =>
  `${s.substr(0, 8)}-${s.substr(8, 4)}-${s.substr(12, 4)}-${s.substr(
    16,
    4,
  )}-${s.substr(20)}`

export const getHotspotName = (type: HotspotType): HotspotName => {
  switch (type) {
    case 'RAK':
      return 'RAK Hotspot Miner'
    default:
    case 'Helium':
      return 'Helium Hotspot'
  }
}
