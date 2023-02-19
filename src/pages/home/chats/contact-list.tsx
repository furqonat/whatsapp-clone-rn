import { useAvatar } from 'hooks'
import { HStack, Image, Pressable, Text, VStack } from 'native-base'
import { IContact } from 'utils'

const ContactList = (props: { item: IContact; onPress?: (item: IContact) => void }) => {
    const { avatar } = useAvatar({
        uid: props.item.phoneNumber,
    })
    return (
        <Pressable
            onPress={() => {
                props.onPress && props.onPress(props.item)
            }}>
            <VStack>
                <HStack space={4}>
                    <Image
                        width={50}
                        height={50}
                        rounded={'full'}
                        alt='avatar contact'
                        src={avatar?.length > 10 ? avatar : `https://ui-avatars.com/api/?name=Rekberin`}
                    />
                    <VStack>
                        <Text fontSize={'xl'}>{props.item.displayName}</Text>
                        <Text>{props.item.phoneNumber}</Text>
                    </VStack>
                </HStack>
            </VStack>
        </Pressable>
    )
}

export { ContactList }
