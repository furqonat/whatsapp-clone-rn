import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import * as Notifications from 'expo-notifications'
import moment from 'moment'
import { Image, VStack } from 'native-base'
import {
    AboutUs,
    AdminRefund,
    ChangePhone,
    ChatItem,
    EditTransaction,
    Form,
    MyTabs,
    NewTransaction,
    Otp,
    Privacy,
    PrivateProfile,
    Profile,
    PublicProfile,
    QrCamera,
    Refund,
    SignIn,
} from 'pages'
import { Transaction as TransactionDetail } from 'pages/home/users/transaction'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useRef, useState } from 'react'
import { AppState, View } from 'react-native'
import { IconButton, Menu } from 'react-native-paper'
import { useFirebase, USER_KEY } from 'utils'
import { useAppDispatch, useAppSelector } from 'utils/context'
import { setUser } from 'utils/context/users'

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
type RefStack = StackNavigationProp<RootStackParamList>

const Main = () => {
    const navigation = useNavigation<RefStack>()
    const appState = useRef(AppState.currentState)
    const [indexScreen, setIndexScreen] = useState('signin')
    const [menuVisible, setMenuVisible] = useState(false)

    const [loading, setLoading] = useState(true)
    const { user, getValue } = useFirebase()
    const screen = useAppSelector(state => state.header.name)
    const currentUser = useAppSelector(state => state.users.currentUser)
    const dispatch = useAppDispatch()
    useEffect(() => {
        setLoading(true)
        getValue(USER_KEY)
            .then(user => {
                dispatch(setUser(user))
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [auth])

    useEffect(() => {
        if (currentUser === 'no') {
            setIndexScreen('signin')
        } else {
            setIndexScreen('tabbar')
        }
    }, [currentUser])

    console.log(indexScreen, currentUser)

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
    const handleQr = () => {
        navigation.navigate('qr')
    }
    const handleToProfile = () => {
        navigation.navigate('profile')
    }
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    headerShown: indexScreen === 'tabbar',
                    title: 'Rekberin',
                    headerStyle: {
                        backgroundColor: '#5b21b6',
                        shadowColor: '#5b21b6',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                            {screen === 'Pesan' && (
                                <IconButton
                                    onPress={handleQr}
                                    icon={'camera-outline'}
                                    color={'#fff'}
                                />
                            )}
                            <Menu
                                onDismiss={() => {
                                    setMenuVisible(false)
                                }}
                                visible={menuVisible}
                                anchor={
                                    <IconButton
                                        onPress={() => {
                                            setMenuVisible(true)
                                        }}
                                        icon={'dots-vertical'}
                                        color={'#fff'}
                                    />
                                }>
                                {user?.phoneNumber === '+6281366056646' ||
                                user?.phoneNumber === '+6282225849504' ||
                                user?.phoneNumber === '+6285283564636' ||
                                user?.phoneNumber === '+6285804657317' ||
                                user?.phoneNumber === '+628873873873' ? (
                                    <Menu.Item
                                        onPress={() => {
                                            setMenuVisible(false)
                                            navigation.navigate('transaction')
                                        }}
                                        title={'Admin'}
                                    />
                                ) : null}
                                <Menu.Item
                                    onPress={() => {
                                        setMenuVisible(false)
                                        handleToProfile()
                                    }}
                                    title='Profile'
                                />
                            </Menu>
                        </View>
                    ),
                }}
                name={indexScreen === 'signin' ? 'signin' : 'tabbar'}
                component={indexScreen === 'signin' ? SignIn : MyTabs}
            />
            <Stack.Screen
                options={{
                    headerShown: indexScreen === 'tabbar',
                    headerTitle: 'Rekberin',
                    headerBackgroundContainerStyle: {
                        backgroundColor: '#5b21b6',
                    },
                }}
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
            <Stack.Screen
                name={'profile'}
                component={Profile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'transaction'}
                component={AdminRefund}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export { Main }
