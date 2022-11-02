
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, VStack } from 'native-base';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebase } from 'utils';
import { RootStackParamList } from '../screens';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

type formScreenProp = StackNavigationProp<RootStackParamList, 'form'>;

const Otp = () => {
  const navigation = useNavigation<formScreenProp>()
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { confirmationResult } = useFirebase()

  const handlePress = () => {
    if (value.length === 6) {
      confirmationResult?.confirm(value).then((n) => {
        console.log(n)
        navigation.navigate('form')
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  return (
    <SafeAreaView>
      <VStack alignItems="center" space={2.5} h="100%" px="3">
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        <Button onPress={handlePress}>Verifikasi</Button>
      </VStack>
    </SafeAreaView>

  )
}

export { Otp };
