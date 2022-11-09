import { useChats } from "hooks"
import { Avatar, Box, IconButton, Image, Menu, Pressable, Stack, StatusBar, Text } from "native-base"
import React, { useEffect, useState } from "react"
import { db, IChatList, useFirebase } from "utils"
import { doc, getDoc } from "firebase/firestore"
import { RootStackParamList } from "pages/screens"
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import moment from 'moment'
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { ChatInput } from "./chat-input"
import {useStatus} from 'hooks'


type Props = NativeStackScreenProps<RootStackParamList, 'chatItem', 'Stack'>;

const ChatItem = ({
    route
}: Props) => {

    

    const navigation = useNavigation()

    const handleBack = () => {
        navigation.goBack()
    }

    const { user } = useFirebase()
    const { messages } = useChats({
        id: route?.params?.chatId,
        user: user
    })

    const [chatList, setChatList] = useState<IChatList | null>(null)
    const [displayName, setDisplayName] = useState('')
    const [status, setStatus] = useState<IChatList | null>(null)

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
        } else { return '' }
    }

    useEffect(() => {

    }, [])


    return (


        <Stack
            h={'100%'}
            direction={'column'}>
            <Stack
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
                        <Text color={'white'}>{status?.receiver.status ==='online'? 'online' : status?.receiver.status !== "" ? moment(status?.receiver.status).fromNow() : ""}</Text>

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
            <Stack
                display={'flex'}
                direction={'column'}
                space={2}
                p={2}
                flex={1}>
                {
                    messages?.map((item, index) => {
                        return (
                            <Stack
                                key={index}
                                direction={'column'}>
                                <Box
                                    backgroundColor={item?.sender?.phoneNumber === user?.phoneNumber ? 'green.500' : 'blue.500'}
                                    px={5}
                                    py={2}
                                    borderRadius={10}
                                    alignSelf={item?.sender?.phoneNumber === user?.phoneNumber ? "flex-end" : "flex-start"}>
                                    <Text
                                        color={'white'}>
                                        {item.message?.text}
                                    </Text>
                                    <Text
                                        color={'white'}>
                                        {moment(item?.message?.createdAt)?.fromNow()}
                                    </Text>
                                </Box>
                            </Stack>
                        )
                    })
                }
            </Stack>
            {
                <ChatInput />
            }
        </Stack>

    )
}

export { ChatItem }