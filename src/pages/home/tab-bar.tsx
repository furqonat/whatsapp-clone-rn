import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { setScreenName } from 'utils'
import { useAppDispatch } from 'utils/context'

import { Calls, Chats, Transaction } from './index'

const Tab = createMaterialTopTabNavigator()

function MyTabs() {
    const dispatch = useAppDispatch()
    return (
        <Tab.Navigator
            screenListeners={({ route }) => ({
                state: () => {
                    dispatch(setScreenName(route.name))
                },
            })}
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12, color: 'white' },
                tabBarStyle: { backgroundColor: '#5b21b6' },
            }}>
            <Tab.Screen
                name='Pesan'
                component={Chats}
            />
            <Tab.Screen
                name='Transaksi'
                component={Transaction}
            />
            <Tab.Screen
                name='Panggilan'
                component={Calls}
            />
        </Tab.Navigator>
    )
}

export { MyTabs }
