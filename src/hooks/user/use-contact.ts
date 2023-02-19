import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'
import { IContact, IUser } from 'utils'

const useContact = (props: { contactId?: string | null; user?: IUser | null }) => {
    const [contact, setContact] = useState<IContact | null>(null)

    useEffect(() => {
        if (props?.contactId && props?.user && props?.user?.phoneNumber) {
            /*const queryRef = query(collection(db, 'users'), where('phoneNumber', '==', props.user.phoneNumber))
            const unsubscribe = onSnapshot(queryRef, snapshot => {
                if (snapshot.empty) {
                    setContact(null)
                } else {
                    snapshot.forEach(docData => {
                        const docRef = doc(db, 'users', docData.id, 'contacts', `${props.contactId}`)
                        onSnapshot(docRef, docSnapshot => {
                            if (docSnapshot.exists()) {
                                setContact(docSnapshot.data() as IContact)
                            } else {
                                setContact(null)
                            }
                        })
                    })
                }
            })
            return () => unsubscribe()*/
            const unsubscribe = firestore()
                .collection('users')
                .where('phoneNumber', '==', props.user.phoneNumber)
                .onSnapshot(snapshot => {
                    if (snapshot.empty) {
                        setContact(null)
                    } else {
                        snapshot.forEach(docData => {
                            const docRef = firestore().doc(`users/${docData.id}/contacts/${props.contactId}`)
                            docRef.onSnapshot(docSnapshot => {
                                if (docSnapshot.exists) {
                                    setContact(docSnapshot.data() as IContact)
                                } else {
                                    setContact(null)
                                }
                            })
                        })
                    }
                })
            return () => unsubscribe()
        }
        return () => {}
    }, [props?.contactId, props?.user, props?.user?.phoneNumber])

    const saveContact = async (contact: IContact) => {
        return new Promise(async (resolve, reject) => {
            if (props?.user && props?.user?.phoneNumber) {
                // const queryRef = query(collection(db, 'users'), where('phoneNumber', '==', props.user.phoneNumber))
                // getDocs(queryRef).then(querySnapshot => {
                //     if (querySnapshot.empty) {
                //         reject('User not found')
                //     } else {
                //         querySnapshot.forEach(docData => {
                //             const docRef = doc(db, 'users', docData.id, 'contacts', contact.uid)
                //             setDoc(docRef, contact, { merge: true }).then(() => {
                //                 resolve('success')
                //             })
                //         })
                //     }
                // })
                // const docRef = doc(db, 'users', props?.user.phoneNumber, 'contacts', contact.uid)
                // return setDoc(docRef, contact, { merge: true }).then(() => {
                //     resolve('success')
                // })
                firestore()
                    .collection('users')
                    .where('phoneNumber', '==', props.user.phoneNumber)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            reject(new Error('User not found'))
                        } else {
                            querySnapshot.forEach(docData => {
                                const docRef = firestore().doc(`users/${docData.id}/contacts/${contact.uid}`)
                                docRef.set(contact, { merge: true }).then(() => {
                                    resolve('success')
                                })
                            })
                        }
                    })
            } else {
                return reject(new Error('User not logged in'))
            }
        })
    }

    return {
        contact,
        saveContact,
    }
}

const useContacts = (props: { user?: IUser | null }) => {
    const [contacts, setContacts] = useState<IContact[]>([])

    useEffect(() => {
        if (props?.user && props?.user?.phoneNumber) {
            /*const collectionRef = query(collection(db, 'users'), where('phoneNumber', '==', props.user.phoneNumber))
            const unsubscribe = onSnapshot(collectionRef, querySnapshot => {
                if (querySnapshot.empty) {
                    setContacts([])
                } else {
                    querySnapshot.forEach(docData => {
                        const docRef = collection(db, 'users', docData.id, 'contacts')
                        onSnapshot(docRef, docSnapshot => {
                            const contactList: IContact[] = []
                            docSnapshot.forEach(contactDoc => {
                                contactList.push(contactDoc.data() as IContact)
                            })
                            setContacts(contactList)
                        })
                    })
                }
            })
            return () => unsubscribe()*/
            const unsubscribe = firestore()
                .collection('users')
                .where('phoneNumber', '==', props.user.phoneNumber)
                .onSnapshot(querySnapshot => {
                    if (querySnapshot.empty) {
                        setContacts([])
                    } else {
                        querySnapshot.forEach(docData => {
                            const docRef = firestore().collection(`users/${docData.id}/contacts`)
                            docRef.onSnapshot(docSnapshot => {
                                const contactList: IContact[] = []
                                docSnapshot.forEach(contactDoc => {
                                    contactList.push(contactDoc.data() as IContact)
                                })
                                setContacts(contactList)
                            })
                        })
                    }
                })
            return () => unsubscribe()
        } else {
            return () => {}
        }
    }, [props.user?.phoneNumber])

    return {
        contacts,
    }
}
export { useContact, useContacts }
