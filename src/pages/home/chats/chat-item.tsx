import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { doc, getDoc } from 'firebase/firestore'
import { useAvatar, useChats, useContact, useStatus } from 'hooks'
import moment from 'moment'
import { Box, Button, FlatList, IconButton, Image, Input, Menu, Modal, Pressable, Stack, Text, TextField, useToast } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useEffect, useState } from 'react'
import { db, IChatItem, IChatList, IChatMessage, useFirebase } from 'utils'
import { ChatInput } from './chat-input'
import ImageModal from 'react-native-image-modal';

type Props = NativeStackScreenProps<RootStackParamList, 'chatItem', 'Stack'>

const ChatItem = ({ route }: Props) => {

    const toast = useToast()
    const toastId = 'save-contact'
    const navigation = useNavigation()

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

    return (
        <Stack
            h={'100%'}
            direction={'column'}>
            <Stack
                zIndex={1}
                h={'60px'}
                display={'flex'}
                backgroundColor={'violet.800'}
                alignItems={'center'}
                justifyContent='space-between'
                direction={'row'}>
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    space={2}>
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
                        h={10}
                        w={10}
                        borderRadius={'full'}
                        alt={'pp'}
                        src={avatar}
                    />
                    <Stack
                        space={1}
                        direction={'column'}>
                        <Text
                            color={'white'}
                            bold={true}
                            fontSize={15}>
                            {getDisplayName()}
                        </Text>
                        <Text color={'white'}>
                            {status && status === 'online' ? 'online' : status !== '' ? moment(status).fromNow() : ''}
                        </Text>
                    </Stack>
                </Stack>

                <Stack
                    justifyContent={'center'}
                    direction={'row'}
                    alignItems={'center'}>
                    <IconButton
                        borderRadius={'full'}
                        _icon={{
                            as: Ionicons,
                            name: 'videocam',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <IconButton
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
                            disabled={!receiver?.isIDCardVerified}>
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
                </Stack>
            </Stack>
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
                        <Stack
                            m={1}
                            direction={'column'}
                            key={item.index}>
                            <Box
                                maxWidth={'70%'}
                                backgroundColor={
                                    item?.item?.sender?.phoneNumber === user?.phoneNumber ? 'green.500' : 'blue.500'
                                }
                                px={5}
                                py={2}
                                borderRadius={10}
                                alignSelf={
                                    item?.item?.sender?.phoneNumber === user?.phoneNumber ? 'flex-end' : 'flex-start'
                                }>
                                {item.item.message?.text?.length > 200 && item.item.type === "text" ? (
                                    <ReadMore text={item.item.message.text} />
                                ) : (
                                    <>
                                        {
                                            item.item.type === "text" ? (
                                                <Text color={'white'}>
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
                                <Text color={'amber.200'}>{moment(item?.item?.message?.createdAt)?.fromNow()}</Text>
                            </Box>
                        </Stack>
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
        </Stack>
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
        <Text color={'white'}>
            {props.text?.slice(0, maxMessageLength)}...
            <Text
                bold={true}
                onPress={() => {
                    handleReadMore(props.text?.length)
                }}>
                {expanded ? 'Read less' : 'Read more'}
            </Text>
        </Text>
    )
}

export { ChatItem }
