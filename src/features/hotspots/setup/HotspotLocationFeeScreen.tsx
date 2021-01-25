// import React, { useEffect, useMemo, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigation } from '@react-navigation/native'
// import BackScreen from '../../../components/BackScreen'
// import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
// import { fetchData, fetchTxns } from '../../../store/account/accountSlice'
// import { RootState } from '../../../store/rootReducer'
// import { useAppDispatch } from '../../../store/store'
// import HotspotLocationFeePending from './HotspotLocationFeePending'
// import HotspotLocationFee from './HotspotLocationFee'
// import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
// import { getLocation } from '../../../store/user/appSlice'

// const HotspotLocationFeeScreen = () => {
//   const dispatch = useAppDispatch()
//   const {
//     updateHotspotStatus,
//     loadLocationFeeData,
//   } = useConnectedHotspotContext()

//   const navigation = useNavigation<HotspotSetupNavigationProp>()
//   const {
//     account: {
//       account,
//       txns: { pending },
//     },
//     connectedHotspot: { nonce: locationNonce, freeAddHotspot },
//   } = useSelector((state: RootState) => state)

//   const [feeData, setFeeData] = useState<
//     | {
//         isFree: boolean
//         hasSufficientBalance: boolean
//         totalStakingAmount: number
//       }
//     | undefined
//   >()

//   useEffect(() => {
//     dispatch(fetchTxns('pending'))
//     dispatch(getLocation())
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const pendingAssertTxn = useMemo(() => {
//     // check if there are any existing pending location transactions
//     return pending?.find(
//       (txn) => txn.type === 'location' && txn.status === 'pending',
//     )
//   }, [pending])

//   useEffect(() => {
//     const load = async () => {
//       const locData = await loadLocationFeeData()
//       setFeeData(locData)
//     }
//     load()
//   }, [
//     account?.balance?.integerBalance,
//     freeAddHotspot,
//     locationNonce,
//     loadLocationFeeData,
//   ])

//   useEffect(() => {
//     dispatch(fetchData()) // not sure if this is needed here, but what the hell
//     updateHotspotStatus()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <BackScreen>
//       {pendingAssertTxn && <HotspotLocationFeePending />}
//       {!pendingAssertTxn && (
//         <HotspotLocationFee
//           isFree={!!feeData?.isFree}
//           hasSufficientBalance={!!feeData?.hasSufficientBalance}
//           balance={account?.balance?.integerBalance || 0}
//           amount={0}
//           continuePressed={() => {
//             navigation.push('HotspotSetupPickLocationScreen')
//           }}
//         />
//       )}
//     </BackScreen>
//   )
// }

// export default HotspotLocationFeeScreen
