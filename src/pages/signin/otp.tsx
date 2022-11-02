
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../screens'
import { useEffect, useState } from 'react';
import { VStack, Button, Input} from 'native-base'; 
import { SafeAreaView } from 'react-native-safe-area-context';


type formScreenProp = StackNavigationProp<RootStackParamList, 'form'>;

const Otp = () => {
  const navigation = useNavigation<formScreenProp>();

  const handlePress = () => {
    navigation.navigate('form')
  }

  return (
    <SafeAreaView>
      <VStack  alignItems="center"  space={2.5} h="100%" px="3">
      <Input/>
      <Button onPress={handlePress}>test</Button>  
      </VStack>
    </SafeAreaView>
    
  )
}

export {Otp}