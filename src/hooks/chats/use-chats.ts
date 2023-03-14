import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'
import { IChatList, IChatMessage, IUser } from 'utils'

const useChats = (props: { id?: string | null; user?: IUser | null }) => {
    const [chatList, setChatList] = useState<IChatList[]>([])
    const [messages, setMessages] = useState<IChatMessage[]>([])

    useEffect(() => {
        if (props?.user) {
            const unsubscribe = firestore()
                .collection('chats')
                .orderBy('lastMessage.createdAt', 'desc')
                .onSnapshot(querySnapshot => {
                    const values: any = []
                    querySnapshot.forEach(doc => {
                        const data = doc.data()
                        if (data.users.includes(props?.user?.uid)) {
                            values.push(data)
                        }
                    })
                    //if (values) {
                    //    setChatList(
                    //        values.sort((a: any, b: any) => {
                    //            console.log(typeof b?.lastMessage?.createdAt)
                    //            if (typeof b?.lastMessage !== 'undefined') {
                    //                return (
                    //                    new Date(b.lastMessage.createdAt).getTime() -
                    //                    new Date(a.lastMessage.createdAt).getTime()
                    //                )
                    //            } else {
                    //                return 0
                    //            }
                    //        })
                    //    )
                    //} else {
                    //    setChatList(values)
                    //}
                    setChatList(values)
                })
            return () => unsubscribe
        } else {
            return () => { }
        }
    }, [props.user?.uid, props?.user])

    useEffect(() => {
        if (props?.id && props?.user) {
            const unsubscribe = firestore()
                .collection('chats')
                .doc(props?.id)
                .collection('messages')
                .orderBy('message.createdAt', 'desc')
                .onSnapshot(querySnapshot => {
                    querySnapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            // play sound when new message is added and user is not in chat screen
                            if (props?.user?.uid !== change.doc.data().sender.uid) {
                                // const audio = new Audio(newChatSound)
                                // audio.play()
                            }
                            // play sound if message is not from current user and read status is false and message is less than 5 second old
                            // if (change.doc.data().sender.uid !== props.user.uid && !change.doc.data().read && new Date().getTime() - new Date(change.doc.data().time).getTime() < 5000) {
                            //     new Audio(newChatSound).play()
                            // }
                        }
                        if (change.type === 'modified') {
                            // if message visitiblity for sender and receiver is false then delete message
                            if (
                                !change.doc.data().visibility[change.doc.data().receiver.uid] &&
                                !change.doc.data().visibility[change.doc.data().sender.uid]
                            ) {
                                // change.doc.ref.delete()
                                change.doc.ref.delete().then(() => {
                                    console.log('Document successfully deleted!')
                                })
                            }
                        }
                    })
                    const data = querySnapshot.docs
                        .map(doc => [{ id: doc.id, ...doc.data() }])
                        .map((item: any) => item[0])

                    if (data) {
                        const orderedData = data?.sort((a: any, b: any) => {
                            return new Date(b.message?.createdAt).getTime() - new Date(a.message?.createdAt).getTime()
                        })
                        setMessages(orderedData as IChatMessage[])
                    } else {
                        setMessages(data as IChatMessage[])
                    }
                })
            return () => unsubscribe
        } else {
            return () => { }
        }
    }, [props?.id, props.user?.uid])

    return { chatList, messages }
}

export { useChats }
