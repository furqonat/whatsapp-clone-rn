import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as Notifications from 'expo-notifications'
import moment from 'moment'
import { Image, VStack } from 'native-base'
import {
    AboutUs,
    ChangePhone,
    ChatItem,
    EditTransaction,
    Form,
    MyTabs,
    NewTransaction,
    Otp,
    Privacy,
    PrivateProfile,
    PublicProfile,
    QrCamera,
    Refund,
    SignIn,
} from 'pages'
import { Transaction as TransactionDetail } from 'pages/home/users/transaction'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useFirebase, USER_KEY } from 'utils'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
})

async function schedulePushNotification(props: { title: string; body: string; identifier?: string }) {
    await Notifications.scheduleNotificationAsync({
        identifier: props.identifier,
        content: {
            title: props.title,
            body: props.body,
        },
        trigger: { seconds: 1 },
    })
}

async function subscribeForNotification(id: string | number, phoneNumber: string) {
    firestore()
        .collection('chats')
        .doc(id.toString())
        .collection('messages')
        .onSnapshot(querySnapshot => {
            if (querySnapshot.empty) {
                // todo
            } else {
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const receiverPhoneNumber = change.doc.data().receiver.phoneNumber
                        const messageAt = change.doc.data().message.createdAt
                        const senderName = change.doc.data().sender.displayName
                        const type = change.doc.data().type === 'text'
                        const diff = moment().diff(moment(messageAt), 'minutes')
                        if (phoneNumber === receiverPhoneNumber && diff < 1) {
                            schedulePushNotification({
                                identifier: receiverPhoneNumber,
                                title: senderName,
                                body: type ? change.doc.data().message.text : 'Mengirimkan gambar',
                            })
                        }
                    }
                })
            }
        })
}

const Stack = createStackNavigator<RootStackParamList>()

const Loading = (
    <VStack
        height={'100%'}
        justifyContent={'center'}
        alignContent={'center'}
        alignItems={'center'}>
        <Image
            resizeMode='contain'
            source={require('./assets/adaptive-icon.png')}
            alt='logo'
        />
    </VStack>
)

const updateStatusUser = (phoneNumber: string, status: boolean) => {
    return new Promise<void>((resolve, reject) => {
        firestore()
            .collection('users')
            .where('phoneNumber', '==', phoneNumber)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(documentSnapshot => {
                        documentSnapshot.ref
                            .update({
                                status: status ? 'online' : new Date().toISOString(),
                            })
                            .then(() => {
                                resolve()
                            })
                            .catch(error => {
                                reject(error)
                            })
                    })
                }
            })
            .catch(error => {
                reject(error)
            })
    })
}

const Main = () => {
    const appState = useRef(AppState.currentState)
    const [indexScreen, setIndexScreen] = useState<'signin' | 'tabbar'>('signin')

    const [loading, setLoading] = useState(true)
    const { user, getValue } = useFirebase()

    useEffect(() => {
        setLoading(true)
        getValue(USER_KEY).then(user => {
            if (user && user.length > 20) {
                setIndexScreen('tabbar')
                setLoading(false)
            } else {
                setIndexScreen('signin')
                setLoading(false)
                if (auth().currentUser) {
                    auth()
                        .signOut()
                        .then(() => {
                            if (auth()?.currentUser) {
                                auth()?.currentUser?.delete()
                            }
                        })
                }
            }
        })
    }, [auth])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            getValue(USER_KEY).then(users => {
                if (users && users.length > 20) {
                    if (user && user?.phoneNumber) {
                        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                            updateStatusUser(user?.phoneNumber as string, true).then(() => {})
                        } else {
                            appState.current = nextAppState
                            updateStatusUser(user?.phoneNumber as string, false).then(() => {})
                            return firestore()
                                .collection('chats')
                                .onSnapshot(querySnapshot => {
                                    if (querySnapshot.empty) {
                                        // todo
                                    } else {
                                        querySnapshot.docChanges().forEach(change => {
                                            const id = change.doc.id
                                            if (change.type === 'added') {
                                                subscribeForNotification(id, user?.phoneNumber as string).then(() => {})
                                            }
                                            if (change.type === 'modified') {
                                                subscribeForNotification(id, user?.phoneNumber as string).then(() => {})
                                            }
                                        })
                                    }
                                })
                        }
                    }
                }
            })
        })
        return () => {
            subscription.remove()
        }
    }, [user?.phoneNumber, user, getValue])

    if (loading) {
        return Loading
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name={indexScreen === 'signin' ? 'signin' : 'tabbar'}
                    component={indexScreen === 'signin' ? SignIn : MyTabs}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name={indexScreen === 'tabbar' ? 'signin' : 'tabbar'}
                    component={indexScreen === 'tabbar' ? SignIn : MyTabs}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='qr'
                    component={QrCamera}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='otp'
                    initialParams={{
                        provider: 'phone',
                    }}
                    component={Otp}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='form'
                    component={Form}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='chatItem'
                    initialParams={{
                        chatId: null,
                        phoneNumber: null,
                    }}
                    component={ChatItem}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='new_transaction'
                    initialParams={{
                        contact: null,
                    }}
                    component={NewTransaction}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='profile_diri'
                    component={PrivateProfile}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='profile_publik'
                    component={PublicProfile}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='tentang_kami'
                    component={AboutUs}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='privasi'
                    component={Privacy}
                />
                <Stack.Screen
                    name={'change_phone'}
                    component={ChangePhone}
                    initialParams={{
                        new_phone: '',
                    }}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={'refund'}
                    component={Refund}
                    initialParams={{
                        transactionId: '',
                    }}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={'transaction_detail'}
                    component={TransactionDetail}
                    options={{ headerShown: false }}
                    initialParams={{
                        transaction: null,
                    }}
                />
                <Stack.Screen
                    name={'edit_transaction'}
                    component={EditTransaction}
                    options={{ headerShown: false }}
                    initialParams={{
                        transactionId: '',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { Main }
