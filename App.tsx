import { NavigationContainer } from '@react-navigation/native'
import { extendTheme, NativeBaseProvider } from 'native-base'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import { FirebaseProvider } from 'utils'
import store from 'utils/context'

import { Main } from './src'

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
        <Provider store={store}>
            <FirebaseProvider>
                <NativeBaseProvider theme={theme}>
                    <PaperProvider>
                        <NavigationContainer>
                            <Main />
                        </NavigationContainer>
                    </PaperProvider>
                </NativeBaseProvider>
            </FirebaseProvider>
        </Provider>
    )
}
