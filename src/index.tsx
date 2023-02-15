import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { getValue } from 'lib'
import { Image, VStack } from 'native-base'
import { ChangePhone, ChatItem, Form, MyTabs, NewTransaction, Otp, Privasi, ProfileDiri, ProfilePublik, QrCamera, Refund, SignIn, TentangKami } from 'pages'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { USER_KEY } from 'utils'

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

const Main = () => {
    const [indexScreen, setIndexScreen] = useState<'signin' | 'tabbar'>('signin')

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        // if current route is not signin, otp, or form and user is not null, set index screen to tabbar
        // else set index screen to signin
        getValue(USER_KEY).then((user) => {
            if (user && typeof user === 'string' && user.length > 20) {
                setIndexScreen('tabbar')
                setLoading(false)
            } else {
                setIndexScreen('signin')
                setLoading(false)
            }
        })

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
                    name="new_transaction"
                    initialParams={{
                        contact: null,
                    }}
                    component={NewTransaction} />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='profile_diri'
                    component={ProfileDiri}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='profile_publik'
                    component={ProfilePublik}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='tentang_kami'
                    component={TentangKami}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name='privasi'
                    component={Privasi}
                />
                <Stack.Screen
                    name={'change_phone'}
                    component={ChangePhone}
                    initialParams={{
                        new_phone: '',
                    }}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name={'refund'}
                    component={Refund}
                    initialParams={{
                        transactionId: '',
                    }}
                    options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { Main }

