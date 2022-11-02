import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Center, Input, InputGroup, InputLeftAddon, VStack } from 'native-base';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../screens';


type otpScreenProp = StackNavigationProp<RootStackParamList, 'otp'>;


const SignIn = () => {

  const navigation = useNavigation<otpScreenProp>();

  const [text, setText] = useState('')
  const number = `+62${text}`


  const handleClick = () => {

    navigation.navigate('otp')
  }



  return (
    <SafeAreaView>
      <VStack alignItems="center" space={2.5} h="100%" px="3">

        <Center mt="20" size="40" >LOGO</Center>
        <Center mt="10" >
          <InputGroup w={{
            base: "80%",
            md: "285"
          }}>
            <InputLeftAddon children={"+62"} />
            <Input value={text} onChangeText={text => setText(text)} keyboardType='numeric' w={{

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

