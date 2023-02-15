import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ButtonPrimary } from 'components'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import React, { useMemo, useRef, useState } from 'react'
import { Text, TextInput, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { app, useFirebase } from 'utils'
import phone from 'phone'

import { RootStackParamList } from '../screens'
import { Radio, Stack, Toast, useToast } from 'native-base'
import BottomSheet from '@gorhom/bottom-sheet'
import { TouchableOpacity } from 'react-native-gesture-handler'

type otpScreenProp = StackNavigationProp<RootStackParamList, 'otp'>

const SignIn = () => {
    const navigation = useNavigation<otpScreenProp>()

    const toast = useToast()


    const bottomSheetRef = useRef<BottomSheet>(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const recaptchaVerifier = useRef<any>(null)
    const snapPoints = useMemo(() => ['50%'], [])
    const [value, setValue] = useState('')

    const { signInWithPhone, signInWithWhatsApp } = useFirebase()

    const handleChose = () => {
        bottomSheetRef.current?.expand()
    }

    const handleClickSignin = (provider: string) => {
        setValue(provider)
        const localPhoneNumber = phone(phoneNumber, {
            country: 'ID',

        })
        if (localPhoneNumber.phoneNumber) {
            if (provider === 'sms') {
                signInWithPhone(localPhoneNumber.phoneNumber, recaptchaVerifier.current)
                    .then(_n => {
                        navigation.navigate('otp', {
                            provider: 'phone',
                        })
                        bottomSheetRef.current?.collapse()
                    })
                    .catch(_error => { })
            } else if (provider === 'wa') {
                signInWithWhatsApp(localPhoneNumber.phoneNumber)
                    .then(_n => {
                        navigation.navigate('otp', {
                            provider: 'whatsapp',
                        })
                        bottomSheetRef.current?.collapse()
                    })
                    .catch(_error => { })
            } else {
                if (!toast.isActive('toast-id')) {
                    toast.show({
                        id: 'toast-id',
                        title: 'Provider tidak valid',
                        duration: 3000,
                        placement: 'top',
                    })
                }
            }
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
                    source={require('../../assets/adaptive-icon.png')} />

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
                    onPress={handleChose}
                    title={'Login'} />
            </View>
            <BottomSheet
                index={-1}
                snapPoints={snapPoints}
                ref={bottomSheetRef}
                enablePanDownToClose={true}>
                <Radio.Group
                    value={value}
                    name=''>
                    <Stack
                        padding={5}
                        space={4}
                        direction={'column'}>
                        <Stack
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            direction={'row'}>
                            <TouchableOpacity
                                onPress={() => handleClickSignin('wa')}>
                                <Stack
                                    space={2}
                                    direction={'column'}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}>
                                        Kirim kode melalui WhatsApp
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: 'gray',
                                        }}>
                                        {phoneNumber}
                                    </Text>
                                </Stack>
                            </TouchableOpacity>
                            <Radio value='wa' aria-label={''} />
                        </Stack>
                        <Stack
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            direction={'row'}>
                            <TouchableOpacity
                                onPress={() => handleClickSignin('sms')}>
                                <Stack
                                    space={2}
                                    direction={'column'}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}>
                                        Kirim kode melalui SMS
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: 'gray',
                                        }}>
                                        {phoneNumber}
                                    </Text>
                                </Stack>
                            </TouchableOpacity>
                            <Radio value='sms' />
                        </Stack>
                    </Stack>
                </Radio.Group>
            </BottomSheet>
        </SafeAreaView>
    )
}

export { SignIn }

