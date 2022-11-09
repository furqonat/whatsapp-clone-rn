import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { doc, getDoc } from "firebase/firestore"
import { useChats, useStatus } from "hooks"
import moment from 'moment'
import { Box, FlatList, IconButton, Image, Menu, Pressable, Stack, Text } from "native-base"
import { RootStackParamList } from "pages/screens"
import React, { useEffect, useState } from "react"
import { ScrollView, View } from 'react-native'
import { db, IChatItem, IChatList, useFirebase } from "utils"
import { ChatInput } from "./chat-input"


type Props = NativeStackScreenProps<RootStackParamList, 'chatItem', 'Stack'>;

const ChatItem = ({
    route
}: Props) => {

    const navigation = useNavigation()

    const handleBack = () => {
        navigation.goBack()
    }

    const viewRef = React.useRef<View>(null)
    const scrollViewRef = React.useRef<ScrollView>(null)

    const { user } = useFirebase()
    const { messages } = useChats({
        id: route?.params?.chatId,
        user: user
    })

    const [chatList, setChatList] = useState<IChatList | null>(null)
    const { status } = useStatus({
        phoneNumber: route?.params?.phoneNumber
    })
    const [receiver, setReceiver] = useState<IChatItem | null>(null)

    useEffect(() => {
        if (route?.params?.phoneNumber) {
            const docRef = doc(db, 'users', route?.params?.phoneNumber)
            getDoc(docRef).then((doc) => {
                if (doc.exists()) {
                    setReceiver(doc.data() as IChatItem)
                } else {
                    setReceiver(null)
                }
            })
        }
    }, [])

    useEffect(() => {
        if (route?.params?.chatId) {
            const dbRef = doc(db, 'chats', route?.params?.chatId)
            getDoc(dbRef).then((doc) => {
                if (doc.exists()) {
                    const data = doc.data()
                    setChatList(data as IChatList)
                }
            })
        }
    }, [route?.params?.chatId])


    const getDisplayName = () => {
        if (user) {
            if (chatList?.owner === user.uid) {
                return chatList?.receiver.displayName
            }
            return chatList?.ownerPhoneNumber
        }
    }

    const getDisplayPicture = () => {
        if (user) {
            if (chatList?.owner === user.uid) {
                return chatList.receiver.photoURL
            }
            return chatList?.receiver.photoURL
        } else {
            return ''
        }
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
                            name: "arrow-back-outline",
                            color: 'white',
                            size: '6'
                        }} />
                    <Image
                        h={10}
                        w={10}
                        borderRadius={'full'}
                        alt={'pp'}
                        src={getDisplayPicture()} />
                    <Stack
                        space={1}
                        direction={'column'}
                    >
                        <Text color={'white'} bold={true} fontSize={15}>{getDisplayName()}</Text>
                        <Text color={'white'}>{status === 'online' ? 'online' : status !== "" ? moment(status).fromNow() : ""}</Text>

                    </Stack>
                </Stack>

                <Stack
                    justifyContent={'center'}
                    direction={"row"}
                    alignItems={'center'}
                >
                    <IconButton borderRadius={'full'} _icon={{
                        as: Ionicons,
                        name: "videocam",
                        color: 'white',
                        size: '6'
                    }} />
                    <IconButton borderRadius='full' _icon={{
                        as: MaterialIcons,
                        name: "phone",
                        color: 'white',
                        size: '6'
                    }} />
                    <Menu backgroundColor='white' shadow={2} w="190" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" >
                            <IconButton   {...triggerProps} borderRadius='full' _icon={{
                                as: Ionicons,
                                name: "ellipsis-vertical",
                                color: 'white',
                                size: '5'
                            }} />
                        </Pressable>;
                    }}>
                        <Menu.Item>Lihat Kontak</Menu.Item>
                        <Menu.Item >Blokir</Menu.Item>
                        <Menu.Item>Laporkan</Menu.Item>
                    </Menu>

                </Stack>

            </Stack>
            <FlatList
                inverted={true}
                data={messages}
                renderItem={(item) => (
                    <Stack
                        m={1}
                        key={item.index}>
                        <Box
                            maxW={310}
                            backgroundColor={item?.item?.sender?.phoneNumber === user?.phoneNumber ? 'green.500' : 'blue.500'}
                            px={5}
                            py={2}
                            borderRadius={10}
                            alignSelf={item?.item?.sender?.phoneNumber === user?.phoneNumber ? "flex-end" : "flex-start"}>
                            <Text
                                color={'white'}>
                                {item.item.message?.text}
                            </Text>
                            <Text
                                color={'amber.200'}>
                                {moment(item?.item?.message?.createdAt)?.fromNow()}
                            </Text>
                        </Box>
                    </Stack>
                )}>
            </FlatList>
            {
                <ChatInput user={receiver} id={route?.params?.chatId} />
            }
        </Stack>

    )
}

export { ChatItem }