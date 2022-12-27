import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { doc, getDoc } from 'firebase/firestore'
import { useAvatar, useContact } from 'hooks'
import moment from 'moment'
import { FlatList, Modal } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { IChatList, db, useFirebase } from 'utils'

type ChatItem = StackNavigationProp<RootStackParamList>

const ChatList = (props: { chatsList?: IChatList[] | null }) => {
    return (
        <FlatList
            data={props?.chatsList}
            renderItem={(item) => (
                <ChatListItem
                    key={item.index}
                    item={item.item} />
            )} />
    )
}

const ChatListItem = (props: { item: IChatList }) => {
    const { item } = props
    const { user } = useFirebase()

    const { avatar } = useAvatar({
        phoneNumber: user?.uid === item.owner ? item.receiver?.phoneNumber : item.ownerPhoneNumber,
    })

    const { contact } = useContact({
        contactId: user?.uid === item.owner ? item.receiver?.uid : item.owner,
        user: user
    })

    const navigation = useNavigation<ChatItem>()
    
    const getDisplayName = () => {
        if (contact) {
            return contact?.displayName
        }
        if (user) {
            if (item.owner === user.uid) {
                return item.receiver.phoneNumber
            }
            return item.ownerPhoneNumber
        }
    }

    const handleOnLongPress = () => {
        alert('longPress')
    }

    const handleOnPress = (phoneNumber: string) => {
        const docRef = doc(db, 'users', phoneNumber)
        getDoc(docRef).then(doc => {
            if (doc.exists()) {
                navigation.navigate('chatItem', {
                    chatId: item.id,
                    phoneNumber: phoneNumber,
                })
            }
        })
    }
    const [showModal, setShowModal] = useState(false);

    return (
        <TouchableOpacity
            onLongPress={handleOnLongPress}
            onPress={() => {
                handleOnPress(item?.owner === user?.uid ? item?.receiver.phoneNumber : item?.ownerPhoneNumber)
            }}
            style={{ marginBottom: 10, backgroundColor: 'white' }}>
            <View
                style={{
                    alignItems: 'center',
                    right: 2,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: 20
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 20,
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 100,
                                marginRight: 10
                            }}

                            source={{ uri: avatar ? avatar : undefined }}
                        />
                    </TouchableOpacity>

                    <View>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 15,
                            }}>
                            {getDisplayName()}
                        </Text>
                        {
                            item?.lastMessage?.text &&
                                item?.lastMessage?.text?.replace(/(\r\n|\n|\r)/gm, ' ').length > 20 ? (
                                <Text style={{ color: 'amber' }}>
                                    {
                                        item?.lastMessage?.text?.replace(/(\r\n|\n|\r)/gm, ' ').substring(0, 20)
                                    }...
                                </Text>
                            ) : (
                                <Text style={{ color: 'orange' }}>{item?.lastMessage?.text?.replace(/(\r\n|\n|\r)/gm, ' ')}</Text>
                            )
                        }
                    </View>
                </View>
                <Text style={{ color: 'grey' }}>{moment(item.lastMessage?.createdAt).format('HH:mm')}</Text>
            </View>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
                _dark: {
                    bg: "white"
                },
                bg: "gray.700"
            }}>

                <Image
                    style={{
                        height: 250,
                        width: 250
                    }}
                    source={{ uri: avatar ? avatar : undefined }}

                />

            </Modal>
        </TouchableOpacity>
    )
}

export { ChatList }

