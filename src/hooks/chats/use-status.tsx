import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from 'utils'

const useStatus = (props: { phoneNumber?: string | null }) => {
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        if (props?.phoneNumber) {
            const queryUser = query(collection(db, 'users'), where('phoneNumber', '==', `${props.phoneNumber}`))
            const unsubscribe = onSnapshot(queryUser, doc => {
                if (doc.empty) {
                    setStatus('not found')
                } else {
                    doc.forEach((doc) => {
                        setStatus(doc.data().status)
                    })
                }
            })
            return unsubscribe
        } else {
            return () => {}
        }
    }, [props?.phoneNumber])

    return {
        status,
    }
}

export { useStatus }
