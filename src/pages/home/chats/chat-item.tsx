import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackNavigationProp } from '@react-navigation/stack'
import { doc, getDoc } from 'firebase/firestore'
import { useAvatar, useChats, useContact, useStatus } from 'hooks'
import moment from 'moment'
import { Button, Input, Menu, Modal, Pressable, useToast, IconButton } from 'native-base'
import { FlatList, Image, StatusBar, Text, View } from 'react-native'
import { RootStackParamList } from 'pages/screens'
import React, { useEffect, useState } from 'react'
import ImageModal from 'react-native-image-modal'
import { db, IChatItem, IChatList, IChatMessage, IContact, useFirebase } from 'utils'
import { ChatInput } from './chat-input'

type Props = NativeStackScreenProps<RootStackParamList, 'chatItem', 'Stack'>
type TransactionScreenProp = StackNavigationProp<RootStackParamList, 'new_transaction'>

const ChatItem = ({ route }: Props) => {

    const toast = useToast()
    const toastId = 'save-contact'
    const navigation = useNavigation<TransactionScreenProp>()

    const handleBack = () => {
        navigation.goBack()
    }

    const { user } = useFirebase()
    const { messages } = useChats({
        id: route?.params?.chatId,
        user: user,
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
        phoneNumber: user?.uid === chatList?.owner ? chatList?.receiver?.phoneNumber : chatList?.ownerPhoneNumber,
    })
    const { contact, saveContact } = useContact({
        contactId: receiver?.uid,
        user: user
    })

    useEffect(() => {
        if (route?.params?.phoneNumber) {
            const docRef = doc(db, 'users', route?.params?.phoneNumber)
            getDoc(docRef).then(doc => {
                if (doc.exists()) {
                    setReceiver(doc.data() as IChatItem)
                } else {
                    setReceiver(null)
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
            const dbRef = doc(db, 'chats', route?.params?.chatId)
            getDoc(dbRef).then(doc => {
                if (doc.exists()) {
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
                email: receiver?.email
            }).then(() => {
                setIsOpen(false)
            }).catch(err => {
                if (!toast.isActive(toastId)) {
                    toast.show({
                        id: toastId,
                        title: 'Error save contact ' + err?.message,
                    })
                }
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
            if (chatList?.owner === user.uid) {
                return chatList?.receiver.phoneNumber
            }
            return chatList?.ownerPhoneNumber
        }
    }

    const appendMessage = (chat: IChatMessage) => {
        setMessage([chat, ...message])
    }

    const newTransaction = (item: IContact) => {
        if (!receiver?.isIDCardVerified) {
            alert('Akun ini belum terverifikasi')
        } else {
            navigation.navigate('new_transaction', { contact: item })
        }
    }

    const handleUnsopported = () => {
        alert('Untuk saat ini fitur ini hanya tersedia untuk desktop web. silahkan akses melalui browser desktop anda untuk menggunakan fitur ini')
    }


    return (
        <View
            style={{
                height: '100%',
                flexDirection: 'column'
            }}>
            <StatusBar animated={true} backgroundColor={'#5b21b6'} />
            <View
                style={{
                    zIndex: 1,
                    height: 60,
                    display: 'flex',
                    backgroundColor: '#5b21b6',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal:10
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        right: 10
                    }}>

                    <IconButton
                        onPress={handleBack}
                        borderRadius='full'
                        _icon={{
                            as: Ionicons,
                            name: 'arrow-back-outline',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <Image
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 50,
                            marginRight: 10

                        }}
                        source={{ uri: avatar ? avatar : `https://ui-avatars.com/api/?name=Rerkberin`  }}
                    />
                    <View
                        style={{
                            flexDirection: 'column'
                        }}>
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 15
                            }}>
                            {getDisplayName()}
                        </Text>
                        <Text style={{
                            color: 'white'
                        }} >
                            {status && status === 'online' ? 'online' : status !== '' ? moment(status).fromNow() : ''}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <IconButton
                        onPress={handleUnsopported}
                        borderRadius={'full'}
                        _icon={{
                            as: Ionicons,
                            name: 'videocam',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <IconButton
                        onPress={handleUnsopported}
                        borderRadius='full'
                        _icon={{
                            as: MaterialIcons,
                            name: 'phone',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <Menu
                        backgroundColor='white'
                        shadow={2}
                        w='190'
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
                        {
                            !contact ? (
                                <Menu.Item
                                    onPress={handleOpenModal}>
                                    <Text>Tambahkan Ke Kotak</Text>
                                </Menu.Item>
                            ) : null
                        }
                        <Menu.Item
                            onPress={() => newTransaction(contact!!)}>
                            <Text>
                                Buat Transaksi
                            </Text>
                        </Menu.Item>
                        <Menu.Item
                            disabled={true}>
                            <Text>Blokir</Text>
                        </Menu.Item>
                        <Menu.Item
                            disabled={true}>
                            <Text>Laporakan</Text>
                        </Menu.Item>
                    </Menu>
                </View>
            </View>
            <Modal
                isOpen={isOpen}
                onClose={handleOpenModal}
                safeAreaTop={true}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>
                        <Text>Simpan Kontan</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Text>Masukan nama untuk kontak ini</Text>
                        <Input
                            variant={'rounded'}
                            value={contactName}
                            onChangeText={setContactName}
                            placeholder={'Nama Kontak'} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={handleOpenModal}>
                                Cancel
                            </Button>
                            <Button onPress={handleSaveContact}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <FlatList
                inverted={true}
                data={message}
                renderItem={item => {
                    const value = []
                    if (item.item.type === 'image') {
                        value.push(
                            item.item.message.text
                        )
                    }
                    return (
                        <View
                            style={{
                                margin: 1,
                                flexDirection: 'column'
                            }}
                            key={item.index}>
                            <View
                                style={{
                                    justifyContent:'space-between',
                                    maxWidth: '70%',
                                    minHeight:55,
                                    minWidth:'35%',
                                    // backgroundColor:'#4FA095',
                                    backgroundColor: item?.item?.sender?.phoneNumber === user?.phoneNumber ? '#6ECCAF' : '#2192FF',
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderTopRightRadius: item?.item?.sender?.phoneNumber === user?.phoneNumber ? 0 : 20,
                                    borderBottomEndRadius: 20,
                                    borderBottomLeftRadius: 20,
                                    borderTopLeftRadius: item?.item?.sender?.phoneNumber === user?.phoneNumber ? 20 : 0,
                                    marginVertical: 2,
                                    marginHorizontal: 5,
                                    alignSelf: item?.item?.sender?.phoneNumber === user?.phoneNumber ? 'flex-end' : 'flex-start'
                                }}>
                                {item.item.message?.text?.length > 200 && item.item.type === "text" ? (
                                    <ReadMore text={item.item.message.text} />
                                ) : (
                                    <>
                                        {
                                            item.item.type === "text" ? (
                                                <Text style={{
                                                    color: 'white'
                                                }}>
                                                    {item.item.message?.text}
                                                </Text>
                                            ) : (
                                                <ImageModal
                                                    resizeMode="contain"
                                                    imageBackgroundColor="#000000"
                                                    style={{
                                                        width: 150,
                                                        height: 150,
                                                    }}
                                                    source={{
                                                        uri: item.item.message.text,
                                                    }}
                                                />
                                            )
                                        }
                                    </>
                                )}
                                <Text style={{
                                    color: '#FFE9A0'
                                }}>{moment(item?.item?.message?.createdAt)?.fromNow()}</Text>
                            </View>
                        </View>
                    )
                }}>

            </FlatList>
            {
                <ChatInput
                    user={receiver}
                    id={route?.params?.chatId}
                    onSend={appendMessage}
                />
            }
        </View>
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
        <Text style={{
            color: 'white'
        }}>
            {props.text?.slice(0, maxMessageLength)}...
            <Text
                style={{
                    fontWeight: 'bold'
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

