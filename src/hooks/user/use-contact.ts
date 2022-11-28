import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db, IContact, IUser } from 'utils'

const useContact = (props: { contactId?: string | null, user?: IUser | null }) => {
    const [contact, setContact] = useState<IContact | null>(null)


    useEffect(() => {
        if (props?.contactId && props?.user && props?.user?.phoneNumber) {
            const docRef = doc(db, 'users', props?.user.phoneNumber, 'contacts', props.contactId)
            const unsubscribe = onSnapshot(docRef, snapshot => {
                if (snapshot.exists()) {
                    setContact(snapshot.data() as IContact)
                } else {
                    setContact(null)
                }
            })
            return () => unsubscribe()
        }
        return () => {}
    }, [props?.contactId, props?.user, props?.user?.phoneNumber])

    const saveContact = async (contact: IContact) => {
        return new Promise(async (resolve, reject) => {
            if (props?.user && props?.user?.phoneNumber) {
                const docRef = doc(db, 'users', props?.user.phoneNumber, 'contacts', contact.uid)
                return setDoc(docRef, contact, { merge: true }).then(() => {
                    resolve('success')
                })
            } else {
                return reject('User not logged in')
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
            const collectionRef = collection(db, 'users', props.user.phoneNumber, 'contacts')
            const unsubscribe = onSnapshot(collectionRef, snapshot => {
                const contactList: IContact[] = []
                snapshot.forEach(doc => {
                    contactList.push(doc.data() as IContact)
                })
                setContacts(contactList)
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

