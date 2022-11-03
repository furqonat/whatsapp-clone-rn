
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Avatar, IconButton, ScrollView, Stack, StatusBar, Text, VStack } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const messages = [
	{
		uid: '1',
		displayName: "John Doe",
		photoURL: "https://pbs.twimg.com/profile_images/1264276814308659200/3Qq7ZQ9A_400x400.jpg",
		message: "Hello World",
	},
	{
		uid: '2',
		displayName: "Jane Doe",
		photoURL: "https://pbs.twimg.com/profile_images/1264276814308659200/3Qq7ZQ9A_400x400.jpg",
		message: "Hello World",
	},
	{
		uid: '3',
		displayName: "John Doe",
		photoURL: "https://pbs.twimg.com/profile_images/1264276814308659200/3Qq7ZQ9A_400x400.jpg",
		message: "Hello World",
	}
]

const Chats = () => {
	return (
		<SafeAreaView style={{ backgroundColor: 'white' }} >
			<StatusBar backgroundColor='#5b21b6' />
			<Stack>
				<VStack bottom={2} h={70} alignItems="center" justifyContent='space-between' backgroundColor='violet.800' direction="row" mb="2.5" mt="1.5"  >
					<Stack left={10}>
						<Text color='white' fontSize={20} bold >Rekberin</Text>
					</Stack>

					<Stack direction="row">
						<IconButton borderRadius='full' _icon={{
							as: AntDesign,
							name: "search1",
							color: 'white',
							size: '5'
						}} />
						<IconButton borderRadius='full' _icon={{
							as: Ionicons,
							name: "ellipsis-vertical",
							color: 'white',
							size: '5'
						}} />
					</Stack>

				</VStack>
				<ScrollView>
					{
						messages?.map((message) => {
							return (
								<TouchableOpacity
									key={message.uid}
									style={{ marginBottom: 6, backgroundColor: 'white' }}>
									<Stack direction="row" h={20} alignItems='center' space={10} >
										<Avatar left={5} bg="green.500" source={{
											uri: message.photoURL
										}} />
										<Stack>
											<Text bold fontSize={15}>{message?.displayName}</Text>
											<Text color='amber.400'>{message?.message}</Text>
										</Stack>
									</Stack>
								</TouchableOpacity>
							)
						})
					}
				</ScrollView>

			</Stack>
		</SafeAreaView>
	)
}

export { Chats }
