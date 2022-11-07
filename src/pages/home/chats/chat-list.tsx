import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Avatar, ScrollView, Stack, Text } from "native-base"
import { RootStackParamList } from "pages/screens";
import { TouchableOpacity } from "react-native"
import { IChatItem, IChatList, useFirebase } from "utils"

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
                return item.receiver.phoneNumber
            }
            return item.ownerPhoneNumber
        }
    }
   
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('chatItem', {
                    chatId: item.id,
                })
            }}>
            <Stack
                p={5}
                space={3}
                justifyItems={'center'}
                direction={'row'}>
                <Avatar
                    size={'sm'}
                />
                <Stack
                    space={1}
                    direction={'column'}>
                    <Text>{getDisplayName()}</Text>
                    <Text>{item?.lastMessage?.text}</Text>
                </Stack>
            </Stack>
        </TouchableOpacity>
    )
}

export { ChatList }