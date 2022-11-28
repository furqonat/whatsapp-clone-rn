import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useChats, useContacts } from 'hooks'
import { Actionsheet, FlatList, IconButton, Menu, Pressable, Stack, StatusBar, Text, TextField } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useMemo, useRef, useState } from 'react'
import { useFirebase } from 'utils'
import { ChatList } from './chat-list'
import { ContactList } from './contact-list'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>
type qrScreenProp = StackNavigationProp<RootStackParamList, 'qr'>

const Chats = () => {
    const navigationSignin = useNavigation<signInScreenProp>()
    const navigationQr = useNavigation<qrScreenProp>()
    const { user } = useFirebase()
    const { logout } = useFirebase()

    const { chatList } = useChats({ user: user })
    const { contacts } = useContacts({ user: user })

    const bottomSheetRef = useRef<BottomSheet>(null)

    const [isOpen, setIsOpen] = useState(false)


    const handleOpen = () => {
        setIsOpen(!isOpen)
    }


    const handleLogOut = () => {
        logout().then(_ => {
            navigationSignin.navigate('signin')
        })
    }

    const handleQr = () => {
        navigationQr.navigate('qr')
    }

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand()
    }

    return (
        <Stack direction={'column'}>
            <StatusBar backgroundColor={'#5b21b6'} />
            <Stack
                backgroundColor={'white'}
                display={'flex'}
                flexDirection={'column'}
                h={'100%'}>
                <Stack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    width={'100%'}
                    p={5}
                    shadow={2}
                    backgroundColor={'violet.800'}
                    direction={'row'}>
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
                            borderRadius='full'
                            _icon={{
                                as: Ionicons,
                                name: 'scan-outline',
                                color: 'white',
                                size: '5',
                            }}
                        />
                        <IconButton
                            borderRadius='full'
                            onPress={handleOpen}
                            _icon={{
                                as: Ionicons,
                                name: 'add-outline',
                                color: 'white',
                                size: '5',
                            }} />
                        <Menu
                            backgroundColor='white'
                            shadow={2}
                            trigger={triggerProps => {
                                return (
                                    <Pressable accessibilityLabel='More options menu'>
                                        <IconButton
                                            {...triggerProps}
                                            borderRadius='full'
                                            _icon={{
                                                as: Ionicons,
                                                name: 'ellipsis-vertical',
                                                color: 'white',
                                                size: '5',
                                            }}
                                        />
                                    </Pressable>
                                )
                            }}>
                            <Menu.Item onPress={handleLogOut}>
                                <Text>Keluar</Text>
                            </Menu.Item>
                        </Menu>
                    </Stack>
                </Stack>
                <Stack
                    flex={1}
                    overflow={'scroll'}
                    flexDirection={'column'}>
                    <ChatList chatsList={chatList} />
                </Stack>
                <Actionsheet
                    size={'full'}
                    onClose={handleOpen}
                    useRNModal={true}
                    isOpen={isOpen}>
                    <Actionsheet.Content
                        alignItems={'flex-start'}>
                        <FlatList
                            data={contacts}
                            renderItem={item => (
                                <Actionsheet.Item>
                                    <ContactList item={item.item} />
                                </Actionsheet.Item>
                            )} />
                    </Actionsheet.Content>
                </Actionsheet>
            </Stack>
        </Stack>
    )
}


export { Chats }

