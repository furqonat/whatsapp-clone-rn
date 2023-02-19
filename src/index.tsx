import firestore from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Image, VStack } from 'native-base'
import {
    AboutUs,
    ChangePhone,
    ChatItem,
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
import { RootStackParamList } from 'pages/screens'
import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useFirebase, USER_KEY } from 'utils'

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
            }
        })
    }, [])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            getValue(USER_KEY).then(users => {
                if (users && users.length > 20) {
                    if (user && user?.phoneNumber) {
                        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                            updateStatusUser(user?.phoneNumber as string, true).then(() => {
                                console.log('tidak aktif')
                            })
                        } else {
                            appState.current = nextAppState
                            updateStatusUser(user?.phoneNumber as string, false).then(() => {
                                console.log('aktif')
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

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            } else {
                appState.current = nextAppState
            }
        })
        return () => {
            subscription.remove()
        }
    }, [])

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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { Main }
