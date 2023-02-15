import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useToast } from 'native-base'
import React, { useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFirebase } from 'utils'

import { Button } from 'react-native-paper'
import { RootStackParamList } from '../screens'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

const styles = StyleSheet.create({
    root: { padding: 20, minHeight: 300 },
    title: { textAlign: 'center', fontSize: 30, color: '#fff' },
    codeFieldRoot: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        marginRight: 2,
        marginLeft: 2,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    focusCell: {
        borderColor: '#000',
    },
})

type formScreenProp = StackNavigationProp<RootStackParamList, 'form'>
type Props = NativeStackScreenProps<RootStackParamList, 'otp', 'Stack'>

const Otp = ({ route }: Props) => {
    const navigation = useNavigation<formScreenProp>()
    const toast = useToast()
    const [value, setValue] = useState('')
    const ref = useBlurOnFulfill({ value, cellCount: 6 })
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    })
    const [loading, setLoading] = useState(false)

    const { confirmationResult, signInWithWhatsApp, verifyCode, phone } = useFirebase()

    const handlePress = () => {
        setLoading(true)
        if (value.length === 6 && route?.params?.provider) {
            verifyCode(value, route.params.provider).then(_n => {
                setLoading(false)
                navigation.navigate('form')
            }).catch(_error => {
                setLoading(false)
                toast.show({
                    title: 'Error',
                    description: 'Invalid code',
                    duration: 3000,
                })
            })
        }
    }

    return (
        <SafeAreaView>
            <StatusBar animated={true} backgroundColor={'#863A6F'} />
            <View
                style={{
                    flexDirection: 'column',
                    height: '100%',
                    backgroundColor: '#863A6F'
                }}>
                <View
                    style={{
                        paddingVertical: '15%',
                        alignItems: 'center',
                        padding: 10
                    }}>
                    <View>
                        <Text style={styles.title}>Verifikasi Kode</Text>
                    </View>
                    <Text
                        style={{
                            color: 'white',
                            textAlign: 'center',
                        }}>
                        Kami telah mengirim verifikasi kode ke nomor telepon anda
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        padding: 40,
                        height: '100%',
                        shadowRadius: 10,
                        borderRadius: 20,
                        width: '100%',
                    }}>
                    <CodeField
                        ref={ref}
                        {...props}
                        editable={!loading}
                        value={value}
                        onChangeText={setValue}
                        cellCount={6}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType={'number-pad'}
                        textContentType={'oneTimeCode'}
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <Button
                        style={{
                            marginTop: 20,
                        }}
                        disabled={value.length !== 6 || loading}
                        loading={loading}
                        mode="contained"
                        onPress={handlePress}>
                        Verifikasi
                    </Button>
                    {/* <Text
                        style={{
                            marginTop: 15,
                            fontSize: 16,
                            textAlign: 'center',
                        }}>
                        Tidak menerima kode atau nomor sudah tidak aktif? Kirim verifikasi kode ke &nbsp;
                        <Text
                            style={{
                                color: '#128C7E',
                                fontWeight: 'bold',
                            }}
                            onPress={() => {
                                if (phone)
                                    signInWithWhatsApp(phone)
                            }}>
                            WhatsApp
                        </Text>
                    </Text> */}
                </View>
            </View>
        </SafeAreaView>

    )
}

export { Otp }
