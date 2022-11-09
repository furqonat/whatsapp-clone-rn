import { doc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"
import { db } from "utils/firebase"
import { IUser } from "../user"
import { IChatItem } from "./chats"

const sendMessage = (props: {
    receiver: IChatItem,
    user: IUser,
    id: string,
    message: string,
    type?: string,
    lastMessageType?: string
}): boolean => {

    const {
        type = "text",
        lastMessageType = "text",
    } = props
    const docRef = doc(db, 'chats', props.id)
    setDoc(docRef, {
        id: props.id,
        visibility: {
            [props.user.uid]: true,
            [props.receiver.uid]: true
        },
        users: [props.receiver.uid, props.user.uid],
        receiver: {
            uid: props.receiver.uid,
            displayName: props.receiver.displayName,
            photoURL: props.receiver.photoURL,
            phoneNumber: props.receiver.phoneNumber
        },
        owner: props.user.uid,
        ownerPhoneNumber: props.user.phoneNumber,
        ownerDisplayName: props.user.displayName,
    }, { merge: true }).then(() => {
        const collectionRef = collection(db, 'chats', props.id, 'messages')
        addDoc(collectionRef, {
            time: new Date().toLocaleTimeString(),
            type: type, // TODO: type accept text, image, audio file
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
            }
        }).then(() => {
            updateDoc(docRef, {
                lastMessage: {
                    text: props.message, // TODO: add last message type like image, video, audio, etc
                    createdAt: new Date().toISOString(),
                },
            }).then(() => {
                return true
            })
        })

    }).catch((error) => {
        return false
    })
    return false
}


export { sendMessage }