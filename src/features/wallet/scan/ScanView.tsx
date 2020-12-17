import React, { useState } from 'react'
import { useAsync } from 'react-async-hook'
import { StyleSheet, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

const ScanView = () => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  const { result: permissions } = useAsync(
    BarCodeScanner.requestPermissionsAsync,
    [],
  )

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  if (!permissions) {
    return <Text>Requesting for camera permission</Text>
  }

  if (!permissions.granted) {
    return <Text>No access to camera</Text>
  }

  return (
    <Box flex={1}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </Box>
  )
}

export default ScanView
