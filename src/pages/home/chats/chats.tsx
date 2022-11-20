
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useChats } from "hooks";
import { Icon, IconButton, Menu, NativeBaseProvider, Pressable, Stack, StatusBar, Text } from 'native-base';
import { RootStackParamList } from "pages/screens";
import React from 'react';
import { Provider } from "react-native-paper";
import { useFirebase } from "utils";
import { ChatList } from "./chat-list";

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>;
type qrScreenProp = StackNavigationProp<RootStackParamList, 'qr'>;


const Chats = () => {
	const navigationSignin = useNavigation<signInScreenProp>()
	const navigationQr = useNavigation<qrScreenProp>()
	const { user } = useFirebase()
	const {logout} = useFirebase()

	const { chatList } = useChats({ user: user })

	const handleLogOut = () => {
		logout().then((_) => {
            navigationSignin.navigate('signin')
        })
	}

	const handleQr = () => {
		navigationQr.navigate('qr')
	}

	return (
		<Stack
			direction={'column'}>
			<StatusBar backgroundColor={'#5b21b6'} />
			<Stack
				backgroundColor={'white'}
				display={'flex'}
				flexDirection={'column'}
				h={'100%'}>
				<Stack
					alignItems={"center"}
					justifyContent={'space-between'}
					
					width={'100%'}
					p={5}
					shadow={2}
					backgroundColor={'violet.800'}
					direction={"row"}>
					<Stack>
						<Text
							color={'white'}
							fontSize={20}
							bold={true}>
							Rekberin
						</Text>
					</Stack>

					<Stack
					left={3}
						justifyItems={'center'}
						direction={'row'}
						space={1}>
						<IconButton 
							onPress={handleQr}
							borderRadius='full' _icon={{
							as: Ionicons,
							name: "scan-outline",
							color: 'white',
							size: '5'
						}} />
						<Menu backgroundColor='white' shadow={2} w="auto" trigger={triggerProps => {
							return <Pressable accessibilityLabel="More options menu" >
								<IconButton   {...triggerProps} borderRadius='full' _icon={{
									as: Ionicons,
									name: "ellipsis-vertical",
									color: 'white',
									size: '5'
								}} />
							</Pressable>;
						}}>
							<Menu.Item>Profile</Menu.Item>
							<Menu.Item >New Chat</Menu.Item>
							<Menu.Item onPress={handleLogOut} >Keluar</Menu.Item>
						</Menu>
					</Stack>

				</Stack>
				<Stack
					flex={1}
					overflow={'scroll'}
					flexDirection={'column'}>
					<ChatList
						chatsList={chatList} />
				</Stack>

			</Stack>
		</Stack>
	)
}

export { Chats };

