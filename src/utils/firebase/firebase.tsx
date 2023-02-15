import { initializeApp } from '@firebase/app'
import {
    ApplicationVerifier,
    ConfirmationResult,
    User,
    getAuth,
    getIdToken,
    onAuthStateChanged,
    signInWithCustomToken,
    signInWithPhoneNumber,
    signOut,
    updatePhoneNumber,
    PhoneAuthProvider,
} from '@firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from '@firebase/firestore'
import axios from 'axios'
import { setValue } from 'lib'
import { phone as P } from 'phone'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { IUser } from 'utils'

const firebaseConfig = {
    apiKey: 'AIzaSyAtH-DtwY3A95-MFzrsQttMUSJw0Q7GCU0',
    authDomain: 'rekberindo-2e42c.firebaseapp.com',
    projectId: 'rekberindo-2e42c',
    storageBucket: 'rekberindo-2e42c.appspot.com',
    messagingSenderId: '1002742390465',
    appId: '1:1002742390465:web:0bf775e70165f9275dfe40',
    measurementId: 'G-P4J44N5DM3',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export const USER_KEY = 'user'

const formatUser = (user: IUser) => {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isIDCardVerified: user.isIDCardVerified,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        status: user.status,
    }
}

const firebaseApp = () => {
    const [user, setUser] = useState<IUser | null>(null)
    const [phone, setPhone] = useState('')
    const [isLoading, setIsloading] = useState(true)
    const [verificationCode, setVerificationCode] = useState(0)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    const [currentRoute, setCurrentRoute] = useState('')

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setIsloading(true)
            if (user) {
                const userRef = query(collection(db, 'users'), where('phoneNumber', '==', user.phoneNumber))
                onSnapshot(userRef, (docs) => {
                    if (docs.empty) {
                        setUser(null)
                        setIsloading(false)
                    } else {
                        docs.forEach(docData => {
                            if (docData.exists()) {
                                const data = docData.data()
                                const formattedUser = formatUser(data as IUser)
                                setUser(formattedUser)
                                setIsloading(false)
                            } else {
                                setUser(null)
                                setIsloading(false)
                            }
                        })
                    }
                }, (error) => {
                    setUser(null)
                    setIsloading(false)
                })
            } else {
                setIsloading(false)
                setUser(null)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])


    const reloadUser = async () => {
        const docRef = query(collection(db, 'users'), where('uid', '==', user?.uid))
        const data = await getDocs(docRef)
        if (data.empty) {
            return
        } else {
            data.forEach(doc => {
                if (doc.exists()) {
                    const formattedUser = formatUser(doc.data() as IUser)
                    setUser(formattedUser)
                }
            })
        }
    }

    const assignUser = async (user: User) => {

        return new Promise<void>((resolve, reject) => {
            const reference = query(collection(db, 'users'), where('phoneNumber', '==', user.phoneNumber))
            getDocs(reference).then((docs) => {
                if (docs.empty) {
                    const docRef = doc(collection(db, 'users'))
                    setDoc(docRef, {
                        phoneNumber: user.phoneNumber,
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        isIDCardVerified: false,
                        lastLogin: new Date().toLocaleDateString(),
                    }).then(() => {
                        getDoc(docRef).then(doc => {
                            const formattedUser = formatUser(doc.data() as IUser)
                            setUser(formattedUser)
                            resolve()
                        })
                    }).catch(error => {
                        reject(error)
                    })
                } else {
                    docs.forEach(docData => {
                        const docRef = docData.ref
                        updateDoc(docRef, {
                            lastLogin: new Date().toLocaleDateString(),
                        }).then(() => {
                            getDoc(docRef).then(doc => {
                                const formattedUser = formatUser(doc.data() as IUser)
                                setUser(formattedUser)
                                resolve()
                            })
                        }).catch(error => {
                            reject(error)
                        })
                    })
                }
            })
        })
    }

    const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => {
        setPhone(phoneNumber)
        const signin = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        setConfirmationResult(signin)
    }

    const signInWithWhatsApp = async (phoneNumber: string) => {
        setPhone(phoneNumber)
        // send message to whatsapp
        return new Promise<void>((resolve, reject) => {
            const phoneNum = P(phoneNumber, {
                country: 'ID',
            })
            const code = Math.floor(100000 + Math.random() * 900000)
            axios.post(
                `${process.env.FB_BASE_URL}/${process.env.PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: phoneNum.phoneNumber?.replace('+', ''),
                    type: 'template',
                    template: {
                        language: {
                            code: 'id',
                        },
                        name: 'verifikasi',
                        components: [
                            {
                                type: 'body',
                                parameters: [
                                    {
                                        type: 'text',
                                        text: code,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.FB_TOKEN}`,
                    },
                }
            ).then((res) => {
                if (res.status === 200) {
                    setVerificationCode(code)
                    resolve()
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }

    const verifyCode = async (code: string, provider: 'phone' | 'whatsapp') => {
        if (provider === 'phone') {
            if (confirmationResult) {
                return new Promise<void>((resolve, reject) => {
                    confirmationResult
                        .confirm(code)
                        .then(async result => {
                            await assignUser(result.user)
                            axios.post(`${process.env.SERVER_URL}api/v1/claims`, {
                                token: await getIdToken(result.user),
                                phoneNumber: phone,
                            })
                                .then(async res => {
                                    if (res.status === 200) {
                                        await getIdToken(result.user, true)
                                        await assignUser(result.user)
                                        resolve(res.data)
                                    }
                                })
                        })
                        .catch(error => {
                            reject(error)
                        })
                })
            }
        } else if (provider === 'whatsapp') {
            if (verificationCode === parseInt(code)) {
                new Promise<void>(async (resolve, reject): Promise<void> => {
                    const wa = await axios.post(`${process.env.SERVER_URL}/whatsapp`, {
                        phoneNumber: phone,
                    })
                    if (wa.status === 200) {

                        signInWithCustomToken(auth, wa.data.token).then(async result => {
                            assignUser(result.user)
                            axios
                                .post(`${process.env.SERVER_URL}/claims`, {
                                    token: await getIdToken(result.user),
                                    phoneNumber: phone,
                                })
                                .then(async res => {
                                    resolve(res.data)
                                    if (res.status === 200) {
                                        await getIdToken(result.user, true)
                                        assignUser(result.user)
                                        // setUser(formatUser(result.user))
                                    }
                                }).catch(err => {
                                    reject(err)
                                })
                        })
                    } else {
                        reject(wa)
                    }
                })
            }
        }
    }

    const signIn = async (token: string) => {
        return signInWithCustomToken(auth, token)
            .then(result => {
                assignUser(result.user)
                // setUser(formatUser(result.user))
            })
            .catch(error => {

            })
    }

    const logout = async () => {
        return new Promise<void>((resolve, reject) => {
            signOut(auth).then(() => {
                setUser(null)
                setValue(USER_KEY, null)
                const queryUser = query(collection(db, 'users'), where('uid', '==', user?.uid))
                getDocs(queryUser).then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        reject('User not found')
                    } else {
                        querySnapshot.forEach((doc) => {
                            updateDoc(doc.ref, {
                                lastLogin: new Date().toISOString(),
                            })
                        })
                        resolve()
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }

    const changeRoute = (route: string) => {
        setCurrentRoute(route)
    }

    const changePhoneNumber = async (phoneNumber: string, code: string, recaptchaVerifier: ApplicationVerifier) => {
        return new Promise<void>((resolve, reject) => {
            new PhoneAuthProvider(auth).verifyPhoneNumber(phoneNumber, recaptchaVerifier).then((confirmationResult) => {
                const phoneCredential = PhoneAuthProvider.credential(confirmationResult, code)
                const currentUser = getAuth().currentUser
                if (currentUser) {
                    updatePhoneNumber(currentUser, phoneCredential).then(() => {
                        const queryUser = query(collection(db, 'users'), where('uid', '==', user?.uid))
                        getDocs(queryUser).then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                updateDoc(doc.ref, {
                                    phoneNumber: phoneNumber,
                                }).then(() => {
                                    reloadUser()
                                })
                            })
                        })
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                }
            }).catch(err => {
                reject(err)
            })
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
        phone,
        isLoading,
        reloadUser,
        currentRoute,
        changeRoute,
        changePhoneNumber,
    }
}

const FirebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _recaptchaVerifier: ApplicationVerifier) => { },
    logout: async () => { },
    user: null as IUser | null,
    signInWithWhatsApp: async (_phoneNumber: string) => { },
    verifyCode: async (_code: string, _provider: 'phone' | 'whatsapp'): Promise<void> => { },
    signIn: async (_token: string) => { },
    phone: null as string | null,
    isLoading: true,
    reloadUser: async () => { },
    currentRoute: "",
    changeRoute: (_route: string) => { },
    changePhoneNumber: async (_phoneNumber: string, _code: string, _recaptchaVerifier: ApplicationVerifier) => { },
})

const FirebaseProvider = (props: { children?: React.ReactNode }) => {
    return <FirebaseContext.Provider value={firebaseApp()}>{props.children}</FirebaseContext.Provider>
}

export const useFirebase = () => useContext(FirebaseContext)
export { db, auth, app, FirebaseProvider }
