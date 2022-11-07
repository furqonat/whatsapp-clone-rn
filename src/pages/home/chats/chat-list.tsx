import { Avatar, ScrollView, Stack, Text } from "native-base"
import { TouchableOpacity } from "react-native"
import { IChatList, useFirebase } from "utils"

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
    const getDisplayName = () => {
        if (user) {
            if (item.owner === user.uid) {
                return item.receiver.phoneNumber
            }
            return item.ownerPhoneNumber
        }
    }
    return (
        <TouchableOpacity>
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