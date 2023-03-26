import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useChats, useContacts } from 'hooks'
import { FlatList, Input, VStack } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import phone from 'phone'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, NativeSyntheticEvent, TextInputSubmitEditingEventData, View } from 'react-native'
import { Colors, Dialog, FAB } from 'react-native-paper'
import { IContact, useFirebase, USER_KEY } from 'utils'

import { ChatList, ChatListItem } from './chat-list'
import { ContactList } from './contact-list'

type signInScreenProp = StackNavigationProp<RootStackParamList, 'signin' | 'chatItem' | 'qr'>

const Chats = () => {
    const [showModal, setShowModal] = useState(false)
    const navigation = useNavigation<signInScreenProp>()
    const [loading, setLoading] = useState(false)

    const { user, logout, setValue } = useFirebase()

    const { chatList } = useChats({ user })
    const { contacts } = useContacts({ user })

    const bottomSheetRef = useRef<BottomSheet>(null)

    const [search, setSearch] = useState('')
    const [contactList, setContactList] = useState<IContact[]>([])

    const snapPoints = useMemo(() => ['25%', '50%', '100%'], [])

    const handleLogOut = () => {
       
    }

    const handleOnSearch = (text: string) => {
        setSearch(text)
        if (text === '') {
            setContactList(contacts || [])
        }
    }

    const handleQr = () => {
        navigation.navigate('qr')
    }

    const handleOpenChat = (item: IContact) => {
        const chat = chatList?.filter(chat => {
            return (
                (chat.owner === user?.uid && chat.receiver?.uid === item.uid) ||
                (chat.owner === item.uid && chat.receiver?.uid === user?.uid)
            )
        })
        if (chat?.length > 0) {
            bottomSheetRef.current?.close()
            navigation.navigate('chatItem', {
                chatId: chat[0].id,
                phoneNumber: item.phoneNumber,
            })
        } else {
            const id = user?.uid + item.uid
            bottomSheetRef.current?.close()
            navigation.navigate('chatItem', {
                chatId: id,
                phoneNumber: item.phoneNumber,
            })
        }
    }

    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.expand()
    }

    const handleOnSubmitEventData = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        event.preventDefault()
        // const userRef = collection(db, 'users')
        const phoneNumber = phone(search, {
            country: 'ID',
        }).phoneNumber
        if (phoneNumber && phoneNumber !== '' && phoneNumber !== user?.phoneNumber) {
            /*            const user = query(userRef, where('phoneNumber', '==', phoneNumber))
                        getDocs(user)
                            .then(querySnapshot => {
                                if (querySnapshot.docs.length > 0) {
                                    const data = querySnapshot.docs[0].data()
                                    const contact: IContact = {
                                        uid: data.uid,
                                        phoneNumber: data.phoneNumber,
                                        displayName: data.displayName,
                                    }
                                    setContactList([contact])
                                } else {
                                    setContactList([])
                                }
                            })
                            .then(() => {
                            })
                            .catch(error => {
                                alert('Ada kesalahan, silahkan coba lagi')
                            })*/
            firestore()
                .collection('users')
                .where('phoneNumber', '==', phoneNumber)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.docs.length > 0) {
                        const data = querySnapshot.docs[0].data()
                        const contact: IContact = {
                            uid: data.uid,
                            phoneNumber: data.phoneNumber,
                            displayName: data.displayName,
                        }
                        setContactList([contact])
                    } else {
                        setContactList([])
                    }
                })
                .catch(() => {
                    alert('Ada kesalahan, silahkan coba lagi')
                })
        } else {
            setContactList([])
        }
    }

    useEffect(() => {
        if (contacts) {
            setContactList(contacts)
        }
        if (search === '') {
            setContactList(contacts || [])
        }
    }, [contacts, search])

    return (
        <View
            style={{
                flexDirection: 'column',
            }}>
            <View
                style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                {/*   <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: 15,
                        shadowOpacity: 2,
                        backgroundColor: '#5b21b6',
                        flexDirection: 'row',
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
                            icon='qrcode'
                            color={Colors.white}
                            size={23}
                            onPress={handleQr}
                        />
                        <IconButton
                            icon='plus'
                            color={Colors.white}
                            size={23}
                            onPress={handleOpenBottomSheet}
                        />
                        <IconButton
                            icon='logout'
                            color={Colors.white}
                            size={23}
                            onPress={() => setShowModal(true)}
                        />
                        <Modal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            _backdrop={{
                                _dark: {
                                    bg: 'white',
                                },
                                bg: 'gray.700',
                            }}>
                            <Modal.Content
                                alignItems={'center'}
                                py={4}
                                maxWidth='350'
                                maxH='212'>
                                <Image
                                    size={20}
                                    source={require('../../../assets/adaptive-icon.png')}
                                    alt='logo'
                                />
                                <Text style={{ fontSize: 18, marginBottom: 15 }}>Yakin mau keluar?</Text>
                                <Stack
                                    space={30}
                                    direction={'row'}>
                                    <Button
                                        onPress={() => {
                                            setShowModal(false)
                                        }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='outline'
                                        colorScheme='secondary'
                                        onPress={handleLogOut}>
                                        Yes
                                    </Button>
                                </Stack>
                            </Modal.Content>
                        </Modal>
                    </View>
                </View>*/}
                <View
                    style={{
                        flex: 1,
                        overflow: 'scroll',
                        flexDirection: 'column',
                    }}>
                    <FlatList
                        data={chatList}
                        renderItem={item => (
                            <ChatListItem
                                key={item.index}
                                item={item.item}
                            />
                        )}
                    />
                </View>
                <BottomSheet
                    index={-1}
                    snapPoints={snapPoints}
                    ref={bottomSheetRef}
                    enablePanDownToClose={true}>
                    <Input
                        onChangeText={handleOnSearch}
                        value={search}
                        onSubmitEditing={handleOnSubmitEventData}
                        m={4}
                        returnKeyType='search'
                        variant='filled'
                        multiline={false}
                        keyboardType='phone-pad'
                        placeholder='Cari nomor telepone pengguna lain disini'
                    />
                    <BottomSheetFlatList
                        data={contactList}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => (
                            <VStack p={4}>
                                <ContactList
                                    item={item}
                                    onPress={handleOpenChat}
                                />
                            </VStack>
                        )}
                    />
                </BottomSheet>
                <FAB
                    onPress={handleOpenBottomSheet}
                    icon='message-plus-outline'
                    color={'white'}
                    style={{
                        backgroundColor: '#5b21b6',
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                    }}
                />
            </View>
            <Dialog
                dismissable={false}
                visible={loading}>
                <Dialog.Content>
                    <ActivityIndicator
                        size='large'
                        color={Colors.blue500}
                    />
                </Dialog.Content>
            </Dialog>
        </View>
    )
}

export { Chats }
