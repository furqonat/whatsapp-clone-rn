
import { Ionicons } from "@expo/vector-icons";
import { useChats } from "hooks";
import { Icon, Menu, Pressable, Stack, StatusBar, Text } from 'native-base';
import React from 'react';
import { Provider } from "react-native-paper";
import { useFirebase } from "utils";
import { ChatList } from "./chat-list";

const Chats = () => {

	const { user } = useFirebase()

	const { chatList } = useChats({ user: user })

	return (
		<Provider>
			<StatusBar backgroundColor={'#5b21b6'} />
			<Stack
				display={'flex'}
				flexDirection={'column'}
				h={'100%'}>
				<Stack
					alignItems={"center"}
					justifyContent={'space-between'}
					space={3}
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
						justifyItems={'center'}
						direction={'row'}
						space={5}>
						<Icon
							as={<Ionicons name="search" />}
							color={'white'}
							size={6} />
						<Menu
							trigger={props => (
								<Pressable accessibilityLabel={'more menu'} {...props}>
									<Icon
										as={Ionicons}
										name={"ellipsis-vertical"}
										borderRadius={'full'}
										color={'white'}
										size={6} />
								</Pressable>
							)}>
							<Menu.Item>Profile</Menu.Item>
							<Menu.Item>Logout</Menu.Item>
							<Menu.Item>New Chat</Menu.Item>
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
		</Provider>
	)
}

export { Chats };

