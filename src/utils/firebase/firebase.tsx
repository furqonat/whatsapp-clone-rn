import { initializeApp } from 'firebase/app'
import { ApplicationVerifier, ConfirmationResult, getAuth, signInWithPhoneNumber } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { IUser } from 'utils'


const firebaseConfig = {
    // TODO: firebase config
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const formatUser = (user: IUser) => {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    }
}

const firebaseApp = () => {
    const [user, setUser] = useState<IUser | null>(null)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const formattedUser = formatUser(user)
                setUser(formattedUser)
            } else {
                setUser(null)
            }
        })

        return () => unsubscribe()
    }, [])

    const sigInWithPhone = async (phoneNumber: string, capthcha: ApplicationVerifier) => {
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, capthcha)
        setConfirmationResult(confirmation)
    }


    return {
        user,
        confirmationResult,
        sigInWithPhone,
    }
}

const firebaseContext = createContext({
    user: null as IUser | null,
    confirmationResult: null as ConfirmationResult | null,
    sigInWithPhone: async (_phoneNumber: string, _capthcha: ApplicationVerifier) => { },
})

const FirebaseProvider = (props: { children?: React.ReactNode }) => {

    return (
        <firebaseContext.Provider value={firebaseApp()} >
            {props.children}
        </firebaseContext.Provider>
    )
}

export const useFirebase = () => useContext(firebaseContext)
export { db, auth, FirebaseProvider }