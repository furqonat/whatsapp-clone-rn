import { initializeApp } from '@firebase/app'
import {
    ApplicationVerifier, ConfirmationResult, getAuth, getIdToken, signInWithCustomToken, signInWithPhoneNumber, signOut, User
} from '@firebase/auth'
import {
    doc, getDoc, getFirestore, setDoc,
    updateDoc
} from '@firebase/firestore'
import axios from 'axios'
import Constants from 'expo-constants'
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
        isIDCardVerified: user.isIDCardVerified,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber
    }
}

const firebaseApp = () => {
    const [user, setUser] = useState<IUser | null>(null)
    const [phone, setPhone] = useState('')
    const [verificationCode, setVerificationCode] = useState(0)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const dbRef = doc(db, 'users', `${user.phoneNumber}`)
                getDoc(dbRef).then((doc) => {
                    if (doc.exists()) {
                        const data = doc.data()
                        const formattedUser = formatUser(data as IUser)
                        setUser(formattedUser)
                    } else {
                        console.log("No such document!")
                        setUser(null)
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error)
                    setUser(null)
                })
            } else {
                setUser(null)
            }
        })

        return () => unsubscribe()
    }, [])

    const assignUser = async (user: User) => {
        const dbRef = getFirestore(app)
        const docRef = doc(dbRef, 'users', `${user.phoneNumber}`)
        const data = await getDoc(docRef)
        if (data.exists()) {
            updateDoc(docRef, {
                lastLogin: new Date().toLocaleDateString()
            }).then(() => {
                // nextPage && navigate(nextPage)
                getDoc(docRef).then((doc) => {
                    const formattedUser = formatUser(doc.data() as IUser)
                    setUser(formattedUser)
                })
            })
        } else {
            setDoc(doc(dbRef, 'users', user.phoneNumber!!), {
                phoneNumber: user.phoneNumber,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                emailVerified: user.emailVerified,
                isIDCardVerified: false,
                lastLogin: new Date().toLocaleDateString()
            }).then(() => {
                // nextPage && navigate(nextPage)
                getDoc(docRef).then((doc) => {
                    const formattedUser = formatUser(doc.data() as IUser)
                    setUser(formattedUser)
                })
            })
        }
    }

    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => {
        setPhone(phoneNumber)
        const signin = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(signin)
    }

    const signInWithWhatsApp = async (phoneNumber: string) => {
        setPhone(phoneNumber)
        // send message to whatsapp
        const code = Math.floor(100000 + Math.random() * 900000)
        const sendMessage = await axios.post(`${Constants.FB_BASE_URL}/${Constants.PHONE_NUMBER_ID}/messages`, {
            messaging_product: 'whatsapp',
            to: phoneNumber.replace('+', ''),
            type: 'template',
            template: {
                language: {
                    code: "id"
                },
                name: 'verifikasi',
                components: [
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: code
                            }
                        ]
                    }
                ]
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Constants.FB_TOKEN}`
            }
        })
        if (sendMessage.status === 200) {
            setVerificationCode(code)
        }
    }

    const verifyCode = async (code: string, provider: "phone" | "whatsapp") => {
        if (provider === "phone") {
            if (confirmationResult) {
                confirmationResult.confirm(code)
                    .then(async result => {
                        assignUser(result.user)
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/claims`, {
                            token: await getIdToken(result.user),
                            phoneNumber: phone
                        }).then(async res => {
                            if (res.status === 200) {
                                console.log(res)
                                await getIdToken(result.user, true)
                                setUser(formatUser(result.user))
                            }
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        } else if (provider === "whatsapp") {
            if (verificationCode === parseInt(code)) {
                const wa = await axios.post(`${Constants.SERVER_URL}/whatsapp`, {
                    phoneNumber: phone
                })
                if (wa.status === 200) {
                    signInWithCustomToken(auth, wa.data.token).then(async result => {
                        assignUser(result.user)
                        axios.post(`${Constants.SERVER_URL}/claims`, {
                            token: await getIdToken(result.user),
                            phoneNumber: phone
                        }).then(async res => {
                            if (res.status === 200) {
                                await getIdToken(result.user, true)
                                setUser(formatUser(result.user))
                            }
                        })
                    })
                }
            }
        }
    }

    const signIn = async (token: string) => {
        return signInWithCustomToken(auth, token)
            .then((result) => {
                setUser(formatUser(result.user))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const logout = async () => {
        const dbRef = doc(db, 'users', user?.phoneNumber!!)
        return updateDoc(dbRef, {
            status: new Date().toISOString()
        }).then(() => {
            signOut(auth)
        })
    }

    return {
        confirmationResult,
        signInWithPhone,
        logout,
        user,
        signInWithWhatsApp,
        verifyCode,
        signIn,
        phone
    }
}

const FirebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _recaptchaVerifier: ApplicationVerifier) => { },
    logout: async () => { },
    user: null as IUser | null,
    signInWithWhatsApp: async (_phoneNumber: string) => { },
    verifyCode: async (_code: string, _provider: "phone" | "whatsapp") => { },
    signIn: async (_token: string) => { },
    phone: null as string | null
})

const FirebaseProvider = (props: { children?: React.ReactNode }) => {

    return (
        <FirebaseContext.Provider value={firebaseApp()} >
            {props.children}
        </FirebaseContext.Provider>
    )
}

export const useFirebase = () => useContext(FirebaseContext)
export { db, auth, app, FirebaseProvider }

