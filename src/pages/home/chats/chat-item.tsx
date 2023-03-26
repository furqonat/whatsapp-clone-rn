import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAvatar, useChats, useContact, useStatus } from 'hooks'
import moment from 'moment'
import { RootStackParamList } from 'pages/screens'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StatusBar, Text, View } from 'react-native'
import ImageModal from 'react-native-image-modal'
import { ActivityIndicator, Button, Dialog, IconButton, Menu, Snackbar, TextInput } from 'react-native-paper'
import { IChatItem, IChatList, IChatMessage, IContact, useFirebase } from 'utils'

import { ChatInput } from './chat-input'

type Props = NativeStackScreenProps<RootStackParamList, 'chatItem', 'Stack'>
type TransactionScreenProp = StackNavigationProp<RootStackParamList, 'new_transaction'>

const ChatItem = ({ route }: Props) => {
    const navigation = useNavigation<TransactionScreenProp>()

    const handleBack = () => {
        navigation.goBack()
    }

    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

    const [limit, setLimit] = useState(10)

    const [snackBar, setSnackBar] = useState(false)
    const [snackBarText, setSnackBarText] = useState('')

    const { user } = useFirebase()
    const { messages, loading } = useChats({
        id: route?.params?.chatId,
        user,
        limit,
    })

    const [message, setMessage] = useState<IChatMessage[]>([])
    const [receiver, setReceiver] = useState<IChatItem | null>(null)
    const [chatList, setChatList] = useState<IChatList | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [contactName, setContactName] = useState('')

    const { status } = useStatus({
        phoneNumber: route?.params?.phoneNumber,
    })

    const { avatar } = useAvatar({
        uid: user?.uid === chatList?.owner ? chatList?.receiver?.uid : chatList?.owner,
    })
    const { contact, saveContact } = useContact({
        contactId: receiver?.uid,
        user,
    })

    useEffect(() => {
        if (route?.params?.phoneNumber) {
            firestore()
                .collection('users')
                .where('phoneNumber', '==', `${route?.params?.phoneNumber}`)
                .get()
                .then(doc => {
                    if (doc.empty) {
                        setReceiver(null)
                    } else {
                        doc.forEach(doc => {
                            setReceiver(doc.data() as IChatItem)
                        })
                    }
                })
        }
    }, [route?.params?.phoneNumber])

    useEffect(() => {
        if (messages) {
            setMessage(messages)
        }
    }, [messages])

    useEffect(() => {
        if (route?.params?.chatId) {
            // const dbRef = doc(db, 'chats', route?.params?.chatId)
            // getDoc(dbRef).then(doc => {
            //     if (doc.exists()) {
            //         const data = doc.data()
            //         setChatList(data as IChatList)
            //     }
            // })
            firestore()
                .collection('chats')
                .doc(route?.params?.chatId)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data()
                        setChatList(data as IChatList)
                    }
                })
        }
    }, [route?.params?.chatId])

    const handleSaveContact = () => {
        if (receiver && contactName.length > 0) {
            saveContact({
                uid: receiver?.uid,
                phoneNumber: receiver?.phoneNumber,
                displayName: contactName,
                email: receiver?.email,
            })
                .then(() => {
                    setIsOpen(false)
                })
                .catch(err => {
                    setSnackBar(false)
                    setSnackBarText(err.message)
                    setIsOpen(false)
                })
        }
    }

    const handleOpenModal = () => {
        setIsOpen(!isOpen)
    }

    const getDisplayName = () => {
        if (contact) {
            return contact?.displayName
        }
        if (user) {
            if (chatList?.owner !== null && chatList?.owner === user.uid) {
                return chatList?.receiver.phoneNumber
            }
            return chatList?.ownerPhoneNumber || receiver?.phoneNumber
        }
    }

    const appendMessage = (chat: IChatMessage) => {
        setMessage([chat, ...message])
    }

    const newTransaction = (item?: IContact) => {
        if (!receiver?.isIDCardVerified) {
            alert('Akun ini belum terverifikasi')
        } else if (!user?.isIDCardVerified) {
            alert('Akun anda belum terverifikasi')
            navigation.navigate('profile_diri')
        } else {
            if (item) {
                navigation.navigate('new_transaction', { contact: item })
            } else {
                navigation.navigate('new_transaction', { contact: receiver })
            }
        }
    }

    const handleUnsopported = () => {
        alert(
            'Untuk saat ini fitur ini hanya tersedia untuk desktop web. silahkan akses melalui browser desktop anda untuk menggunakan fitur ini'
        )
    }

    return (
        <>
            <StatusBar
                animated={true}
                backgroundColor={'#5b21b6'}
            />
            <View
                style={{
                    height: '100%',
                    flexDirection: 'column',
                }}>
                <View
                    style={{
                        zIndex: 1,
                        height: 60,
                        display: 'flex',
                        backgroundColor: '#5b21b6',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            right: 10,
                        }}>
                        <IconButton
                            color={'white'}
                            onPress={handleBack}
                            icon={'arrow-left'}
                        />
                        <Image
                            style={{
                                height: 40,
                                width: 40,
                                borderRadius: 50,
                                marginRight: 10,
                            }}
                            source={{ uri: avatar ? avatar : `https://ui-avatars.com/api/?name=Rerkberin` }}
                        />
                        <View
                            style={{
                                flexDirection: 'column',
                            }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                }}>
                                {getDisplayName()}
                            </Text>
                            <Text
                                style={{
                                    color: 'white',
                                }}>
                                {status && status === 'online'
                                    ? 'online'
                                    : status !== ''
                                    ? moment(status).fromNow()
                                    : ''}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <IconButton
                            color={'white'}
                            onPress={handleUnsopported}
                            icon={'video'}
                        />
                        <IconButton
                            color={'white'}
                            onPress={handleUnsopported}
                            icon={'phone'}
                        />
                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={
                                <IconButton
                                    color={'white'}
                                    onPress={openMenu}
                                    icon={'dots-vertical'}
                                    // borderRadius='full'
                                    // _icon={{
                                    //     as: Ionicons,
                                    //     name: 'ellipsis-vertical',
                                    //     color: 'white',
                                    //     size: '5',
                                    // }}
                                />
                            }>
                            {!contact ? (
                                <Menu.Item
                                    onPress={handleOpenModal}
                                    title={'Tambahkan ke kontak'}
                                />
                            ) : null}
                            <Menu.Item
                                title={'Buat Transaksi'}
                                onPress={() => newTransaction(contact!)}
                            />

                            <Menu.Item
                                disabled={true}
                                title={'Blokir'}
                            />
                            <Menu.Item
                                disabled={true}
                                title={'Laporakan'}
                            />
                        </Menu>
                    </View>
                </View>
                <FlatList
                    style={{
                        display: 'flex',
                        flex: 1,
                    }}
                    inverted={true}
                    data={message}
                    renderItem={item => {
                        const value = []
                        if (item.item.type === 'image') {
                            value.push(item.item.message.text)
                        }
                        return (
                            <View
                                style={{
                                    margin: 1,
                                    flexDirection: 'column',
                                }}
                                key={item.index}>
                                <View
                                    style={{
                                        justifyContent: 'space-between',
                                        maxWidth: '70%',
                                        minHeight: 55,
                                        minWidth: '35%',
                                        // backgroundColor:'#4FA095',
                                        backgroundColor:
                                            item?.item?.sender?.phoneNumber === user?.phoneNumber
                                                ? '#6ECCAF'
                                                : '#2192FF',
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderTopRightRadius:
                                            item?.item?.sender?.phoneNumber === user?.phoneNumber ? 0 : 20,
                                        borderBottomEndRadius: 20,
                                        borderBottomLeftRadius: 20,
                                        borderTopLeftRadius:
                                            item?.item?.sender?.phoneNumber === user?.phoneNumber ? 20 : 0,
                                        marginVertical: 2,
                                        marginHorizontal: 5,
                                        alignSelf:
                                            item?.item?.sender?.phoneNumber === user?.phoneNumber
                                                ? 'flex-end'
                                                : 'flex-start',
                                    }}>
                                    {item.item.message?.text?.length > 200 && item.item.type === 'text' ? (
                                        <ReadMore text={item.item.message.text} />
                                    ) : (
                                        <>
                                            {item.item.type === 'text' ? (
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                    }}>
                                                    {item.item.message?.text}
                                                </Text>
                                            ) : (
                                                <ImageModal
                                                    resizeMode='contain'
                                                    imageBackgroundColor='#000000'
                                                    style={{
                                                        width: 150,
                                                        height: 150,
                                                    }}
                                                    source={{
                                                        uri: item.item.message.text,
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}
                                    <Text
                                        style={{
                                            color: '#FFE9A0',
                                        }}>
                                        {moment(item?.item?.message?.createdAt)?.fromNow()}
                                    </Text>
                                </View>
                            </View>
                        )
                    }}
                    onEndReached={() => {
                        setLimit(limit + 10)
                    }}
                    ListFooterComponent={
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            {loading && limit < message.length ? <ActivityIndicator color='#2192FF' /> : null}
                        </View>
                    }
                />
                <ChatInput
                    user={receiver}
                    id={route?.params?.chatId}
                    onSend={appendMessage}
                />
            </View>

            <Dialog
                visible={isOpen}
                onDismiss={handleOpenModal}>
                <Dialog.Title>
                    <Text>Simpan Kontan</Text>
                </Dialog.Title>
                <Dialog.Content>
                    <Text>Masukan nama untuk kontak ini</Text>
                    <TextInput
                        value={contactName}
                        onChangeText={setContactName}
                        placeholder={'Nama Kontak'}
                    />
                    <Dialog.Actions>
                        <Button
                            mode={'outlined'}
                            onPress={handleOpenModal}>
                            Cancel
                        </Button>
                        <Button onPress={handleSaveContact}>Save</Button>
                    </Dialog.Actions>
                </Dialog.Content>
            </Dialog>
            <Snackbar
                visible={snackBar}
                action={{
                    label: 'CLOSE',
                    onPress: () => setSnackBar(false),
                }}
                onDismiss={() => setSnackBar(false)}>
                {snackBarText}
            </Snackbar>
        </>
    )
}

const ReadMore = (props: { text: string }) => {
    const [maxMessageLength, setMaxMessageLength] = useState(200)
    const [expanded, setExpanded] = useState(false)

    const handleReadMore = (length: number) => {
        setMaxMessageLength(expanded ? 200 : length)
        setExpanded(!expanded)
    }

    return (
        <Text
            style={{
                color: 'white',
            }}>
            {props.text?.slice(0, maxMessageLength)}...
            <Text
                style={{
                    fontWeight: 'bold',
                }}
                onPress={() => {
                    handleReadMore(props.text?.length)
                }}>
                {expanded ? 'Read less' : 'Read more'}
            </Text>
        </Text>
    )
}

export { ChatItem }
