import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ButtonPrimary } from 'components'
import { Radio, Stack, useToast } from 'native-base'
import phone from 'phone'
import React, { useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Dialog } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFirebase } from 'utils'

import { RootStackParamList } from '../screens'

type otpScreenProp = StackNavigationProp<RootStackParamList, 'otp'>

const SignIn = () => {
    const navigation = useNavigation<otpScreenProp>()

    const toast = useToast()

    const bottomSheetRef = useRef<BottomSheet>(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const snapPoints = useMemo(() => ['50%'], [])
    const [value, setValue] = useState('')

    const { signInWithPhone, signInWithWhatsApp } = useFirebase()

    const handleChose = () => {
        bottomSheetRef.current?.expand()
    }

    const handleClickSignin = (provider: string) => {
        setValue(provider)
        setLoading(true)
        const localPhoneNumber = phone(phoneNumber, {
            country: 'ID',
        })
        if (localPhoneNumber.phoneNumber) {
            if (provider === 'sms') {
                signInWithPhone(localPhoneNumber.phoneNumber)
                    .then(_n => {
                        setLoading(false)
                        navigation.navigate('otp', {
                            provider: 'phone',
                        })
                        bottomSheetRef.current?.collapse()
                    })
                    .catch(_error => {
                        console.error(_error)
                        setLoading(false)
                        toast.show({
                            id: 'toast-id',
                            title: 'ada kesalahan coba lagi',
                        })
                    })
            } else if (provider === 'wa') {
                signInWithWhatsApp(localPhoneNumber.phoneNumber)
                    .then(_n => {
                        setLoading(false)
                        navigation.navigate('otp', {
                            provider: 'whatsapp',
                        })
                        bottomSheetRef.current?.collapse()
                    })
                    .catch(_error => {
                        setLoading(false)
                        toast.show({
                            id: 'toast-id',
                            title: 'ada kesalahan coba lagi',
                        })
                    })
            } else {
                if (!toast.isActive('toast-id')) {
                    setLoading(false)
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
            <View
                style={{
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                <Image source={require('../../assets/adaptive-icon.png')} />

                <Text
                    style={{
                        fontSize: 15,
                        marginBottom: 2,
                        color: '#3b5998',
                    }}>
                    Masukan Nomor Anda
                </Text>
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

                <ButtonPrimary
                    px={10}
                    py={'30%'}
                    disabled={!phoneNumber}
                    onPress={handleChose}
                    title={'Login'}
                />
            </View>
            <BottomSheet
                index={-1}
                snapPoints={snapPoints}
                ref={bottomSheetRef}
                enablePanDownToClose={true}>
                <Radio.Group
                    aria-label={'provider'}
                    value={value}
                    accessibilityLabel={'select an option'}
                    name='value'>
                    <Stack
                        padding={5}
                        space={4}
                        direction={'column'}>
                        <Stack
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            direction={'row'}>
                            <TouchableOpacity onPress={() => handleClickSignin('wa')}>
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
                            <Radio
                                value='wa'
                                aria-label={'Whats app'}>
                                {''}
                            </Radio>
                        </Stack>
                        <Stack
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            direction={'row'}>
                            <TouchableOpacity onPress={() => handleClickSignin('sms')}>
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
                            <Radio
                                value='sms'
                                aria-label={'SMS'}>
                                {''}
                            </Radio>
                        </Stack>
                    </Stack>
                </Radio.Group>
            </BottomSheet>
            <Dialog
                visible={loading}
                dismissable={false}>
                <Dialog.Content>
                    <ActivityIndicator
                        size='large'
                        color='#3b5998'
                    />
                </Dialog.Content>
            </Dialog>
        </SafeAreaView>
    )
}

export { SignIn }
