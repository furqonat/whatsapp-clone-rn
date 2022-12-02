import { useAvatar } from "hooks"
import { VStack, HStack, Image, Text } from "native-base"
import { IContact } from "utils"

const ContactList = (props: { item: IContact, onPress?: () => void }) => {
    const { avatar } = useAvatar({
        phoneNumber: props.item.phoneNumber
    })
    return (
        <VStack
            >
            <HStack
                space={4}>
                <Image
                    width={50}
                    height={50}
                    rounded={'full'}
                    alt='avatar contact'
                    src={avatar} />
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
    )
}

export { ContactList }