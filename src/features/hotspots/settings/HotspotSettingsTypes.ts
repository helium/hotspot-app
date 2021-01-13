export const HotspotOptionsKeys = [
  'diagnostic',
  'wifi',
  'reassert',
  'firmware',
] as const
export type HotspotOptions = typeof HotspotOptionsKeys[number]
