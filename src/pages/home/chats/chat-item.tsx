import { useChats } from "hooks"
import { Avatar, Box, Stack, Text } from "native-base"
import { useEffect, useState } from "react"
import { db, IChatList, useFirebase } from "utils"
import { doc, getDoc } from "firebase/firestore"
import { RootStackParamList } from "pages/screens"
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import moment from 'moment'


type Props = NativeStackScreenProps<RootStackParamList, 'chatItem', 'Stack'>;

const ChatItem = ({
    route
}: Props) => {

    const { user } = useFirebase()
    const { messages } = useChats({
        id: route?.params?.chatId,
        user: user
    })

    const [chatList, setChatList] = useState<IChatList | null>(null)
    const [status, setStatus] = useState('')
    const [displayName, setDisplayName] = useState('')

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
                return chatList?.receiver.phoneNumber
            }
            return chatList?.ownerPhoneNumber
        }
    }

    useEffect(() => {

    }, [])


    return (
        <Stack
            h={'100%'}
            direction={'column'}>
            <Stack
                display={'flex'}
                px={5}
                space={3}
                backgroundColor={'violet.800'}
                direction={'row'}>
                <Avatar
                    size={'sm'} />
                <Stack
                    space={1}
                    direction={'column'}>
                    <Text
                        fontSize={'md'}
                        color={'white'}>
                        {getDisplayName()}
                    </Text>
                    <Text>
                    </Text>
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
                // nambahi input nang kene
            }
        </Stack>
    )
}

export { ChatItem }