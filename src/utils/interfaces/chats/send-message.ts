import firestore from '@react-native-firebase/firestore'
import { IChatItem, IUser } from 'utils'

const sendMessage = (props: {
    receiver: IChatItem
    user: IUser
    id: string
    message: string
    type?: string
    lastMessageType?: string
}): boolean => {
    firestore()
        .collection('chats')
        .doc(props.id)
        .set(
            {
                id: props.id,
                visibility: {
                    [props.user.uid]: true,
                    [props.receiver.uid]: true,
                },
                users: [props.receiver.uid, props.user.uid],
                receiver: {
                    uid: props.receiver.uid,
                    displayName: props.receiver.displayName,
                    photoURL: props.receiver.photoURL,
                    phoneNumber: props.receiver.phoneNumber,
                },
                owner: props.user.uid,
                ownerPhoneNumber: props.user.phoneNumber,
                ownerDisplayName: props.user.displayName,
            },
            { merge: true }
        )
        .then(() => {
            firestore()
                .collection('chats')
                .doc(props.id)
                .collection('messages')
                .add({
                    time: new Date().toLocaleTimeString(),
                    type: props.type,
                    read: false,
                    message: {
                        text: props.message,
                        createdAt: new Date().toISOString(),
                    },
                    sender: {
                        uid: props.user.uid,
                        displayName: props.user.displayName,
                        phoneNumber: props.user.phoneNumber,
                    },
                    receiver: {
                        uid: props.receiver.uid,
                        displayName: props.receiver.displayName,
                        phoneNumber: props.receiver.phoneNumber,
                    },
                    visibility: {
                        [props.user.uid]: true,
                        [props.receiver.uid]: true,
                    },
                })
                .then(() => {
                    firestore()
                        .collection('chats')
                        .doc(props.id)
                        .update({
                            lastMessage: {
                                text: props.lastMessageType,
                                createdAt: new Date().toISOString(),
                            },
                        })
                        .then(() => {
                            return true
                        })
                })
                .catch(() => {
                    return false
                })
        })
    return false
}

export { sendMessage }
