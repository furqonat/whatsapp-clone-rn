import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { VStack, Image } from 'native-base'
import { ChatItem, Form, MyTabs, NewTransaction, Otp, QrCamera, SignIn, Transaction } from 'pages'
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

    useEffect(() => {
        if (user) {
            setIndexScreen('tabbar')
        } else {
            setIndexScreen('signin')
        }
    }, [user])

    if (isLoading) {
        return loading
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name={indexScreen}
                    component={indexScreen === 'signin' ? SignIn : MyTabs}
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
                    component={NewTransaction}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { Main }

