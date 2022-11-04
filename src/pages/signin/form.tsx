import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
	Avatar, Button, Center, IconButton, Input,
	InputGroup, VStack
} from 'native-base';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../screens';

type tabScreenProp = StackNavigationProp<RootStackParamList, 'tabbar'>;

function Form() {

	const navigation = useNavigation<tabScreenProp>();

	const [text, setText] = useState(`https://avatars.dicebear.com/api/avataaars/${Date.now()}.png`)
	const handlePress = () => {
		navigation.navigate('tabbar')
	}


	return (

		<SafeAreaView>
			<VStack alignItems="center" space={2.5} h="100%" px="3">
				<VStack alignItems="center" space={2.5} h="100%" px="3">

					<Center mt="20" size="40"  >
						<Avatar size={150} borderRadius={100} source={{
							uri: `https://avatars.dicebear.com/api/avataaars/${text}.png`
						}} />
						<IconButton position="absolute" right="3" bottom="2" borderRadius='full' size={10} _icon={{
							as: AntDesign,
							name: "camera",
							color: 'green.400s'
						}} />
					</Center>
					<Center mt="10" >
						<InputGroup w={{
							base: "80%",
							md: "285"
						}}>

							<Input onChangeText={(text) => setText(text)} w={{

								base: "70%",
								md: "100%"
							}} placeholder="Input Your Name" />

						</InputGroup>
						<Button onPress={handlePress} mt="8" size="md">Next</Button>
					</Center>


				</VStack>
			</VStack>
		</SafeAreaView>
	)
}

export { Form };
