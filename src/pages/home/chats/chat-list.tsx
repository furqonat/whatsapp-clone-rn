import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";
import { Avatar, Box, Menu, ScrollView, Stack, Text } from "native-base"
import { RootStackParamList } from "pages/screens";
import React from "react";
import { TouchableOpacity } from "react-native"
import { db, IChatItem, IChatList, useFirebase } from "utils"

type ChatItem = StackNavigationProp<RootStackParamList>

const ChatList = (props: {
    chatsList?: IChatList[] | null
}) => {

    return (
        <ScrollView>
            {
                props?.chatsList?.map((item, index) => {
                    return (
                        <ChatListItem
                            key={index}
                            item={item}
                        />
                    )
                })
            }
        </ScrollView>
    )
}

const ChatListItem = (props: {
    item: IChatList
}) => {
    const { item } = props
    const { user } = useFirebase()

    const navigation = useNavigation<ChatItem>()

    const getDisplayName = () => {
        if (user) {
            if (item.owner === user.uid) {
                return item.receiver.displayName
            }
            return item.ownerPhoneNumber
        }
    }

    const getDisplayPicture = () => {
        if (user) {
            if (item.owner === user.uid) {
                return item.receiver.photoURL
            }
            return item.receiver.photoURL
        }
    }

    const handleOnLongPress = () => {
        alert('longPress')
    }

    const handleOnPress = (phoneNumber: string) => {
        const docRef = doc(db, 'users', phoneNumber)
        getDoc(docRef).then((doc) => {
            if (doc.exists()) {
                const data = doc.data()
                navigation.navigate('chatItem', {
                    chatId: item.id,
                    phoneNumber: phoneNumber,
                })
            }
        })
    }

    return (
        <TouchableOpacity
            onLongPress={handleOnLongPress}
            onPress={() => {
                handleOnPress(item?.owner === user?.uid ? item?.receiver.phoneNumber : item?.ownerPhoneNumber)
            }}
            style={{ marginBottom: 10, backgroundColor: 'white' }}>
            <Stack alignItems={'center'} right={2} justifyContent={'space-between'} direction={'row'}>
                <Stack
                    direction="row"
                    h={'16'}
                    alignItems='center'
                    space={10} >
                    <Avatar left={5} bg="green.500" source={{
                        uri: `${getDisplayPicture()}`
                    }} />
                    <Stack>
                        <Text
                            bold
                            fontSize={15}>
                            {getDisplayName()}
                        </Text>
                        {
                            item?.lastMessage?.text &&
                            item?.lastMessage?.text?.replace(/(\r\n|\n|\r)/gm, " ").length > 20 ?
                                <Text
                                    color={'gray.500'}>
                                    {item?.lastMessage?.text?.replace(/(\r\n|\n|\r)/gm, " ").substring(0, 20)}...
                                </Text>
                                :
                                <Text
                                    color={'gray.500'}>
                                    {item?.lastMessage?.text?.replace(/(\r\n|\n|\r)/gm, " ")}
                                </Text>
                        }

                    </Stack>

                </Stack>
                <Text color={'grey'}>{moment(item.lastMessage?.createdAt).format('HH:mm')}</Text>

            </Stack>

        </TouchableOpacity>
    )
}

export { ChatList }