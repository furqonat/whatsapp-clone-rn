import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Chats, Form, MyTabs, Otp, SignIn, SplashScreen } from "pages"
import { RootStackParamList } from "pages/screens"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

const Main = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator >
                <Stack.Screen options={{headerShown: false}} name="signin" component={SignIn} />
                <Stack.Screen options={{headerShown: false}} name="otp" component={Otp} />
                <Stack.Screen options={{headerShown: false}} name="tabbar" component={MyTabs} />
                <Stack.Screen options={{headerShown: false}} name="form" component={Form} />
            </Stack.Navigator>
            
        </NavigationContainer>
    )
}

export { Main }