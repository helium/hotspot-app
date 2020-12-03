import React, {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from 'react'
import { BleManager, Device, State } from 'react-native-ble-plx'
import { useStateWithCallbackLazy } from 'use-state-with-callback'
import { fromBs64 } from './base64'
import {
  getHotspotName,
  getHotspotType,
  HotspotType,
  HotspotName,
} from './hotspot'
import sleep from './sleep'

const SERVICE_UUID = '0fda92b2-44a2-4af2-84f5-fa682baa2b8d'
const WIFI_SSID_UUID = '7731de63-bc6a-4100-8ab1-89b2356b038b'
const PUBKEY_UUID = '0a852c59-50d3-4492-bfd3-22fe58a24f01'
const ONBOARDING_KEY_UUID = 'd083b2bd-be16-4600-b397-61512ca2f5ad'

type HotspotDetails = {
  mac: string | undefined
  address: string | undefined
  type: HotspotType
  name: HotspotName
}
const useBluetooth = () => {
  /// ///////////////////////////////////////////////////////////////////////
  // TODO: Should we use `useReducer` or Redux for hotspot state? /////////
  /// /////////////////////////////////////////////////////////////////////

  const [availableHotspots, setAvailableHotspots] = useState<
    Record<string, Device>
  >({})
  const [
    connectedHotspot,
    setConnectedHotspot,
  ] = useStateWithCallbackLazy<Device | null>(null)

  const [manager, setManager] = useState<BleManager | null>(null)
  const [, setConnectedHotspotDetails] = useState<HotspotDetails | null>(null)

  const readCharacteristic = async (
    uuid: string,
    tries = 1,
  ): Promise<string | undefined> => {
    if (!connectedHotspot) return

    const characteristics = await connectedHotspot.characteristicsForService(
      SERVICE_UUID,
    )
    const characteristic = characteristics.find((c) => c.uuid === uuid)
    if (!characteristic) return

    const { value } = await characteristic.read()
    if (!value) return

    const parsedValue = fromBs64(value)

    if (parsedValue === 'wait') {
      // console.log('got wait from hotspot')
      if (tries - 1 === 0) {
        // console.log('hit limit of retries')
        // TODO we could have this raise an error too depending on how
        // we want to handle
        // return Promise.reject(new Error('Got wait from hotspot'))
        // Logger.sendError(
        //   new Error(`Got wait from hotspot: parsedValue = ${parsedValue}`),
        // )
        return parsedValue
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return readCharacteristic(uuid, tries - 1)
    }

    return parsedValue
  }

  const getAddress = async () => readCharacteristic(PUBKEY_UUID, 3)

  const getState = async () => manager?.state()

  const enable = async () => {
    manager?.enable()
  }

  const connectToHotspot = async (hotspot: Device) => {
    const connectedDevice = await hotspot.connect({
      refreshGatt: 'OnConnected',
    })

    const deviceWithServices = await connectedDevice.discoverAllServicesAndCharacteristics()

    const serviceCharacteristics = await deviceWithServices.characteristicsForService(
      SERVICE_UUID,
    )
    const wifiCharacteristic = serviceCharacteristics.find(
      (c) => c.uuid === WIFI_SSID_UUID,
    )

    if (!wifiCharacteristic) return

    const wifi = await wifiCharacteristic.read()

    setConnectedHotspot(deviceWithServices, async () => {
      const deviceAddress = await getAddress()

      const onboardingCharacteristic = serviceCharacteristics.find(
        (c) => c.uuid === ONBOARDING_KEY_UUID,
      )
      if (!onboardingCharacteristic) return

      const onboardingKey = await onboardingCharacteristic.read()
      if (!onboardingKey || !onboardingKey.value) return

      const onboardingAddress = fromBs64(onboardingKey.value)
      const hotspotType = getHotspotType(onboardingAddress)
      const hotspotName = getHotspotName(hotspotType)

      if (onboardingAddress.length < 20) {
        // Logger.sendError(
        //   new Error(`Invalid onboarding address: ${onboardingAddress}`),
        // )
      }

      /// ////////////////////////////////////////////////////////////////////////////////////////////////////////
      // TODO: Find a better place for ↓↓↓this↓↓↓ and separation of bluetooth/http/hotspot concerns in general //
      /// //////////////////////////////////////////////////////////////////////////////////////////////////////

      // const feesStatus = await this.getStakingFees(onboardingAddress)
      // if (feesStatus.data) {
      //   connectedHotspotDetails.free_add_hotspot = true
      //   connectedHotspotDetails.onboardingAddress = onboardingAddress
      // }

      const details: HotspotDetails = {
        address: deviceAddress,
        mac: hotspot.localName?.slice(15),
        type: hotspotType,
        name: hotspotName,
      }
      setConnectedHotspotDetails(details)

      const retval = {
        wifi: wifi.value ? fromBs64(wifi.value) : '',
        address: deviceAddress,
        hotspotType,
      }

      console.log(retval)

      return retval
    })
  }

  useEffect(() => {
    setManager(new BleManager())
  }, [])

  const scanForHotspots = async (ms: number) => {
    setAvailableHotspots({})
    setConnectedHotspot(null, () => {})

    manager?.startDeviceScan(
      [SERVICE_UUID],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          // Logger.sendError(error)
          return
        }

        if (device?.localName) {
          setAvailableHotspots((prev) => ({ ...prev, [device.id]: device }))
        }
      },
    )

    await sleep(ms)

    manager?.stopDeviceScan()
  }

  return {
    getState,
    enable,
    scanForHotspots,
    availableHotspots,
    connectToHotspot,
  }
}

const initialState = {
  getState: async () => State.Unknown,
  enable: async () => {},
  scanForHotspots: async () => {},
  availableHotspots: {},
  connectToHotspot: async () => {},
}

const BleContext = createContext<ReturnType<typeof useBluetooth>>(initialState)
const { Provider } = BleContext

const BluetoothProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useBluetooth()}>{children}</Provider>
}

export const useBluetoothContext = () => useContext(BleContext)

export default BluetoothProvider
