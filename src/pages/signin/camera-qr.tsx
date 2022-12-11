import { BACKEND_URL, SALT_KEY } from '@env'
import axios from 'axios'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { encrypt } from 'lib'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useFirebase } from 'utils'

const QrCamera = () => {
    const [hasPermission, setHasPermission] = useState(false)
    const [scanned, setScanned] = useState(false)
    const { user } = useFirebase()

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        }

        getBarCodeScannerPermissions()
    }, [])

    const handleBarCodeScanned = (data: any) => {
        const hash = encrypt(`${SALT_KEY}`)
        const value = JSON.stringify({
            phoneNumber: user?.phoneNumber,
            verificationId: data.data,
        }).toString()
        
        axios
            .post(`${BACKEND_URL}api/v1/qr-code/`, {
                encrypted: hash(value),
            })
            .then(() => {
                setScanned(true)
            })
            .catch(err => {
                
            })
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <Button
                    title={'Tap to Scan Again'}
                    onPress={() => setScanned(false)}
                />
            )}
        </View>
    )
}

export { QrCamera }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
})
