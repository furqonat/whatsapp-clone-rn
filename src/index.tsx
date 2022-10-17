import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SignIn } from "pages"

const Stack = createStackNavigator()

const Main = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={SignIn} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export { Main }