import * as Notifications from 'expo-notifications'
import { extendTheme, NativeBaseProvider } from 'native-base'
import { FirebaseProvider } from 'utils'

import { Main } from './src'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
})

const newColorTheme = {
    primary: {
        main: '#1a237e',
        dark: '#121858',
        light: '#474f97',
        contrastText: '#fff',
    },
    secondary: {
        main: '#f50057',
        dark: '#b28704',
        light: '#ffcd38',
        contrastText: '#000',
    },
}
const theme = extendTheme({ colors: newColorTheme })

export default function App() {
    return (
        <FirebaseProvider>
            <NativeBaseProvider theme={theme}>
                <Main />
            </NativeBaseProvider>
        </FirebaseProvider>
    )
}
