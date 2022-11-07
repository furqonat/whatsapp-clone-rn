import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatItem, Form, MyTabs, Otp, SignIn } from "pages";
import { RootStackParamList } from "pages/screens";
import { FirebaseProvider } from 'utils';

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

const Main = () => {

    return (
        <FirebaseProvider>
            <NavigationContainer>
                <Stack.Navigator >
                    <Stack.Screen options={{ headerShown: false }} name="signin" component={SignIn} />
                    <Stack.Screen options={{ headerShown: false }} name="otp" component={Otp} />
                    <Stack.Screen options={{ headerShown: false }} name="tabbar" component={MyTabs} />
                    <Stack.Screen options={{ headerShown: false }} name="form" component={Form} />
                    <Stack.Screen options={{ headerShown: false }} name="chatItem" initialParams={{
                        chatId: null,
                        chatItem: null
                    }} component={ChatItem} />
                </Stack.Navigator>

            </NavigationContainer>
        </FirebaseProvider>
    )
}

export { Main }
