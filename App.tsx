import { DefaultTheme } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'

import { Main } from './src'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
  },
}

export default function App() {
  return (
    <NativeBaseProvider>
      <Main />
    </NativeBaseProvider>
      
    
  )
}
