import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNavigationProp } from '@react-navigation/stack'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { IconButton } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import { useRef, useState } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Button } from 'react-native-paper'
import { useFirebase } from 'utils'

type Props = NativeStackScreenProps<RootStackParamList, 'change_phone', 'profile'>

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

const ChangePhone = ({ route }: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'tabbar'>>()
    const recaptchaVerifier = useRef<any>(null)
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const ref = useBlurOnFulfill({ value, cellCount: 6 })
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    })

    const { changePhoneNumber } = useFirebase()

    const handlePress = () => {
        if (value.length === 6) {
            setLoading(true)
            changePhoneNumber(route?.params?.new_phone, value).then(_n => {
                setLoading(false)
                navigation.navigate('tabbar')
            })
        }
    }

    return (
        <View>
            <StatusBar
                animated={true}
                backgroundColor={'#5b21b6'}
            />
            <View
                style={{
                    zIndex: 1,
                    height: 60,
                    display: 'flex',
                    backgroundColor: '#5b21b6',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        right: 10,
                    }}>
                    <IconButton
                        onPress={() => navigation.goBack()}
                        borderRadius='full'
                        _icon={{
                            as: Ionicons,
                            name: 'arrow-back-outline',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                        }}>
                        Verifikasi Nomor Telepon
                    </Text>
                </View>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10%',
                }}>
                <Text
                    style={{
                        fontSize: 18,
                    }}>
                    Kami telah mengirimkan kode verifikasi ke nomor telepon baru anda {route?.params.new_phone}
                </Text>
                <Text>Masukkan kode verifikasi untuk melanjutkan</Text>
                <CodeField
                    ref={ref}
                    {...props}
                    // editable={!loading}
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
                    onPress={handlePress}
                    style={{
                        marginTop: 20,
                    }}
                    loading={loading}
                    mode={'contained'}
                    disabled={value.length < 6 || loading}>
                    Selesai
                </Button>
            </View>
        </View>
    )
}

export { ChangePhone }
