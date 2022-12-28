import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ButtonPrimary } from 'components'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import React, { useRef, useState } from 'react'
import { Text, TextInput, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { app, useFirebase } from 'utils'
import phone from 'phone'

import { RootStackParamList } from '../screens'
import { Toast, useToast } from 'native-base'

type otpScreenProp = StackNavigationProp<RootStackParamList, 'otp'>

const SignIn = () => {
    const navigation = useNavigation<otpScreenProp>()

    const toast = useToast()

    const [phoneNumber, setPhoneNumber] = useState('')
    const recaptchaVerifier = useRef<any>(null)

    const { signInWithPhone } = useFirebase()

    const handleClick = () => {
        const localPhoneNumber = phone(phoneNumber, {
            country: 'ID',

        })
        if (localPhoneNumber.phoneNumber) {
            signInWithPhone(localPhoneNumber.phoneNumber, recaptchaVerifier.current)
                .then(_n => {
                    navigation.navigate('otp')
                })
                .catch(_error => { })
        } else {
            if (!toast.isActive('toast-id')) {
                toast.show({
                    id: 'toast-id',
                    title: 'Nomor tidak valid',
                    duration: 3000,
                    placement: 'top',
                })
            }
        }
    }

    return (
        <SafeAreaView>
            <View style={{
                alignItems: 'center',
                width: '100%',
                height: '100%',

            }}>

                <Image
                    source={require('../../assets/adaptive-icon.png')}
                />

                <Text style={{
                    fontSize: 15,
                    marginBottom: 2,
                    color: '#3b5998'
                }}>Masukan Nomor Anda</Text>
                <TextInput
                    style={{
                        width: '70%',
                        borderWidth: 1,
                        height: 45,
                        borderRadius: 20,
                        padding: 15,
                        borderColor: '#3b5998',
                    }}

                    value={phoneNumber}
                    onChangeText={(text: React.SetStateAction<string>) => setPhoneNumber(text)}
                    keyboardType='numeric'
                    placeholder='62 81264 XXX'
                />
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={app?.options}
                />

                <ButtonPrimary
                    px={10}
                    py={'30%'}
                    disabled={!phoneNumber}
                    onPress={handleClick}
                    title={'Login'} />
            </View>
        </SafeAreaView>
    )
}



export { SignIn }