import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from 'utils'

const useStatus = (props: { phoneNumber?: string | null }) => {
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        if (props?.phoneNumber) {
            const dbRef = doc(db, 'users', props.phoneNumber)
            const unsubscribe = onSnapshot(dbRef, doc => {
                if (doc.exists()) {
                    setStatus(doc.data()?.status)
                } else {
                    setStatus(null)
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
