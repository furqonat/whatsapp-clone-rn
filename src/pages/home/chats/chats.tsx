
import { Ionicons } from "@expo/vector-icons";
import { useChats } from "hooks";
import { Icon, IconButton, Menu, NativeBaseProvider, Pressable, Stack, StatusBar, Text } from 'native-base';
import React from 'react';
import { Provider } from "react-native-paper";
import { useFirebase } from "utils";
import { ChatList } from "./chat-list";

const Chats = () => {

	const { user } = useFirebase()

	const { chatList } = useChats({ user: user })

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
						<IconButton borderRadius='full' _icon={{
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
							<Menu.Item>Keluar</Menu.Item>
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

