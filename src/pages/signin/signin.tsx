import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { Button, Image, Input, InputGroup, InputLeftAddon, VStack } from 'native-base'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { app, useFirebase } from 'utils'

import { RootStackParamList } from '../screens'

type otpScreenProp = StackNavigationProp<RootStackParamList, 'otp'>

const SignIn = () => {
    const navigation = useNavigation<otpScreenProp>()

    const [phoneNumber, setPhoneNumber] = useState('')
    const recaptchaVerifier = useRef<any>(null)

    const { signInWithPhone } = useFirebase()

    const handleClick = () => {
        const localPhoneNumber = `+62${phoneNumber}`
        signInWithPhone(localPhoneNumber, recaptchaVerifier.current)
            .then(_n => {
                navigation.navigate('otp')
            })
            .catch(_error => { })
    }

    return (
        <SafeAreaView>
            <VStack
                space={4}
                alignItems='center'
                w={'100%'}
                h='100%'>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={app?.options}
                />
                <Image
                    source={require('../../assets/adaptive-icon.png')}
                    alt='logo'
                />
                <InputGroup
                    w='80%'
                    px={4}>
                    <InputLeftAddon children={'+62'} />
                    <Input
                        flex={1}
                        value={phoneNumber}
                        onChangeText={(text: React.SetStateAction<string>) => setPhoneNumber(text)}
                        keyboardType='numeric'
                        placeholder='Input Number'
                    />
                </InputGroup>
                <Button
                    onPress={handleClick}
                    size='md'>
                    Sign In
                </Button>
            </VStack>
        </SafeAreaView>
    )
}

export { SignIn }

