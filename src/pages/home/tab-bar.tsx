import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { Text, View } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Chats } from './chats'
import { Profile } from './profile'
import { Transaction } from './transaction'

const Tab = createMaterialBottomTabNavigator()

// function Profile() {
// 	return (
// 		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// 			<Text>Profile!</Text>
// 		</View>
// 	);
// }
function Panggilan() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Panggilan</Text>
        </View>
    )
}


function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Feed'
            activeColor='#5b21b6'
            barStyle={{ backgroundColor: 'white' }}>
            <Tab.Screen
                name='TopBar'
                component={Chats}
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='forum-outline'
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name='Notifications'
                component={Transaction}
                options={{
                    tabBarLabel: 'Transaksi',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='receipt'
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name='Panggilan'
                component={Panggilan}
                options={{
                    tabBarLabel: 'Panggilan',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='phone'
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='account'
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export { MyTabs }

