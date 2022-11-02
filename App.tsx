
import { extendTheme, NativeBaseProvider } from 'native-base';
import { Main } from './src';

const newColorTheme = {
  primary: {
    main: '#1a237e',
    dark: '#121858',
    light: '#474f97',
    contrastText: '#fff'
  },
  secondary: {
    main: '#f50057',
    dark: '#b28704',
    light: '#ffcd38',
    contrastText: '#000'
  }

  // brand: {
  //   900: "#8287af",
  //   800: "#7c83db",
  //   700: "#b3bef6",
  // },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <Main />
    </NativeBaseProvider>


  )
}
