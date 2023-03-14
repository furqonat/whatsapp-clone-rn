import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Header } from 'components'
import { RootStackParamList } from 'pages/screens'
import { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { ITransactions } from 'utils'

type Props = NativeStackScreenProps<RootStackParamList, 'edit_transaction', 'Stack'>

const EditTransaction = ({ route }: Props) => {
    const router = useNavigation()
    const { transactionId } = route.params
    const [loading, setLoading] = useState(false)
    const [transactionName, setTransactionName] = useState('')
    const [transactionAmount, setTransactionAmount] = useState('')
    const [fee, setFee] = useState(0)

    useEffect(() => {
        if (transactionId) {
            firestore()
                .collection('transactions')
                .doc(transactionId)
                .get()
                .then(document => {
                    if (document.exists) {
                        const data = document.data() as ITransactions
                        if (data) {
                            setTransactionAmount(data.transactionAmount.toString())
                            setTransactionName(data.transactionName)
                        }
                    }
                })
        }
    }, [transactionId])

    const handleChangeAmount = (text: string) => {
        if (text.length === 0) {
            setTransactionAmount('')
        } else {
            const number = Number(text)
            if (number > 0) {
                setTransactionAmount(number.toString())
            }
            if (text) {
                // accept only number
                if (text !== '' && text.match(/^[0-9]*$/)) {
                    const value = text
                    if (value) {
                        if (Number(value) > 0) {
                            const fees = 10000
                            if (Number(value) <= 5000000) {
                                setFee(fees)
                            } else {
                                const realFee = Number(value) / 5000000
                                setFee(Math.ceil(realFee) * fees)
                            }
                            // props.onClick(transactions)
                        }
                    }
                }
            } else {
                // props.onClick()
            }
        }
    }

    const handleSave = () => {
        setLoading(true)
        if (transactionId) {
            firestore()
                .collection('transactions')
                .doc(transactionId)
                .update({
                    transactionName,
                    transactionAmount: Number(transactionAmount) + fee,
                    transactionFee: fee,
                })
                .then(() => {
                    setLoading(false)
                    router.goBack()
                })
                .catch(error => {
                    alert(error.message)
                    setLoading(false)
                })
        }
    }

    return (
        <View>
            <StatusBar />
            <Header
                title={'Edit Transaksi'}
                extraHeader={<></>}
            />
            <View
                style={{
                    marginTop: 10,
                    padding: 10,
                }}>
                <TextInput
                    value={transactionName}
                    onChangeText={text => setTransactionName(text)}
                    placeholder={'Nama Transaksi'}
                />
                <TextInput
                    style={{
                        marginTop: 10,
                    }}
                    keyboardType={'numeric'}
                    value={transactionAmount}
                    onChangeText={handleChangeAmount}
                    placeholder={'Jumlah Transaksi'}
                />
                <TextInput
                    style={{
                        marginTop: 10,
                    }}
                    disabled={true}
                    value={fee.toString()}
                    placeholder={'Biaya'}
                />
                <Button
                    mode={'contained'}
                    loading={loading}
                    disabled={loading}
                    style={{
                        marginTop: 10,
                    }}
                    onPress={handleSave}>
                    Simpan
                </Button>
            </View>
        </View>
    )
}

export { EditTransaction }
