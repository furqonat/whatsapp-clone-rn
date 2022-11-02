import { initializeApp } from '@firebase/app'
import { ApplicationVerifier, ConfirmationResult, getAuth, signInWithPhoneNumber } from '@firebase/auth'
import { getFirestore } from '@firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { IUser } from 'utils'


const firebaseConfig = {
    apiKey: "AIzaSyAtH-DtwY3A95-MFzrsQttMUSJw0Q7GCU0",
    authDomain: "rekberindo-2e42c.firebaseapp.com",
    projectId: "rekberindo-2e42c",
    storageBucket: "rekberindo-2e42c.appspot.com",
    messagingSenderId: "1002742390465",
    appId: "1:1002742390465:web:0bf775e70165f9275dfe40",
    measurementId: "G-P4J44N5DM3"
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

    const signInWithPhone = async (phoneNumber: string, capthcha: ApplicationVerifier) => {
        console.log(phoneNumber, 'firebase context')
        return signInWithPhoneNumber(auth, phoneNumber, capthcha).then((confirmation) => {
            setConfirmationResult(confirmation)
        }).catch((error) => {
            console.log(error)
        })
    }


    return {
        user,
        confirmationResult,
        signInWithPhone,
    }
}

const firebaseContext = createContext({
    user: null as IUser | null,
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _capthcha: ApplicationVerifier) => { },
})

const FirebaseProvider = (props: { children?: React.ReactNode }) => {

    return (
        <firebaseContext.Provider value={firebaseApp()} >
            {props.children}
        </firebaseContext.Provider>
    )
}

export const useFirebase = () => useContext(firebaseContext)
export { db, auth, app, FirebaseProvider }
