import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { phone as P } from 'phone'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { IUser } from 'utils'

type ConfirmationResult = FirebaseAuthTypes.ConfirmationResult
type User = FirebaseAuthTypes.User

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
    const [isLoading, setIsLoading] = useState(true)
    const [isLogout, setIsLogout] = useState(false)
    const [verificationCode, setVerificationCode] = useState(0)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    const [currentRoute, setCurrentRoute] = useState('')

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setIsLoading(true)
            if (user) {
                // const userRef = query(
                //     collection(db, 'users'),
                //     where('phoneNumber', '==', user.phoneNumber),
                // )
                firestore()
                    .collection('users')
                    .where('phoneNumber', '==', user.phoneNumber)
                    .onSnapshot(
                        docs => {
                            if (docs.empty) {
                                setUser(null)
                                setIsLoading(false)
                            } else {
                                docs.forEach(docData => {
                                    if (docData.exists) {
                                        const data = docData.data()
                                        const formattedUser = formatUser(data as IUser)
                                        setUser(formattedUser)
                                        setIsLoading(false)
                                    } else {
                                        setUser(null)
                                        setIsLoading(false)
                                    }
                                })
                            }
                        },
                        _error => {
                            setUser(null)
                            setIsLoading(false)
                        }
                    )
            } else {
                setIsLoading(false)
                setUser(null)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [isLogout])

    const reloadUser = async () => {
        // const docRef = query(
        //     collection(db, 'users'),
        //     where('uid', '==', user?.uid),
        // )
        firestore()
            .collection('users')
            .where('uid', '==', user?.uid)
            .get()
            .then(docs => {
                if (docs.empty) {
                    setUser(null)
                } else {
                    docs.forEach(docData => {
                        if (docData.exists) {
                            const data = docData.data()
                            const formattedUser = formatUser(data as IUser)
                            setUser(formattedUser)
                        } else {
                            setUser(null)
                        }
                    })
                }
            })
        // const data = await getDocs(docRef)
        // if (data.empty) {
        // } else {
        //     data.forEach(doc => {
        //         if (doc.exists()) {
        //             const formattedUser = formatUser(doc.data() as IUser)
        //             setUser(formattedUser)
        //         }
        //     })
        // }
    }

    const assignUser = async (user: User) => {
        return new Promise<void>((resolve, reject) => {
            firestore()
                .collection('users')
                .where('phoneNumber', '==', user.phoneNumber)
                .get()
                .then(docs => {
                    if (docs.empty) {
                        const docRef = firestore().collection('users').doc()
                        docRef
                            .set({
                                phoneNumber: user.phoneNumber,
                                uid: user.uid,
                                displayName: user.displayName,
                                photoURL: user.photoURL,
                                email: user.email,
                                emailVerified: user.emailVerified,
                                isIDCardVerified: false,
                                lastLogin: new Date().toLocaleDateString(),
                            })
                            .then(() => {
                                docRef.get().then(doc => {
                                    const formattedUser = formatUser(doc.data() as IUser)
                                    setUser(formattedUser)
                                    resolve()
                                })
                            })
                            .catch(error => {
                                reject(error)
                            })
                    } else {
                        docs.forEach(docData => {
                            const docRef = docData.ref
                            docRef
                                .update({
                                    lastLogin: new Date().toLocaleDateString(),
                                })
                                .then(() => {
                                    docRef.get().then(doc => {
                                        const formattedUser = formatUser(doc.data() as IUser)
                                        setUser(formattedUser)
                                        resolve()
                                    })
                                })
                                .catch(error => {
                                    reject(error)
                                })
                        })
                    }
                })
            /*getDocs(reference).then(docs => {
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
                    })
                        .then(() => {
                            getDoc(docRef).then(doc => {
                                const formattedUser = formatUser(
                                    doc.data() as IUser,
                                )
                                setUser(formattedUser)
                                resolve()
                            })
                        })
                        .catch(error => {
                            reject(error)
                        })
                } else {
                    docs.forEach(docData => {
                        const docRef = docData.ref
                        updateDoc(docRef, {
                            lastLogin: new Date().toLocaleDateString(),
                        })
                            .then(() => {
                                getDoc(docRef).then(doc => {
                                    const formattedUser = formatUser(
                                        doc.data() as IUser,
                                    )
                                    setUser(formattedUser)
                                    resolve()
                                })
                            })
                            .catch(error => {
                                reject(error)
                            })
                    })*/
            // }
            // })
        })
    }

    const signInWithPhone = async (phoneNumber: string, resend: boolean = false) => {
        setIsLogout(false)
        setPhone(phoneNumber)
        return new Promise<void>((resolve, reject) => {
            const phoneNum = P(phoneNumber, {
                country: 'ID',
            })
            if (phoneNumber === '0812345678911' || phoneNumber === '+62812345678911') {
                setVerificationCode(123456)
                resolve()
            } else {
                const code = Math.floor(100000 + Math.random() * 900000)
                axios
                    .post(`${process.env.ZENZIVA_SMS_URL}`, {
                        userkey: process.env.ZENZIVA_USERKEY,
                        passkey: process.env.ZENZIVA_PASSKEY,
                        to: phoneNum.phoneNumber?.replace('+', ''),
                        message: `Kode Rekberin : ${code} 
                    
                    https://www.facebook.com/rekberin.co.id

                    https://m.youtube.com/@rekberin_co_id/featured

                    https://instagram.com/rekberin.co.id?igshid=YmMyMTA2M2Y=

                    Jangan bagikan kode ini dengan orang lain`,
                    })
                    .then(res => {
                        if (res.data.status === '1') {
                            setVerificationCode(code)
                            resolve()
                        } else {
                            reject(res.data)
                        }
                    })
            }
        })
    }

    const signInWithWhatsApp = async (phoneNumber: string) => {
        setIsLogout(false)
        setPhone(phoneNumber)
        // send message to whatsapp
        return new Promise<void>((resolve, reject) => {
            if (phoneNumber === '0812345678911' || phoneNumber === '+62812345678911') {
                setVerificationCode(123456)
                resolve()
            } else {
                const phoneNum = P(phoneNumber, {
                    country: 'ID',
                })
                const code = Math.floor(100000 + Math.random() * 900000)
                axios
                    .post(`${process.env.ZENZIVA_WA_URL}`, {
                        userkey: process.env.ZENZIVA_USERKEY,
                        passkey: process.env.ZENZIVA_PASSKEY,
                        to: phoneNum.phoneNumber?.replace('+', ''),
                        message: `Kode Rekberin : ${code} 
                    
                    https://www.facebook.com/rekberin.co.id

                    https://m.youtube.com/@rekberin_co_id/featured

                    https://instagram.com/rekberin.co.id?igshid=YmMyMTA2M2Y=

                    Jangan bagikan kode ini dengan orang lain`,
                    })
                    .then(res => {
                        if (res.data.status === '1') {
                            setVerificationCode(code)
                            resolve()
                        } else {
                            reject(res.data.message)
                        }
                    })
            }
        })
    }

    const verifyCode = async (code: string, provider: 'phone' | 'whatsapp', forceResend: boolean = false) => {
        if (verificationCode === parseInt(code, 10)) {
            return new Promise<void>(async (resolve, reject): Promise<void> => {
                const wa = await axios.post(`${process.env.SERVER_URL}api/v1/whatsapp`, {
                    phoneNumber: phone,
                })
                if (wa.status === 200) {
                    auth()
                        .signInWithCustomToken(wa.data.token)
                        .then(async result => {
                            await assignUser(result.user)
                            axios
                                .post(`${process.env.SERVER_URL}api/v1/claims`, {
                                    token: await result.user?.getIdToken(),
                                    phoneNumber: phone,
                                })
                                .then(async res => {
                                    resolve(res.data)
                                    if (res.status === 200) {
                                        await result.user?.getIdToken(true)
                                        await assignUser(result.user)
                                        // setUser(formatUser(result.user))
                                    }
                                })
                                .catch(err => {
                                    reject(err)
                                })
                        })
                } else {
                    reject(wa)
                }
            })
        } else {
            return Promise.reject(new Error('Kode yang anda masukkan salah'))
        }
    }

    const signIn = async (token: string) => {
        return auth()
            .signInWithCustomToken(token)
            .then(result => {
                assignUser(result.user)
                // setUser(formatUser(result.user))
            })
            .catch(() => {})
    }

    const logout = async () => {
        setIsLogout(true)
        auth()
            .signOut()
            .then(() => {
                if (auth()?.currentUser) {
                    auth()
                        .currentUser?.delete()
                        .then(() => {
                            // console.log('User deleted!')
                        })
                }
                setUser(null)
                firestore()
                    .collection('users')
                    .where('phoneNumber', '==', user?.phoneNumber)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.empty) {
                            // reject(new Error('User not found'))
                        } else {
                            querySnapshot.forEach(doc => {
                                doc.ref.update({
                                    lastLogin: new Date().toISOString(),
                                    status: new Date().toISOString(),
                                })
                            })
                            // resolve()
                        }
                    })
            })
            .catch(() => {})
    }

    const getValue = async (key: string) => {
        return new Promise<string | null>((resolve, reject) => {
            SecureStore.getItemAsync(key)
                .then(value => {
                    resolve(value)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const setValue = async (key: string, value: any) => {
        return new Promise<void>((resolve, reject) => {
            SecureStore.setItemAsync(key, value)
                .then(() => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const changeRoute = (route: string) => {
        setCurrentRoute(route)
    }

    const changePhoneNumber = async (phoneNumber: string, code: string) => {
        return new Promise<void>((resolve, reject) => {
            auth()
                .verifyPhoneNumber(phoneNumber)
                .then(confirmationResult => {
                    const phoneCredential = auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code)
                    const currentUser = auth()?.currentUser
                    if (currentUser) {
                        currentUser
                            .updatePhoneNumber(phoneCredential)
                            .then(() => {
                                firestore()
                                    .collection('users')
                                    .where('uid', '==', user?.uid)
                                    .get()
                                    .then(querySnapshot => {
                                        querySnapshot.forEach(doc => {
                                            doc.ref
                                                .update({
                                                    phoneNumber,
                                                })
                                                .then(() => {
                                                    reloadUser()
                                                })
                                        })
                                    })
                                resolve()
                            })
                            .catch(err => {
                                reject(err)
                            })
                    }
                })
                .catch(err => {
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
        setValue,
        getValue,
    }
}

const FirebaseContext = createContext({
    confirmationResult: null as ConfirmationResult | null,
    signInWithPhone: async (_phoneNumber: string, _force: boolean = false) => {},
    logout: async () => {},
    user: null as IUser | null,
    signInWithWhatsApp: async (_phoneNumber: string) => {},
    verifyCode: async (_code: string, _provider: 'phone' | 'whatsapp'): Promise<void> => {},
    signIn: async (_token: string) => {},
    phone: null as string | null,
    isLoading: true,
    reloadUser: async () => {},
    currentRoute: '',
    changeRoute: (_route: string) => {},
    changePhoneNumber: async (_phoneNumber: string, _code: string) => {},
    setValue: async (_key: string, _value: any) => {},
    getValue: async (_key: string): Promise<string | null> => {
        return ''
    },
})

const FirebaseProvider = (props: { children?: React.ReactNode }) => {
    return <FirebaseContext.Provider value={firebaseApp()}>{props.children}</FirebaseContext.Provider>
}

export const useFirebase = () => useContext(FirebaseContext)
export { FirebaseProvider }
