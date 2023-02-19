import firestore from '@react-native-firebase/firestore'
import { useState, useEffect } from 'react'
import { IUser } from 'utils'

const useUserInfo = (props: { uid?: string }) => {
    const { uid } = props
    const [userInfo, setUserInfo] = useState<IUser | null>(null)

    useEffect(() => {
        if (uid) {
            // const docRef = query(collection(db, 'users'), where('uid', '==', uid))
            // const unsubscribe = onSnapshot(docRef, querySnapshot => {
            //     if (querySnapshot.empty) {
            //         setUserInfo(null)
            //     } else {
            //         querySnapshot.forEach(doc => {
            //             setUserInfo(doc.data() as IUser)
            //         })
            //     }
            // })
            // return () => unsubscribe
            const unsubscribe = firestore()
                .collection('users')
                .where('uid', '==', uid)
                .onSnapshot(querySnapshot => {
                    if (querySnapshot.empty) {
                        setUserInfo(null)
                    } else {
                        querySnapshot.forEach(doc => {
                            setUserInfo(doc.data() as IUser)
                        })
                    }
                })
            return () => unsubscribe
        } else {
            return () => {}
        }
    }, [uid])

    return { userInfo }
}

export { useUserInfo }
