import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useChats, useContacts } from 'hooks'
import { Actionsheet, Button, FlatList, Modal, Stack, StatusBar, Text, Image } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { Colors, IconButton } from 'react-native-paper'
import { useFirebase } from 'utils'
import { ChatList } from './chat-list'
import { ContactList } from './contact-list'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin'>
type qrScreenProp = StackNavigationProp<RootStackParamList, 'qr'>

const Chats = () => {
    const [showModal, setShowModal] = useState(false);
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
                            icon="code-brackets"
                            color={Colors.white}
                            size={23}
                            onPress={handleQr}
                        />
                        <IconButton
                            icon="plus"
                            color={Colors.white}
                            size={23}
                            onPress={handleOpen}
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
            </View>
        </View>
    )
}


export { Chats }

