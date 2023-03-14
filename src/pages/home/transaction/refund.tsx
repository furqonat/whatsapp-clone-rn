import { Ionicons } from '@expo/vector-icons'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { IconButton } from 'native-base'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { ScrollView, StatusBar, Text, View } from 'react-native'
import { ActivityIndicator, Button, Dialog, TextInput } from 'react-native-paper'
import { useFirebase } from 'utils'

type Props = NativeStackScreenProps<RootStackParamList, 'refund'>

const Refund = ({ route }: Props) => {
    const [reason, setReason] = useState('')
    const [amount, setAmount] = useState('')
    const [currentAmount, setCurrentAmount] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    const { user } = useFirebase()

    const handleRefund = () => {
        setLoading(true)
        firestore()
            .collection('transactions')
            .doc(route.params.transactionId)
            .update({
                status: 'request-refund',
                refund: {
                    reason,
                    createdAt: new Date().toISOString(),
                    amount: Number(amount),
                    requestBy: user?.phoneNumber,
                },
            })
            .then(() => {
                setLoading(false)
                navigation.goBack()
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const handleBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        firestore()
            .collection('transactions')
            .doc(route.params.transactionId)
            .get()
            .then(document => {
                if (document.exists) {
                    const data = document.data()
                    setCurrentAmount(data?.transactionAmount.toString())
                }
            })
    }, [])

    return (
        <View
            style={{
                height: '100%',
                flexDirection: 'column',
            }}>
            <StatusBar
                animated={true}
                backgroundColor={'#5b21b6'}
            />
            <View
                style={{
                    zIndex: 1,
                    height: 60,
                    display: 'flex',
                    backgroundColor: '#5b21b6',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        right: 10,
                    }}>
                    <IconButton
                        onPress={handleBack}
                        borderRadius='full'
                        _icon={{
                            as: Ionicons,
                            name: 'arrow-back-outline',
                            color: 'white',
                            size: '6',
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                        }}>
                        Pengajuan refund
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View
                    style={{
                        width: '100%',
                        marginBottom: 10,
                    }}>
                    <View
                        style={{
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'column',
                            marginTop: 10,
                            padding: 5,
                        }}>
                        <Text>Jumlah refund maksimal Rp. {currentAmount}</Text>
                        <TextInput
                            mode={'outlined'}
                            value={amount.toString()}
                            onChangeText={text => {
                                if (isNaN(parseInt(text, 10))) {
                                    setAmount('')
                                } else {
                                    setAmount(text)
                                }
                            }}
                            keyboardType={'numeric'}
                            placeholder={'Masukan jumlah refund'}
                        />
                        <TextInput
                            mode={'outlined'}
                            value={reason}
                            onChangeText={setReason}
                            multiline={true}
                            numberOfLines={5}
                            style={{
                                marginTop: 10,
                            }}
                            placeholder={'Masukan alasan refund'}
                        />

                        <Button
                            style={{
                                marginTop: 10,
                            }}
                            loading={loading}
                            mode={'contained'}
                            onPress={handleRefund}>
                            Ajukan refund
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Dialog visible={loading}>
                <Dialog.Content>
                    <ActivityIndicator />
                </Dialog.Content>
            </Dialog>
        </View>
    )
}

export { Refund }
