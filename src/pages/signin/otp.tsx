
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, VStack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebase } from 'utils';
import { RootStackParamList } from '../screens';


type formScreenProp = StackNavigationProp<RootStackParamList, 'form'>;

const Otp = () => {
  const navigation = useNavigation<formScreenProp>()

  const { confirmationResult } = useFirebase()

  console.log(confirmationResult)
  const handlePress = () => {
    navigation.navigate('form')
  }

  return (
    <SafeAreaView>
      <VStack alignItems="center" space={2.5} h="100%" px="3">
        <Input />
        <Button onPress={handlePress}>test</Button>
      </VStack>
    </SafeAreaView>

  )
}

export { Otp };
