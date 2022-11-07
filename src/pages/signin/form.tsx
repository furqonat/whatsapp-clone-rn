import { AntDesign } from "@expo/vector-icons";
import { doc, updateDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { useAvatar } from "hooks";
import { Button, Center, IconButton, Image, Input, Stack, useToast, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, useFirebase } from "utils";
import { RootStackParamList } from '../screens';

type tabScreenProp = StackNavigationProp<RootStackParamList, 'tabbar'>;

function Form() {

	const navigation = useNavigation<tabScreenProp>()
	const toast = useToast()

	const { user } = useFirebase()
	const [photo, setPhoto] = useState(user?.photoURL)
	const [displayName, setDisplayName] = useState(user?.displayName || '')
	const { uploadAvatar, avatar } = useAvatar({
		phoneNumber: user?.phoneNumber
	})

	const handlePress = () => {
		if (displayName?.length > 0) {
			const dbRef = doc(db, 'users', `${user?.phoneNumber}`)
			updateDoc(dbRef, {
				displayName,
			}).then(() => {
				navigation.navigate('tabbar')
			}).catch((error) => {
				toast.show({
					title: error.message,
				})
			})
		}
	}

	const handleChangeDisplayName = (value: string) => {
		setDisplayName(value)
	}

	useEffect(() => {
		if (photo && photo?.length <= 0) {
			setPhoto(`https://avatars.dicebear.com/api/avataaars/${Date.now()}.png`)
		}
	}, [photo])

	const handleNewAvatar = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (result.cancelled) {
			const toastId = "cancel"
			if (!toast.isActive(toastId)) {
				toast.show({
					id: toastId,
					title: "Get images canceled"
				})
				return
			}
		} else {
			setPhoto(result.uri)
			// convert uri into file
			const file = await fetch(result.uri)
				.then(res => res.blob())
				.then(blob => new File([blob], `${Date.now()}.png`, { type: 'image/png' }))
			uploadAvatar(file)
		}
	}

	return (

		<SafeAreaView>

			<VStack
				alignItems="center"
				space={4}
				height={"100%"}
				px="3">

				<Center
					mt="20"
					size="40">
					<Image
						alt={'photo profile'}
						size={150}
						borderRadius={100}
						source={{
							uri: `${photo}`
						}} />
					<IconButton
						position={"absolute"}
						right={"3"}
						background={'#fff'}
						bottom={"2"}
						borderRadius={'full'}
						size={10}
						onPress={handleNewAvatar}
						_icon={{
							as: AntDesign,
							name: "camera",
							color: 'green.400s'
						}} />
				</Center>
				<Stack
					direction={'column'}
					width={'100%'}>
					<Input
						onChangeText={handleChangeDisplayName}
						value={displayName}
						placeholder="Input Your Name" />

					<Button
						disabled={displayName.length <= 0}
						onPress={handlePress}
						mt={"8"}
						size={"md"}>
						Selesai
					</Button>
				</Stack>
			</VStack>
		</SafeAreaView>
	)
}

export { Form };

