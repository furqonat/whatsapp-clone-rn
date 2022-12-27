import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useChangeRoute } from 'hooks'
import { VStack, Image } from 'native-base'
import { ChatItem, Form, MyTabs, NewTransaction, Otp, Privasi, ProfileDiri, ProfilePublik, QrCamera, SignIn, TentangKami, Transaction } from 'pages'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { useFirebase } from 'utils'

const Stack = createStackNavigator<RootStackParamList>()

const loading = (
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

    const { user, isLoading } = useFirebase()
    const [currentRoute, setCurrentRoute] = useState('')

    useEffect(() => {
        console.log(currentRoute)
        // if current route is not signin, otp, or form and user is not null, set index screen to tabbar
        // else set index screen to signin
        if (currentRoute !== 'form' && user) {
            setIndexScreen('tabbar')
        } else {
            setIndexScreen('signin')
        }
    }, [user, currentRoute])

    if (isLoading) {
        return loading
    }


    return (
        <NavigationContainer
            onStateChange={(state) => {
                const currentRoute = state?.routes[state.index].name
                setCurrentRoute(currentRoute || "")
            }}>
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { Main }

