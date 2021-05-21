export type AntennaId =
  | 'helium_us'
  | 'helium_eu'
  | 'rak_hotspot_us'
  | 'rak_hotspot_eu'
  | 'nebra_outdoor'
  | 'nebra_indoor'
  | 'bobcat'
  | 'syncrobit_us'
  | 'syncrobit_eu'
  | 'rak_custom'
  | 'longapone_eu'
  | 'sensecap_m1_us'
  | 'sensecap_m1_eu'
  | 'custom'

export type Antenna = { id: AntennaId; gain: number }

export const Antennas: Record<AntennaId, Antenna> = {
  helium_us: { id: 'helium_us', gain: 1.2 },
  helium_eu: { id: 'helium_eu', gain: 2.3 },
  rak_hotspot_us: { id: 'rak_hotspot_us', gain: 2.3 },
  rak_hotspot_eu: { id: 'rak_hotspot_eu', gain: 2.8 },
  nebra_outdoor: { id: 'nebra_outdoor', gain: 3 },
  nebra_indoor: { id: 'nebra_indoor', gain: 3 },
  bobcat: { id: 'bobcat', gain: 4 },
  syncrobit_us: { id: 'syncrobit_us', gain: 1.2 },
  syncrobit_eu: { id: 'syncrobit_eu', gain: 2.3 },
  rak_custom: { id: 'rak_custom', gain: 5.8 },
  longapone_eu: { id: 'longapone_eu', gain: 3 },
  sensecap_m1_us: { id: 'sensecap_m1_us', gain: 1.2 },
  sensecap_m1_eu: { id: 'sensecap_m1_eu', gain: 1.2 },
  custom: { id: 'custom', gain: 1 },
}
