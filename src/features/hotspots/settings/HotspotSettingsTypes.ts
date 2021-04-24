export const HotspotOptionsKeys = ['diagnostic', 'wifi', 'firmware'] as const
export type HotspotOptions = typeof HotspotOptionsKeys[number]
