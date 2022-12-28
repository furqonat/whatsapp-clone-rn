import { useAvatar } from "hooks"
import { VStack, HStack, Image, Text, Pressable } from "native-base"
import { IContact } from "utils"

const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

const ContactList = (props: { item: IContact, onPress?: (item: IContact) => void }) => {
    const { avatar } = useAvatar({
        phoneNumber: props.item.phoneNumber
    })
    return (
        <Pressable
            onPress={() => {
                props.onPress && props.onPress(props.item)
            }}>
            <VStack>
                <HStack
                    space={4}>
                    <Image
                        width={50}
                        height={50}
                        rounded={'full'}
                        alt='avatar contact'
                        src={avatar?.length > 10 ? avatar : `https://ui-avatars.com/api/?name=Rekberin`} />
                    <VStack>
                        <Text fontSize={'xl'}>
                            {props.item.displayName}
                        </Text>
                        <Text>
                            {props.item.phoneNumber}
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        </Pressable>
    )
}

export { ContactList }