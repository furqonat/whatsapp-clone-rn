import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from 'utils'

const useStatus = (props: { phoneNumber: string }) => {
    const [status, setStatus] = useState('')

    useEffect(() => {
        const dbRef = doc(db, 'users', props.phoneNumber)
        const unsubscribe = onSnapshot(dbRef, (doc) => {
            setStatus(doc.data()?.status)
        })
        return unsubscribe
    }, [props.phoneNumber])

    return (
        status
    )
}

export { useStatus }