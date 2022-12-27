import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useChats, useContacts } from 'hooks'
import { Button, Image, Modal, Stack, StatusBar, Text, VStack } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { Colors, IconButton } from 'react-native-paper'
import { IContact, useFirebase } from 'utils'
import { ChatList } from './chat-list'
import { ContactList } from './contact-list'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin' | "chatItem" | "qr">

const Chats = () => {

    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation<signInScreenProp>()

    const { user, logout } = useFirebase()

    const { chatList } = useChats({ user: user })
    const { contacts } = useContacts({ user: user })

    const bottomSheetRef = useRef<BottomSheet>(null)


    const snapPoints = useMemo(() => ['25%', '50%', '75%'], [])


    const handleLogOut = () => {
        logout().then(_ => {
            navigation.navigate('signin')
        })
    }

    const handleQr = () => {
        navigation.navigate('qr')
    }

    const handleOpenChat = (item: IContact) => {
        const chat = chatList?.filter(chat => {
            return chat.owner === user?.uid && chat.receiver?.uid === item.uid || chat.owner === item.uid && chat.receiver?.uid === user?.uid
        })
        if (chat?.length > 0) {
            bottomSheetRef.current?.close()
            navigation.navigate('chatItem', {
                chatId: chat[0].id,
                phoneNumber: item.phoneNumber
            })
        }
    }

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand()
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (user) {
                BackHandler.exitApp()
            }
            return true
        })
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                return true
            })
        }
    }, [])

    return (
        <View
            style={{
                flexDirection: 'column'
            }}>
            <StatusBar animated={true} backgroundColor={'#5b21b6'} />
            <View
                style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',

                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: 15,
                        shadowOpacity: 2,
                        backgroundColor: '#5b21b6',
                        flexDirection: 'row'
                    }}>
                    <View>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}>
                            Rekberin
                        </Text>
                    </View>

                    <View
                        style={{
                            left: 3,
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                        <IconButton
                            icon="qrcode"
                            color={Colors.white}
                            size={23}
                            onPress={handleQr}
                        />
                        <IconButton
                            icon="plus"
                            color={Colors.white}
                            size={23}
                            onPress={handleOpenBottomSheet}
                        />
                        <IconButton
                            icon="logout"
                            color={Colors.white}
                            size={23}
                            onPress={() => setShowModal(true)}
                        />
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
                            _dark: {
                                bg: "white"
                            },
                            bg: "gray.700"
                        }}>
                            <Modal.Content alignItems={'center'} py={4} maxWidth="350" maxH="212">
                                <Image
                                    size={20}
                                    source={require('../../../assets/adaptive-icon.png')}
                                    alt='logo'
                                />
                                <Text style={{ fontSize: 18, marginBottom: 15 }}>Yakin mau keluar?</Text>
                                <Stack space={30} direction={'row'}>

                                    <Button onPress={() => {
                                        setShowModal(false);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button variant="outline" colorScheme="secondary" onPress={handleLogOut}>
                                        Yes
                                    </Button>
                                </Stack>


                            </Modal.Content>
                        </Modal>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        overflow: 'scroll',
                        flexDirection: 'column'
                    }}>
                    <ChatList chatsList={chatList} />
                </View>
                <BottomSheet
                    index={-1}
                    snapPoints={snapPoints}
                    ref={bottomSheetRef}
                    enablePanDownToClose={true}>
                    <BottomSheetFlatList
                        data={contacts}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => (
                            <VStack
                                p={4}>
                                <ContactList item={item} onPress={handleOpenChat} />
                            </VStack>
                        )}/>
                </BottomSheet>
            </View>
        </View>
    )
}


export { Chats }

