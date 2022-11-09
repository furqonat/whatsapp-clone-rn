
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Box, Button, Heading, Stack, useToast, VStack } from 'native-base';
import { useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell
} from 'react-native-confirmation-code-field';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebase } from 'utils';
import { RootStackParamList } from '../screens';

const styles = StyleSheet.create({
	root: { padding: 20, minHeight: 300 },
	title: { textAlign: 'center', fontSize: 30 },
	codeFieldRoot: { marginTop: 20, display: 'flex', flexDirection: 'row', gap: 2 },
	cell: {
		width: 40,
		height: 40,
		lineHeight: 38,
		fontSize: 24,
		borderWidth: 2,
		borderColor: '#00000030',
		textAlign: 'center',
		marginRight: 2,
		marginLeft: 2,
		borderRadius: 10,
		backgroundColor: '#fff',
	},
	focusCell: {
		borderColor: '#000',
	},
});

type formScreenProp = StackNavigationProp<RootStackParamList, 'form'>

// TODO: implementation send verification with WhatsApp
const Otp = () => {
	const navigation = useNavigation<formScreenProp>()
	const toast = useToast()
	const [value, setValue] = useState('');
	const ref = useBlurOnFulfill({ value, cellCount: 6 });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	})

	const { confirmationResult, signInWithWhatsApp, verifyCode, phone } = useFirebase()

	const handlePress = () => {
		if (value.length === 6) {
			confirmationResult?.confirm(value).then((_n) => {
				navigation.navigate('form')
			}).catch((_error) => {
				const id = 'error'
				if (!toast.isActive(id)) {
					toast.show({
						id: id,
						title: 'Error verification code not match'
					})
				}
			})
		}
	}

	return (
		<SafeAreaView>
			<VStack
				direction={'column'}
				h={"100%"}>
				<Stack
					marginTop={20}
					marginBottom={20}
					alignItems={'center'}
					flexDirection={'column'}
					space={2}>
					<Heading>
						<Text style={styles.title}>Verifikasi Kode</Text>
					</Heading>
					<Text
						style={{
							textAlign: 'center',
						}}>
						Kami telah mengirim verifikasi kode ke nomor telepon anda
					</Text>
				</Stack>
				<Stack
					direction={'column'}
					background={'gray.200'}
					px={4}
					flex={1}
					alignItems={'center'}
					borderTopRadius={20}
					py={10}
					height={'100%'}
					shadow={10}
					space={4}>
					<CodeField
						ref={ref}
						{...props}
						value={value}
						onChangeText={setValue}
						cellCount={6}
						rootStyle={styles.codeFieldRoot}
						keyboardType={"number-pad"}
						textContentType={"oneTimeCode"}
						renderCell={({ index, symbol, isFocused }) => (
							<Text
								key={index}
								style={[styles.cell, isFocused && styles.focusCell]}
								onLayout={getCellOnLayoutHandler(index)}>
								{symbol || (isFocused ? <Cursor /> : null)}
							</Text>
						)}
					/>
					<Button
						disabled={value.length < 6}
						onPress={handlePress}>
						Verifikasi
					</Button>
					<Text
						style={{
							fontSize: 16,
							textAlign: 'center',
						}}>
						Tidak menerima kode atau nomor sudah tidak aktif? Kirim verifikasi kode ke &nbsp;
						<Text
							style={{
								color: '#3b5998',
								fontWeight: 'bold',
							}}
							onPress={() => {
								// signInWithWhatsApp(phone)
							}}>
							 WhatsApp
						</Text>
					</Text>
				</Stack>
			</VStack>
		</SafeAreaView>

	)
}

export { Otp };

