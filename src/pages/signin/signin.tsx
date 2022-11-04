import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Button, Center, Input, InputGroup, InputLeftAddon, VStack } from 'native-base';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { app, useFirebase } from 'utils';
import { RootStackParamList } from '../screens';


type otpScreenProp = StackNavigationProp<RootStackParamList, 'otp'>;


const SignIn = () => {

  const navigation = useNavigation<otpScreenProp>();

  const [phoneNumber, setPhoneNumber] = useState('')
  const recaptchaVerifier = useRef<any>(null)

  const { signInWithPhone } = useFirebase()


  const handleClick = () => {
    const localPhoneNumber = `+62${phoneNumber}`
    signInWithPhone(localPhoneNumber, recaptchaVerifier.current).then((_n) => {
      navigation.navigate('otp')
    }).catch((_error) => {
    })
  }



  return (
    <SafeAreaView>
      <VStack alignItems="center" space={2.5} h="100%" px="3">
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={app?.options}
        />
        <Center mt="20" size="40" >LOGO</Center>
        <Center mt="10" >
          <InputGroup w={{
            base: "80%",
            md: "285"
          }}>
            <InputLeftAddon children={"+62"} />
            <Input value={phoneNumber} onChangeText={text => setPhoneNumber(text)} keyboardType='numeric' w={{

              base: "70%",
              md: "100%"
            }} placeholder="Input Number" />

          </InputGroup>
          <Button onPress={handleClick} mt="8" size="md">Next</Button>
        </Center>


      </VStack>
    </SafeAreaView>

  )
}

export { SignIn };

