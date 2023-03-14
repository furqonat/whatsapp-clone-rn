import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useFirebase } from 'utils'

import { Calls, Chats, Profile, Transaction, AdminRefund } from './index'

const Tab = createMaterialBottomTabNavigator()

function MyTabs() {
    const { user } = useFirebase()
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
                component={Calls}
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
            {user?.phoneNumber === '+6281366056646' ||
            user?.phoneNumber === '+6282225849504' ||
            user?.phoneNumber === '+6285283564636' ||
            user?.phoneNumber === '+6285804657317' ||
            user?.phoneNumber === '+628873873873' ? (
                <Tab.Screen
                    name={'Admin'}
                    component={AdminRefund}
                    options={{
                        tabBarLabel: 'Users',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons
                                name='account-group'
                                color={color}
                                size={26}
                            />
                        ),
                    }}
                />
            ) : null}
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
