import firestore from '@react-native-firebase/firestore'
import { useEffect, useState } from 'react'

const useStatus = (props: { phoneNumber?: string | null }) => {
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        if (props?.phoneNumber) {
            /*const queryUser = query(collection(db, 'users'), where('phoneNumber', '==', `${props.phoneNumber}`))
            const unsubscribe = onSnapshot(queryUser, doc => {
                if (doc.empty) {
                    setStatus('not found')
                } else {
                    doc.forEach((doc) => {
                        setStatus(doc.data().status)
                    })
                }
            })
            return unsubscribe*/
            return firestore()
                .collection('users')
                .where('phoneNumber', '==', `${props.phoneNumber}`)
                .onSnapshot(querySnapshot => {
                    if (querySnapshot.empty) {
                        setStatus('not found')
                    } else {
                        querySnapshot.forEach(doc => {
                            setStatus(doc.data().status)
                        })
                    }
                })
        } else {
            return () => {}
        }
    }, [props?.phoneNumber])

    return {
        status,
    }
}

export { useStatus }
